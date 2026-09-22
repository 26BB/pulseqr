// PulseQR Store — LocalStorage & Cross-Tab Realtime Synchronizer
import { INITIAL_FEEDBACKS, INITIAL_SETTINGS } from "./mockData";

const STORAGE_KEY_FEEDBACKS = "pulseqr_feedbacks_v1";
const STORAGE_KEY_SETTINGS = "pulseqr_settings_v1";

let channel = null;
try {
  channel = new BroadcastChannel("pulseqr_realtime_channel");
} catch (e) {
  console.warn("BroadcastChannel not supported in this browser environment", e);
}

// Helper to clamp numeric ratings to safe 1-5 integer bounds
const sanitizeRating = (val) => {
  const num = Number(val);
  if (isNaN(num)) return 3;
  return Math.min(5, Math.max(1, Math.round(num)));
};

// Helper to sanitize & truncate string inputs to prevent LocalStorage DoS / bloat
const sanitizeString = (str, maxLen = 100, fallback = "") => {
  if (typeof str !== "string") return fallback;
  return str.trim().slice(0, maxLen);
};

// Helper to validate and sanitize settings object shape (Security: Cross-tab & LocalStorage input validation)
const sanitizeSettings = (obj) => {
  if (!obj || typeof obj !== "object") return INITIAL_SETTINGS;
  return {
    cafeName: sanitizeString(obj.cafeName, 100, INITIAL_SETTINGS.cafeName),
    branch: sanitizeString(obj.branch, 100, INITIAL_SETTINGS.branch),
    address: sanitizeString(obj.address, 200, INITIAL_SETTINGS.address),
    ownerName: sanitizeString(obj.ownerName, 100, INITIAL_SETTINGS.ownerName),
    ownerPhone: sanitizeString(obj.ownerPhone, 30, INITIAL_SETTINGS.ownerPhone),
    discountCode: sanitizeString(obj.discountCode, 20, INITIAL_SETTINGS.discountCode),
    alertThreshold: Math.min(5, Math.max(1, Math.round(Number(obj.alertThreshold) || 2))),
    tableCount: Math.min(100, Math.max(1, Math.round(Number(obj.tableCount) || 15))),
  };
};

const VALID_STATUSES = ["ACKNOWLEDGED", "ALERT_TRIGGERED", "RESOLVED"];

// Helper to validate and sanitize individual feedback objects (Security: Deep input validation & truncation)
const sanitizeFeedbackItem = (fb) => {
  if (!fb || typeof fb !== "object" || typeof fb.id !== "string") return null;
  const ratings = {
    food: sanitizeRating(fb.ratings?.food),
    service: sanitizeRating(fb.ratings?.service),
    ambiance: sanitizeRating(fb.ratings?.ambiance),
  };
  const overall = typeof fb.overallScore === "number" && !isNaN(fb.overallScore)
    ? Number(fb.overallScore.toFixed(1))
    : Number(((ratings.food + ratings.service + ratings.ambiance) / 3).toFixed(1));

  const safeTags = Array.isArray(fb.tags)
    ? fb.tags.slice(0, 10).map((t) => sanitizeString(t, 50)).filter(Boolean)
    : [];

  const safeStatus = VALID_STATUSES.includes(fb.status) ? fb.status : "ACKNOWLEDGED";

  return {
    id: sanitizeString(fb.id, 50, `fb-${Date.now()}`),
    table: sanitizeString(fb.table, 10, "04") || "04",
    timestamp: sanitizeString(fb.timestamp, 50, new Date().toISOString()),
    displayTime: sanitizeString(fb.displayTime, 30, "Just now"),
    ratings,
    overallScore: overall,
    comment: sanitizeString(fb.comment, 500, "No written comment provided.") || "No written comment provided.",
    tags: safeTags,
    status: safeStatus,
    barista: sanitizeString(fb.barista, 50, "Pranav") || "Pranav",
    guestName: sanitizeString(fb.guestName, 50, "Guest") || "Guest",
    isAlert: Boolean(fb.isAlert),
    ...(fb.resolutionNote ? { resolutionNote: sanitizeString(fb.resolutionNote, 500, "") } : {}),
  };
};

// Helper to validate each feedback item shape (Security: Input Validation & DoS prevention for untrusted BroadcastChannel / storage events)
const sanitizeFeedbackArray = (arr) => {
  if (!Array.isArray(arr)) return INITIAL_FEEDBACKS;
  // Truncate array length to 100 to prevent LocalStorage / BroadcastChannel DoS (Uncontrolled Resource Consumption)
  return arr.slice(0, 100).map(sanitizeFeedbackItem).filter(Boolean);
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return sanitizeSettings(parsed);
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = (newSettings) => {
  try {
    const sanitizedSettings = sanitizeSettings(newSettings);
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(sanitizedSettings));
    if (channel) channel.postMessage({ type: "SETTINGS_UPDATED", payload: sanitizedSettings });
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};

export const getStoredFeedbacks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FEEDBACKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(INITIAL_FEEDBACKS));
      return INITIAL_FEEDBACKS;
    }
    const parsed = JSON.parse(raw);
    return sanitizeFeedbackArray(parsed);
  } catch {
    return INITIAL_FEEDBACKS;
  }
};

export const saveFeedbacks = (feedbacks) => {
  try {
    const sanitized = sanitizeFeedbackArray(feedbacks);
    localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(sanitized));
    if (channel) channel.postMessage({ type: "FEEDBACKS_UPDATED", payload: sanitized });
    return sanitized;
  } catch (e) {
    console.error("Failed to save feedbacks", e);
    return sanitizeFeedbackArray(feedbacks);
  }
};

export const addFeedback = (feedbackData) => {
  const current = getStoredFeedbacks();
  const settings = getStoredSettings();

  // Validate and clamp ratings (Security: Input Validation)
  const ratings = {
    food: sanitizeRating(feedbackData?.ratings?.food),
    service: sanitizeRating(feedbackData?.ratings?.service),
    ambiance: sanitizeRating(feedbackData?.ratings?.ambiance),
  };

  const overall = Number(
    ((ratings.food + ratings.service + ratings.ambiance) / 3).toFixed(1)
  );

  const isAlert =
    ratings.food <= settings.alertThreshold ||
    ratings.service <= settings.alertThreshold ||
    overall <= settings.alertThreshold;

  // Truncate strings & tags (Security: LocalStorage DoS / Quota Exhaustion prevention)
  const commentText = sanitizeString(feedbackData?.comment, 500, "No written comment provided.");
  const safeTags = Array.isArray(feedbackData?.tags)
    ? feedbackData.tags.slice(0, 10).map((t) => sanitizeString(t, 50)).filter(Boolean)
    : [];

  const newEntry = {
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    table: sanitizeString(feedbackData?.table, 10, "04") || "04",
    timestamp: new Date().toISOString(),
    displayTime: "Just now",
    ratings,
    overallScore: overall,
    comment: commentText || "No written comment provided.",
    tags: safeTags,
    status: isAlert ? "ALERT_TRIGGERED" : "ACKNOWLEDGED",
    barista: sanitizeString(feedbackData?.barista, 50, "Pranav") || "Pranav",
    guestName: sanitizeString(feedbackData?.guestName, 50, "Guest") || "Guest",
    isAlert,
  };

  const updated = [newEntry, ...current];
  return saveFeedbacks(updated);
};

export const updateFeedbackStatus = (id, newStatus, note = "") => {
  const current = getStoredFeedbacks();
  const safeNote = sanitizeString(note, 500, "");
  const safeStatus = VALID_STATUSES.includes(newStatus) ? newStatus : "ACKNOWLEDGED";
  const updated = current.map((fb) => {
    if (fb.id === id) {
      return {
        ...fb,
        status: safeStatus,
        resolutionNote: safeNote || fb.resolutionNote,
      };
    }
    return fb;
  });
  return saveFeedbacks(updated);
};

export const resetToSeedData = () => {
  localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(INITIAL_FEEDBACKS));
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  if (channel) channel.postMessage({ type: "RESET_ALL" });
  return { feedbacks: INITIAL_FEEDBACKS, settings: INITIAL_SETTINGS };
};

export const subscribeToRealtime = (callback) => {
  const handleMessage = (event) => {
    if (event?.data && typeof event.data === "object") {
      const { type, payload } = event.data;
      if (type === "FEEDBACKS_UPDATED") {
        callback({ type, payload: sanitizeFeedbackArray(payload) });
      } else if (type === "SETTINGS_UPDATED") {
        callback({ type, payload: sanitizeSettings(payload) });
      } else if (type === "RESET_ALL") {
        callback({ type });
      }
    }
  };

  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY_FEEDBACKS) {
      try {
        const parsed = JSON.parse(event.newValue || "[]");
        callback({ type: "FEEDBACKS_UPDATED", payload: sanitizeFeedbackArray(parsed) });
      } catch {
        callback({ type: "FEEDBACKS_UPDATED", payload: [] });
      }
    } else if (event.key === STORAGE_KEY_SETTINGS) {
      try {
        const parsed = JSON.parse(event.newValue || "{}");
        callback({ type: "SETTINGS_UPDATED", payload: sanitizeSettings(parsed) });
      } catch {
        callback({ type: "SETTINGS_UPDATED", payload: INITIAL_SETTINGS });
      }
    }
  };

  if (channel) channel.addEventListener("message", handleMessage);
  window.addEventListener("storage", handleStorage);

  return () => {
    if (channel) channel.removeEventListener("message", handleMessage);
    window.removeEventListener("storage", handleStorage);
  };
};

export const generateRandomDemoFeedback = () => {
  const tables = ["01", "02", "04", "07", "09", "11", "12", "15"];
  const randomTable = tables[Math.floor(Math.random() * tables.length)];
  const isBad = Math.random() < 0.35; // 35% chance of bad review to show off alert system

  if (isBad) {
    return addFeedback({
      table: randomTable,
      ratings: { food: 2, service: 1, ambiance: 3 },
      comment: "Wait time was excessive for iced latte and tables hadn't been cleared.",
      tags: ["Slow Service ⏰", "Dirty Table 🧹"],
      guestName: "Priya K.",
      barista: "Aakash",
    });
  } else {
    return addFeedback({
      table: randomTable,
      ratings: { food: 5, service: 5, ambiance: 4 },
      comment: "Super smooth cappuccino and very helpful staff! Love the cozy decor.",
      tags: ["Great Coffee ☕", "Friendly Staff ✨"],
      guestName: "Rohan V.",
      barista: "Pranav",
    });
  }
};

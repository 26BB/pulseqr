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

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = (newSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
    if (channel) channel.postMessage({ type: "SETTINGS_UPDATED", payload: newSettings });
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
    return JSON.parse(raw);
  } catch {
    return INITIAL_FEEDBACKS;
  }
};

export const saveFeedbacks = (feedbacks) => {
  try {
    localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(feedbacks));
    if (channel) channel.postMessage({ type: "FEEDBACKS_UPDATED", payload: feedbacks });
  } catch (e) {
    console.error("Failed to save feedbacks", e);
  }
};

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
    id: `fb-${Date.now().toString().slice(-4)}`,
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
  saveFeedbacks(updated);
  return newEntry;
};

export const updateFeedbackStatus = (id, newStatus, note = "") => {
  const current = getStoredFeedbacks();
  const updated = current.map((fb) => {
    if (fb.id === id) {
      return {
        ...fb,
        status: newStatus,
        resolutionNote: note || fb.resolutionNote,
      };
    }
    return fb;
  });
  saveFeedbacks(updated);
  return updated;
};

export const resetToSeedData = () => {
  localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(INITIAL_FEEDBACKS));
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  if (channel) channel.postMessage({ type: "RESET_ALL" });
  return { feedbacks: INITIAL_FEEDBACKS, settings: INITIAL_SETTINGS };
};

export const subscribeToRealtime = (callback) => {
  const handleMessage = (event) => {
    if (event.data) {
      callback(event.data);
    }
  };

  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY_FEEDBACKS) {
      callback({ type: "FEEDBACKS_UPDATED", payload: JSON.parse(event.newValue || "[]") });
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

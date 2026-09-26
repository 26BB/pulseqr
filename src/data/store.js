// PulseQR Store — LocalStorage & Cross-Tab Realtime Synchronizer
import { INITIAL_FEEDBACKS, INITIAL_SETTINGS } from "./mockData";

const STORAGE_KEY_FEEDBACKS = "pulseqr_feedbacks_v1";
const STORAGE_KEY_SETTINGS = "pulseqr_settings_v1";

// Optimization: In-memory store cache prevents synchronous main-thread localStorage disk reads and JSON.parse on every mutation
let cachedFeedbacks = null;
let cachedSettings = null;

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
// Optimization: If the input object already matches all sanitized properties, return the original object reference
// to maintain object reference identity, preventing unnecessary React component re-renders when consumed by React.memo components.
const sanitizeSettings = (obj) => {
  if (!obj || typeof obj !== "object") return INITIAL_SETTINGS;
  const cafeName = sanitizeString(obj.cafeName, 100, INITIAL_SETTINGS.cafeName);
  const branch = sanitizeString(obj.branch, 100, INITIAL_SETTINGS.branch);
  const address = sanitizeString(obj.address, 200, INITIAL_SETTINGS.address);
  const ownerName = sanitizeString(obj.ownerName, 100, INITIAL_SETTINGS.ownerName);
  const ownerPhone = sanitizeString(obj.ownerPhone, 30, INITIAL_SETTINGS.ownerPhone);
  const discountCode = sanitizeString(obj.discountCode, 20, INITIAL_SETTINGS.discountCode);
  const alertThreshold = Math.min(5, Math.max(1, Math.round(Number(obj.alertThreshold) || 2)));
  const tableCount = Math.min(100, Math.max(1, Math.round(Number(obj.tableCount) || 15)));

  if (
    obj.cafeName === cafeName &&
    obj.branch === branch &&
    obj.address === address &&
    obj.ownerName === ownerName &&
    obj.ownerPhone === ownerPhone &&
    obj.discountCode === discountCode &&
    obj.alertThreshold === alertThreshold &&
    obj.tableCount === tableCount
  ) {
    return obj;
  }

  return {
    cafeName,
    branch,
    address,
    ownerName,
    ownerPhone,
    discountCode,
    alertThreshold,
    tableCount,
  };
};

const VALID_STATUSES = ["ACKNOWLEDGED", "ALERT_TRIGGERED", "RESOLVED"];

// Helper to validate and sanitize individual feedback objects (Security: Deep input validation & truncation)
// Optimization: Checks if input properties already match sanitized outputs and reuses original object & array references
// to preserve object identity across real-time storage/broadcast events, enabling React.memo (e.g. FeedbackCard) to skip re-renders.
const sanitizeFeedbackItem = (fb) => {
  if (!fb || typeof fb !== "object" || typeof fb.id !== "string") return null;

  const food = sanitizeRating(fb.ratings?.food);
  const service = sanitizeRating(fb.ratings?.service);
  const ambiance = sanitizeRating(fb.ratings?.ambiance);

  const ratingsChanged =
    !fb.ratings ||
    fb.ratings.food !== food ||
    fb.ratings.service !== service ||
    fb.ratings.ambiance !== ambiance;

  const ratings = ratingsChanged ? { food, service, ambiance } : fb.ratings;

  const overall = typeof fb.overallScore === "number" && !isNaN(fb.overallScore)
    ? Number(fb.overallScore.toFixed(1))
    : Number(((food + service + ambiance) / 3).toFixed(1));

  let safeTags = fb.tags;
  if (!Array.isArray(fb.tags)) {
    safeTags = [];
  } else {
    const truncated = fb.tags.slice(0, 10);
    let tagsChanged = fb.tags.length !== truncated.length;
    const cleanTags = [];
    for (let i = 0; i < truncated.length; i++) {
      const tagStr = sanitizeString(truncated[i], 50);
      if (tagStr !== truncated[i]) tagsChanged = true;
      if (tagStr) cleanTags.push(tagStr);
    }
    if (tagsChanged || cleanTags.length !== truncated.length) {
      safeTags = cleanTags;
    }
  }

  const safeStatus = VALID_STATUSES.includes(fb.status) ? fb.status : "ACKNOWLEDGED";
  const id = sanitizeString(fb.id, 50, `fb-${Date.now()}`);
  const table = sanitizeString(fb.table, 10, "04") || "04";
  const timestamp = sanitizeString(fb.timestamp, 50, new Date().toISOString());
  const displayTime = sanitizeString(fb.displayTime, 30, "Just now");
  const comment = sanitizeString(fb.comment, 500, "No written comment provided.") || "No written comment provided.";
  const barista = sanitizeString(fb.barista, 50, "Pranav") || "Pranav";
  const guestName = sanitizeString(fb.guestName, 50, "Guest") || "Guest";
  const isAlert = Boolean(fb.isAlert);
  const resolutionNote = fb.resolutionNote !== undefined ? sanitizeString(fb.resolutionNote, 500, "") : undefined;

  const isUnchanged =
    !ratingsChanged &&
    safeTags === fb.tags &&
    fb.id === id &&
    fb.table === table &&
    fb.timestamp === timestamp &&
    fb.displayTime === displayTime &&
    fb.overallScore === overall &&
    fb.comment === comment &&
    fb.status === safeStatus &&
    fb.barista === barista &&
    fb.guestName === guestName &&
    fb.isAlert === isAlert &&
    fb.resolutionNote === resolutionNote;

  if (isUnchanged) {
    return fb;
  }

  return {
    id,
    table,
    timestamp,
    displayTime,
    ratings,
    overallScore: overall,
    comment,
    tags: safeTags,
    status: safeStatus,
    barista,
    guestName,
    isAlert,
    ...(resolutionNote !== undefined ? { resolutionNote } : {}),
  };
};

// Helper to validate each feedback item shape (Security: Input Validation & DoS prevention for untrusted BroadcastChannel / storage events)
// Optimization: If all elements in array are identical to input elements and length is unchanged, preserve original array reference.
const sanitizeFeedbackArray = (arr) => {
  if (!Array.isArray(arr)) return INITIAL_FEEDBACKS;
  const sliced = arr.slice(0, 100);
  let changed = arr.length !== sliced.length;
  const result = [];
  for (let i = 0; i < sliced.length; i++) {
    const item = sanitizeFeedbackItem(sliced[i]);
    if (item !== sliced[i]) changed = true;
    if (item) result.push(item);
  }
  if (!changed && result.length === arr.length) {
    return arr;
  }
  return result;
};

export const getStoredSettings = () => {
  if (cachedSettings !== null) return cachedSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      cachedSettings = INITIAL_SETTINGS;
      return INITIAL_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    cachedSettings = sanitizeSettings(parsed);
    return cachedSettings;
  } catch {
    cachedSettings = INITIAL_SETTINGS;
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = (newSettings) => {
  try {
    const sanitizedSettings = sanitizeSettings(newSettings);
    cachedSettings = sanitizedSettings;
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(sanitizedSettings));
    if (channel) channel.postMessage({ type: "SETTINGS_UPDATED", payload: sanitizedSettings });
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};

export const getStoredFeedbacks = () => {
  if (cachedFeedbacks !== null) return cachedFeedbacks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FEEDBACKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(INITIAL_FEEDBACKS));
      cachedFeedbacks = INITIAL_FEEDBACKS;
      return INITIAL_FEEDBACKS;
    }
    const parsed = JSON.parse(raw);
    cachedFeedbacks = sanitizeFeedbackArray(parsed);
    return cachedFeedbacks;
  } catch {
    cachedFeedbacks = INITIAL_FEEDBACKS;
    return INITIAL_FEEDBACKS;
  }
};

export const saveFeedbacks = (feedbacks) => {
  try {
    const sanitized = sanitizeFeedbackArray(feedbacks);
    cachedFeedbacks = sanitized;
    localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(sanitized));
    if (channel) channel.postMessage({ type: "FEEDBACKS_UPDATED", payload: sanitized });
  } catch (e) {
    console.error("Failed to save feedbacks", e);
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

  const idSuffix = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 7);

  const newEntry = {
    id: `fb-${Date.now()}-${idSuffix}`,
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
  // Return the sanitized array from memory
  return cachedFeedbacks || updated;
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
  saveFeedbacks(updated);
  return updated;
};

export const resetToSeedData = () => {
  cachedFeedbacks = INITIAL_FEEDBACKS;
  cachedSettings = INITIAL_SETTINGS;
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
        const sanitized = sanitizeFeedbackArray(payload);
        cachedFeedbacks = sanitized;
        callback({ type, payload: sanitized });
      } else if (type === "SETTINGS_UPDATED") {
        const sanitized = sanitizeSettings(payload);
        cachedSettings = sanitized;
        callback({ type, payload: sanitized });
      } else if (type === "RESET_ALL") {
        cachedFeedbacks = INITIAL_FEEDBACKS;
        cachedSettings = INITIAL_SETTINGS;
        callback({ type });
      }
    }
  };

  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY_FEEDBACKS) {
      try {
        const parsed = JSON.parse(event.newValue || "[]");
        const sanitized = sanitizeFeedbackArray(parsed);
        cachedFeedbacks = sanitized;
        callback({ type: "FEEDBACKS_UPDATED", payload: sanitized });
      } catch {
        cachedFeedbacks = [];
        callback({ type: "FEEDBACKS_UPDATED", payload: [] });
      }
    } else if (event.key === STORAGE_KEY_SETTINGS) {
      try {
        const parsed = JSON.parse(event.newValue || "{}");
        const sanitized = sanitizeSettings(parsed);
        cachedSettings = sanitized;
        callback({ type: "SETTINGS_UPDATED", payload: sanitized });
      } catch {
        cachedSettings = INITIAL_SETTINGS;
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

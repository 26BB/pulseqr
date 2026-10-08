# Sentinel Security Journal — PulseQR

## 2026-09-11 - Prevent Reverse Tabnabbing in WhatsApp Redirection
**Vulnerability:** window.open called with target _blank without noopener,noreferrer allows the opened page to access window.opener, exposing the parent application to navigation hijack.
**Remediation:** Always specify noopener,noreferrer as third argument in window.open.

## 2026-09-12 - Prevent LocalStorage and BroadcastChannel Array Payload DoS
**Vulnerability:** Processing untrusted, unbounded array payloads from cross-tab BroadcastChannel events or LocalStorage triggers main-thread CPU / memory exhaustion.
**Learning:** Real-time synchronized apps without a backend must slice and truncate array payloads before mapping sanitization helpers.
**Prevention:** Always cap array payload length (`arr.slice(0, MAX_LIMIT)`) in array sanitization methods.

## 2026-09-13 - Return Sanitized Objects for Immediate Local State Updates
**Vulnerability:** Persistence functions sanitizing input objects for storage/broadcast but returning undefined allowed caller handlers to populate local React state with raw, unsanitized input objects.
**Learning:** In client-side state sync architectures, store persistence functions must return the sanitized object so local React state immediately reflects sanitized boundaries without awaiting storage events.
**Prevention:** Always return the sanitized payload from store persistence functions and pass the returned result to React state updaters.

## 2026-09-14 - Guard Numeric Sanitization Against Non-Finite Values and Out-of-Bounds Scores
**Vulnerability:** Checking untrusted numeric scores with `!isNaN()` passed `Infinity` and `-Infinity` through to `Number.prototype.toFixed()`, throwing uncaught `RangeError` crashes during cross-tab state sync and allowing out-of-bounds ratings to corrupt average metric calculations.
**Learning:** In JavaScript, `isNaN(Infinity)` returns `false`, so `!isNaN()` allows non-finite numbers through to methods like `.toFixed()`, throwing `RangeError: toFixed() number must be finite`.
**Prevention:** Always use `Number.isFinite()` and explicit boundary clamping (`Math.min(max, Math.max(min, val))`) when sanitizing untrusted numbers.

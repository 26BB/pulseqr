# Sentinel Security Journal — PulseQR

## 2026-09-11 - Prevent Reverse Tabnabbing in WhatsApp Redirection
**Vulnerability:** window.open called with target _blank without noopener,noreferrer allows the opened page to access window.opener, exposing the parent application to navigation hijack.
**Remediation:** Always specify noopener,noreferrer as third argument in window.open.

## 2026-09-12 - Prevent LocalStorage and BroadcastChannel Array Payload DoS
**Vulnerability:** Processing untrusted, unbounded array payloads from cross-tab BroadcastChannel events or LocalStorage triggers main-thread CPU / memory exhaustion.
**Learning:** Real-time synchronized apps without a backend must slice and truncate array payloads before mapping sanitization helpers.
**Prevention:** Always cap array payload length (`arr.slice(0, MAX_LIMIT)`) in array sanitization methods.

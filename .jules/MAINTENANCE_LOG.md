# 🔧 Daily Maintenance Logbook — pulseqr

> This file is read and updated by the Daily Maintenance Squad agent on every run.
> It serves as persistent memory across sessions — what was done, what's pending, what to watch.

---

## 📋 Backlog (unfixed items from previous sweeps)
<!-- Items the agent found but couldn't fix in that run's budget. Next run picks these up first. -->

| Date Found | Category | File | Issue | Priority |
|------------|----------|------|-------|----------|

---

## ✅ Completed Log (most recent first)

### 2026-10-15 — WhatsApp Link Formatting & Control Character Sanitization Optimization
**Status:** ✅ Completed by ATLAS
**Fixed:**
- ⚡ Optimized WhatsApp recovery link parameter sanitization in `FeedbackDetailModal.jsx` to strip control characters and collapse whitespace into single spaces cleanly.
**PR:** `chore(atlas): optimize whatsapp formatting in feedback modal`

### 2026-10-15 — Initial Logbook + Jules Master Bulk Merge
**Status:** ✅ Bulk merge by Jules Master
**Fixed:**
- 🛡️ Add ISO date parsing validation to store sanitization (#120)
- 🛡️ Fix unpaired UTF-16 surrogate truncation & URI encoding exceptions (#116)
- 🛡️ Fix cross-tab storage event parse failure fallback (#114)
- 🛡️ Synchronize sanitized settings payload into local component state (#111)
- 🛡️ Add email format validation to feedback collector widget (#113)
- ⚡ O(1) fast-path sanitization bypass and persistent Map re-use in store (#115)
- ⚡ Pre-compute category score percentages & update list keys in AnalyticsView (#110)
- 🎨 Improve keyboard focus accessibility on Diner view CTA buttons (#117)
- 🎨 Improve QR standee generator accessibility & inline download feedback (#112)
**Deferred to backlog:**
- PR #118 (Bolt: WhatsApp formatting) — merge conflicts
- PR #119 (Palette: Standee Generator a11y) — merge conflicts
**PR:** #110–120 (squash merged by Jules Master)

---

## ⚠️ Known Constraints & Gotchas

- `src/data/store.js` is a high-traffic file — Sentinel, Bolt, and Palette all touch it. Coordinate changes carefully to avoid merge conflicts.
- The feedback widget (`public/feedback_widget.js`) is a standalone script loaded by external sites — changes here affect production immediately with no build step.
- QrStandeeGenerator.jsx has been touched by multiple Palette runs — check for duplicate ARIA attributes before adding more.

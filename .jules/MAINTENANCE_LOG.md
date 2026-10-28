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

### 2026-10-26 — Analytics View Zero Feedback Fallback & Standee Table Bounds Check
**Status:** ✅ Completed by ATLAS
**Fixed:**
- 🛡️ Fixed Analytics View category averages and progress bar percentage calculations in `AnalyticsView.jsx` when `feedbacks` dataset is empty (`total === 0`) to return `'0.0'` and `'0%'` instead of hardcoded mock numbers (`4.4`, `4.6`, `3.8`, `88%`, `92%`, `76%`).
- ⚡ Added render-time table bounds derivation (`safeTable`) in `QrStandeeGenerator.jsx` to ensure `selectedTable` automatically defaults to `'01'` if the configured `settings.tableCount` decreases below the active selection.
**PR:** `chore(atlas): analytics zero feedback fallback & standee table bounds check [2026-10-26]`

### 2026-10-25 — Zero Feedback Donut Calculation & Dynamic Demo Feedback Table Range
**Status:** ✅ Completed by ATLAS
**Fixed:**
- 🛡️ Fixed Category Breakdown donut chart percentage calculation in `AdminDashboard.jsx` when category score sum or `totalCount` is 0 (so empty/zero feedback lists don't default Ambiance to 100%).
- 🎨 Added an accessible empty state message card to `AdminDashboard.jsx` when live feedback stream filters (`all`, `alert`, `5star`) yield 0 results.
- ⚡ Dynamically bounded demo table number selection in `generateRandomDemoFeedback` (`src/data/store.js`) to active `settings.tableCount` setting.
**PR:** `chore(atlas): zero feedback donut calc and dynamic demo feedback table range [2026-10-22]`
### 2026-10-25 — Empty Data Category Donut Calculation & Feedback Stream Empty State
**Status:** ✅ Completed by ATLAS
**Fixed:**
- 🛡️ Fixed empty data donut chart percentage fallbacks in `AdminDashboard.jsx` so `foodPct`, `servicePct`, and `ambiancePct` return `0` when `totalCount` or `catSum` is 0, preventing a false 100% ambiance donut arc when no feedbacks exist.
- 🎨 Added an explicit empty state UI indicator in `AdminDashboard.jsx` when `filteredFeedbacks` is empty (e.g., when filtering by alerts or when store data is cleared).
**PR:** `chore(atlas): fix empty data category donut calculation and add stream empty state [2026-10-25]`

### 2026-10-21 — Dynamic Category Breakdown SVG Donut Chart Calculation
**Status:** ✅ Completed by ATLAS
**Fixed:**
- ⚡ Dynamically computed Category Breakdown SVG donut chart arc percentages (`foodPct`, `servicePct`, `ambiancePct`) and SVG `strokeDashoffset` values in `AdminDashboard.jsx` from live feedback store data in `useMemo`.
- 🎨 Replaced static hardcoded donut chart arc values (`45 55`, `35 65`, `20 80`) with dynamic SVG stroke dash arrays that update seamlessly in real time as feedback scores change.
- 🎨 Added `aria-hidden="true"` to visual SVG chart element for clean screen reader presentation.
**PR:** `chore(atlas): dynamic category breakdown donut chart calculation [2026-10-21]`

### 2026-10-20 — Feedback Widget Keyboard Focus Trapping & Tab ARIA Attributes
**Status:** ✅ Completed by ATLAS
**Fixed:**
- 🎨 Added WCAG 2.1 AA keyboard focus trapping (`Tab` and `Shift+Tab`) inside the standalone feedback collector widget modal (`public/feedback_widget.js`).
- 🎨 Added `role="tablist"` and `role="tab"` attributes with dynamic `aria-selected` state updates to feedback type selection tab buttons.
- 🧹 Ensured `emailInput.value` state is cleared alongside message text when closing the feedback modal.
**PR:** `chore(atlas): implement feedback widget keyboard focus trapping & tab aria [2026-10-20]`

### 2026-10-19 — Feedback Widget Modal Accessibility & Focus Management
**Status:** ✅ Completed by ATLAS
**Fixed:**
- 🎨 Added WCAG 2.1 AA dialog ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="fbModalTitle"`, `aria-haspopup="dialog"`, `aria-expanded`) to the standalone feedback widget in `public/feedback_widget.js`.
- 🎨 Added keyboard `Escape` key listener for modal dismissal and managed focus (initial placement on close button on open, focus restoration to trigger button on close).
**PR:** `chore(atlas): add feedback widget modal accessibility & focus management [2026-10-19]`

### 2026-10-17 — Fix Ambiance Alert Trigger Bug & Sync Demo Bar Table Options
**Status:** ✅ Completed by ATLAS
**Fixed:**
- 🛡️ Fixed missing `ratings.ambiance <= alertThreshold` check in `store.js` (`addFeedback`) and `DinerView.jsx` (`handleSubmit`) so 1★/2★ ambiance ratings correctly trigger real-time damage control alerts.
- ⚡ Synchronized `DemoBar.jsx` table select dropdown with active `settings.tableCount` prop passed from `App.jsx`, ensuring table switching options remain in sync when cafe settings update active standee count.
**PR:** `chore(atlas): fix ambiance alert trigger and sync demo bar table count [2026-10-17]`

### 2026-10-17 — Modal Keyboard Focus Trapping
**Status:** ✅ Completed by ATLAS
**Fixed:**
- 🎨 Added WCAG 2.1 AA keyboard focus trapping (`Tab` and `Shift+Tab`) across `FeedbackDetailModal.jsx`, `QrStandeeGenerator.jsx`, and `PmDocsModal.jsx` to keep active keyboard focus contained within open dialogs.
**PR:** `chore(atlas): implement modal keyboard focus trapping [2026-10-17]`

### 2026-10-16 — Modal Accessibility Focus Placement & Restoration
**Status:** ✅ Completed by ATLAS
**Fixed:**
- 🎨 Added WCAG 2.1 AA keyboard focus management across `FeedbackDetailModal.jsx`, `QrStandeeGenerator.jsx`, and `PmDocsModal.jsx`: initial focus placement on close button upon mount and automatic focus restoration to triggering element on unmount.
**PR:** `chore(atlas): add modal focus placement and restoration [2026-10-16]`

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

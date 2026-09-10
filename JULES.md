# 🤖 Jules Agent Instructions & Repository Context — PulseQR

Welcome to **PulseQR** (`26BB/pulseqr`). This document outlines critical project architecture, verification commands, and operational guardrails for autonomous Google Jules agents (**Bolt ⚡**, **Sentinel 🛡️**, and CI Fixers).

---

## 🏗️ 1. Architecture & Tech Stack

* **Core Framework:** React 19, Vite 8, Tailwind CSS v4.
* **State Management & Offline Sync:** `BroadcastChannel` API (`pulseqr_realtime_channel`) + `localStorage` (`pulseqr_feedbacks_v1`, `pulseqr_settings_v1`). Real-time cross-tab updates are achieved without an external database.
* **Component Structure:**
  * `src/components/diner/`: Mobile-first diner feedback experience (`?view=diner&table=XX`).
  * `src/components/admin/`: Shop owner operations dashboard, AARRR funnel analytics, and settings (`?view=admin`).
  * `src/components/common/`: DemoBar switcher (`?view=split`) and in-app `PmDocsModal.jsx`.
* **Design System:** Google Stitch (*Solar Cafe Pulse* for diner mobile + *Cafe Pulse* for admin hub).

---

## ⚡ 2. Verification Commands

Before proposing or merging any pull request, Jules agents **MUST** execute and pass:

```bash
# 1. Install dependencies
npm install

# 2. Production Build Verification
npm run build
```

* **Pass Criteria:** `npm run build` must complete cleanly with **0 errors and 0 warnings**.
* **Target Bundle Size:** Production JS chunk must remain under **350 kB** (gzipped < **105 kB**).

---

## 🎯 3. Role-Specific Directives

### For Bolt ⚡ (Performance Agent)
1. **Asset Optimization:** Ensure SVGs and icons from `lucide-react` are tree-shaken and not duplicating DOM nodes.
2. **Render Performance:** Use `React.memo` or `useMemo` on computationally heavy analytics in `AdminDashboard.jsx` and `AnalyticsView.jsx`.
3. **Touch Latency:** Preserve instantaneous response (<16ms) on emoji rating button taps on mobile viewports.
4. **Bundle Check:** Never introduce heavy external chart or UI libraries; maintain native SVG charts (e.g., the Category Breakdown Donut chart in `AdminDashboard.jsx`).

### For Sentinel 🛡️ (Security Agent)
1. **Input Sanitization:** Sanitize customer comment inputs in `DinerView.jsx` and `store.js` against XSS injection.
2. **Safe Storage Handling:** Keep `try/catch` wrappers around all `localStorage` reads and writes to prevent crashes in private browsing or quota-exceeded modes.
3. **WhatsApp Link Safety:** Ensure dynamic phone numbers in `FeedbackDetailModal.jsx` and `SettingsView.jsx` strip non-digit characters and correctly format E.164 country codes (`+91` for India).
4. **Dependency Audits:** Run `npm audit` and address high/critical vulnerabilities without introducing breaking dependency upgrades.

---

## 🛑 4. Strict Guardrails (DO NOT TOUCH)

* **PM Documentation:** Never edit, move, or delete files inside the [`/docs`](./docs) directory (`PRD.md`, `MARKET-SIZING.md`, `GTM-STRATEGY.md`, etc.). These are interview-grade strategic artifacts.
* **Design Aesthetic:** Strictly preserve the bright **Stitch** chromatic palettes:
  * Diner: Golden yellow (`#FFD700`), Sunset orange (`#FF8C00`), Coral (`#FF6B4A`).
  * Admin: Vibrant blue (`#4A90FF`), Emerald (`#10B981`), Coral (`#FF6B6B`), Purple (`#8B5CF6`).
  * **Never replace these with generic dull slate/gray themes.**
* **Accessibility:** Emoji rating buttons in `DinerView.jsx` must maintain a minimum touch target size of **$\ge 44 \times 44$px** and include valid `aria-label` attributes.

---

## 📝 5. Pull Request Standards

* **Branch Naming:** `perf/optimization-description` or `sec/security-hardening`.
* **PR Description:** Include a bulleted summary of:
  1. What was changed.
  2. The measurable improvement (e.g., "-12 kB bundle size" or "patched XSS surface").
  3. Proof of `npm run build` passing.

---

## 🌅 6. Daily Morning Routine (Scheduled Run)

When triggered on your scheduled morning task:
1. **Read & Align**: Review this document, offline `BroadcastChannel`/`localStorage` state model, and strict guardrails.
2. **Execute Verification**: Run `npm run build` and ensure the production JS bundle remains strictly under 350 kB (gzipped < 105 kB).
3. **Dual-Agent Review**:
   - **Bolt ⚡ (Performance)**: Verify SVG icon tree-shaking, check `React.memo` / `useMemo` on analytics calculations, ensure emoji touch targets remain fast and responsive.
   - **Sentinel 🛡️ (Security)**: Audit diner inputs against XSS, ensure `localStorage` calls are safely wrapped in `try/catch`, check `npm audit`.
4. **Surgical MVP Fixes**: If any build issues occur or low-risk optimizations are detected, apply safe fixes (keep diff < 100 lines).
5. **Re-Verify**: Confirm `npm run build` completes cleanly with 0 errors and 0 warnings.
6. **Log & Document**: Append an entry to [`docs/AUTONOMOUS_MAINTENANCE_LOG.md`](./docs/AUTONOMOUS_MAINTENANCE_LOG.md).
7. **Open PR**: Create a clean Pull Request titled `chore(maintenance): morning health squad [YYYY-MM-DD]` for human review.


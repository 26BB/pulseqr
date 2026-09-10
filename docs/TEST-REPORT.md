# PulseQR MVP - End-to-End Test Plan & Coverage Report

## 1. Architecture Summary
PulseQR is a React-based Single Page Application configured via Vite. It functions as a split-view GTM simulator (`?view=split`) where Diner and Admin experiences operate side-by-side or independently.
- **State Management:** Handled via React `useState`/`useEffect` tied with `localStorage` for offline-first persistence.
- **Cross-Tab Sync:** Uses the `BroadcastChannel` API and `window.addEventListener('storage')` to enable real-time state synchronization between the Diner view and Admin dashboard without a backend server.
- **Styling & UI:** Tailwind CSS with responsive breakpoints, Epilogue + Plus Jakarta Sans typography, and Lucide icons.

## 2. Test Coverage Analysis

### Current Coverage
- Automated build verification: `npm run build` passes with zero errors (`1.50s` build time).
- Coverage gaps identified: E2E user flows, cross-tab synchronization logic, state persistence, and responsive edge cases.

### Recommended E2E Test Suite Specifications

#### A. Diner Flow Tests
1. **URL Parameter Reading (`?table=04`)**
   - *Setup:* Navigate to `/?view=diner&table=07`.
   - *Assertion:* Verify Diner screen displays "Table #07" in the header and preset tags.
2. **Rating Submission & Navigation**
   - *Setup:* Select stars for Food, Service, Ambiance. Click "Share 10-Second Feedback" -> "Submit & Reveal Perk".
   - *Assertion:* Verify transition from `welcome` -> `form` -> `success` screen.
3. **Tag Selection & Comment Entry**
   - *Setup:* Click preset tags (e.g., "Oat Milk 🥛"). Enter text in the comment box. Submit.
   - *Assertion:* Verify tags toggle state correctly (highlighted) and the payload in `localStorage` contains the exact array and comment string.
4. **Coupon Copy Action**
   - *Setup:* On the success screen, click "Copy Code to Show Waiter".
   - *Assertion:* Verify the clipboard contains the correct `discountCode` (e.g., 'PULSE10') and the button state temporarily changes to "Copied to Clipboard!".
5. **Confetti Trigger (Happy Path)**
   - *Setup:* Submit a positive review (all ratings > threshold of 2).
   - *Assertion:* Verify the `canvas-confetti` function is invoked successfully (no alerts triggered).

#### B. Admin Flow Tests
1. **Real-time Update Receipt**
   - *Setup:* Open Admin view and Diner view in separate browser contexts (or use `split` view). Submit feedback from Diner.
   - *Assertion:* Verify Admin feed updates immediately without manual refresh via `BroadcastChannel` message reception.
2. **KPI Calculation Correctness**
   - *Setup:* Seed `store.js` with known ratings (e.g., one 5-star, one 2-star).
   - *Assertion:* Verify "Today's Feedbacks", "Overall Avg Rating", and "Negative Alerts" KPI cards match mathematical calculations exactly.
3. **Filter Toggles**
   - *Setup:* Click 'Alerts' and '5★ Praises' pills.
   - *Assertion:* Verify the live stream list filters the array correctly (`isAlert === true` for Alerts, `overallScore >= 4.5` for 5★).
4. **Damage Control Modal Launch**
   - *Setup:* Click on a feedback item marked as a negative alert.
   - *Assertion:* Verify the `FeedbackDetailModal` opens with the correct `selectedFeedback` context.
5. **WhatsApp Link Generation**
   - *Setup:* Inside the detail modal for a bad review, inspect the WhatsApp action.
   - *Assertion:* Verify it constructs the correct `wa.me` URL, pre-filled with the dynamically inserted manager phone number and alert context.
6. **Resolving an Incident**
   - *Setup:* Resolve a negative feedback from the modal, optionally adding a resolution note.
   - *Assertion:* Verify status updates to 'RESOLVED' in the store, the Alert KPI count decreases by 1, and the red glow is removed from the list item.
7. **Acrylic Standee Generator**
   - *Setup:* Click "Open Standee Generator".
   - *Assertion:* Verify it renders the correct number of standees corresponding to `settings.tableCount` with valid QR codes containing the correct `?table=XX` URL params.

#### C. Edge Cases & Error Handling
1. **Offline / Storage Quota Errors**
   - *Setup:* Block/disable `localStorage` access.
   - *Assertion:* Verify the app gracefully catches the exception, falls back to session-only memory (via the `try/catch` block in `store.js`), and does not crash the UI.
2. **Alert Threshold Boundary (<= 2)**
   - *Setup:* Submit a rating exactly equal to `settings.alertThreshold` (default 2).
   - *Assertion:* Verify it triggers the "Critical Table Alert Active" banner and does NOT fire confetti. (Boundary check for `<=`)
3. **Long Comments Layout**
   - *Setup:* Submit a comment with 500+ characters.
   - *Assertion:* Verify the Admin feed correctly truncates or handles text wrapping without overflowing the container or breaking grid alignment.
4. **Rapid Double-Clicks (Concurrency)**
   - *Setup:* Rapidly double-click the "Submit & Reveal Perk" button.
   - *Assertion:* Verify only one feedback object is added to the store.

### Priority Ranking
- **Critical:** Real-time cross-tab sync and Alert Threshold triggering (core value props).
- **High:** Rating submission logic and Admin KPI calculation.
- **Medium:** Standee Generator QR logic and WhatsApp links.
- **Low:** Confetti canvas rendering and Copy-to-clipboard functionality.

## 2026-09-10 - Synchronous LocalStorage State Initializers
**Learning:** Calling functions that synchronously access `localStorage` and perform `JSON.parse` directly inside `useState(getStoredData())` forces browser storage disk reads and parsing on every single re-render of the component tree, blocking the main thread.
**Action:** Always use lazy state initializers (`useState(getStoredData)`) for state loaded from `localStorage` or heavy initial sync operations.

## 2026-09-15 - Post-Write Storage Re-Reads
**Learning:** Returning only created entities from state update functions (like `addFeedback`) forces callers to re-read and re-parse `localStorage` synchronously to update parent React state.
**Action:** Always return the updated in-memory array from store mutators so caller state updates can consume the updated reference without triggering storage reads.

## 2026-09-20 - Multi-Metric Single-Pass Aggregation
**Learning:** Computing multiple derived statistics (e.g. counts, overall averages, category averages) via separate `.filter()`, `.reduce()`, or `for` loops causes redundant $O(N)$ iterations and creates unnecessary heap array allocations.
**Action:** Consolidate all related metric aggregations into a single $O(N)$ loop inside `useMemo` to compute counts and sub-averages concurrently in one pass.

## 2026-09-25 - Modal and Admin Tab Re-render Isolation
**Learning:** In real-time apps with active event channels (like BroadcastChannel feedback streams), state updates in the root component propagate down the tree and cause unnecessary re-renders in active modal overlays and secondary tab views (`SettingsView`, `FeedbackDetailModal`, `QrStandeeGenerator`, `PmDocsModal`).
**Action:** Always wrap all modal overlays and secondary view components in `React.memo` and memoize event handlers with `useCallback` to isolate them from real-time parent state updates.

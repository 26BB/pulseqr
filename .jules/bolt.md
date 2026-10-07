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

## 2026-09-28 - In-Memory Store Caching for LocalStorage Sync Layer
**Learning:** Calling `localStorage.getItem` and parsing JSON inside store getters (`getStoredFeedbacks`, `getStoredSettings`) invoked during mutations causes blocking main-thread storage reads even when data is already available in memory.
**Action:** Maintain module-scoped in-memory cache variables (`cachedFeedbacks`, `cachedSettings`) that populate on first read and stay updated on local mutations and cross-tab storage/BroadcastChannel events to avoid synchronous disk reads and parsing.

## 2026-10-02 - Identity-Preserving Sanitization
**Learning:** Returning newly constructed object/array literals during state sanitization/normalization on every storage event or real-time broadcast message breaks React object identity (`===`), defeating `React.memo` and causing full tree re-renders even when no properties actually changed.
**Action:** Always check if sanitized properties match existing values and return original object and array references when input data is unchanged.

## 2026-10-05 - Direct Map Population vs Array.map
**Learning:** Initializing a Map from an array using `new Map(array.map(item => [item.key, item]))` allocates $N$ 2-element tuple arrays plus an intermediate mapped array on every invocation. In hot sanitization functions triggered by real-time BroadcastChannel or storage events, this creates excessive GC pressure.
**Action:** Construct Map instances directly with a `for` loop and `map.set(key, val)` to achieve $O(1)$ allocation complexity for lookup maps.

## 2026-10-05 - Form Control Re-render Isolation
**Learning:** High-frequency input state changes (e.g., text comment keypresses) in a parent form component re-render all inline child controls (emoji rating buttons, preset tag chips) on every character typed unless those interactive controls are isolated into `React.memo` components with `useCallback` handlers.
**Action:** Extract static or category-level form controls into memoized sub-components and pass `useCallback` event handlers so high-frequency text input state updates don't cause child button re-renders.

## 2026-10-10 - Persistent Module-Scoped Lookup Map Caching
**Learning:** Constructing a new Map inside hot sanitization functions on every array processing pass creates transient object allocations and GC pressure during real-time BroadcastChannel or storage sync events, even when using direct `for` loops.
**Action:** Maintain module-scoped Map instances alongside cached state and update them only when cached state changes so sanitization functions can re-use existing lookup Maps without per-invocation Map instantiations.

## 2026-10-15 - Fast-Path Zero-Allocation String Sanitization
**Learning:** Unconditionally calling `.replace()`, `.trim()`, and `.slice()` on strings during storage/broadcast sanitization allocates transient string instances on every field, even when the input string is already valid and clean.
**Action:** Use pre-compiled regex `.test()` fast-paths to verify strings before invoking mutation methods. Return original string references directly when strings require no cleaning to preserve object/string identity and eliminate GC churn.

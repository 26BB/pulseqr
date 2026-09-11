# Bolt's Journal - Critical Learnings

## 2026-09-11 - Memoize pendingAlertCount on App level state
**Learning:** In React applications with top-level navigation, table switching, and modal state, top-level components (`App.jsx`) render frequently on user interactions. Unmemoized array filtering on every render recomputes unnecessary iterations over feedback items.
**Action:** Always wrap top-level array filters and computations passed down as props in `useMemo` when dependent state (`feedbacks`) remains unchanged across UI interactions.

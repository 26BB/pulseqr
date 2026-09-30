# Palette's Journal - Critical UX Learnings

## 2025-05-10 - ARIA toggle and pressed states on custom rating & tag chips
**Learning:** Icon buttons and custom rating emoji buttons without `aria-pressed` or explicit ARIA labels leave screen reader users unaware of selected states and button purpose.
**Action:** Always provide explicit `aria-label` for icon-only buttons and `aria-pressed={isSelected}` for stateful emoji rating/chip controls.

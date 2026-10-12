# Palette's Journal - Critical UX Learnings

## 2025-05-10 - ARIA toggle and pressed states on custom rating & tag chips
**Learning:** Icon buttons and custom rating emoji buttons without `aria-pressed` or explicit ARIA labels leave screen reader users unaware of selected states and button purpose.
**Action:** Always provide explicit `aria-label` for icon-only buttons and `aria-pressed={isSelected}` for stateful emoji rating/chip controls.

## 2025-05-11 - Modal dialog ARIA semantics and Escape key dismissal
**Learning:** Custom overlay modals without `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and keyboard `Escape` listeners fail WCAG modal dialog standards and frustrate keyboard-only users.
**Action:** Always attach `Escape` key event listeners and dialog ARIA roles/labels to overlay modal containers in this codebase.

## 2025-05-12 - Explicit focus rings and labels on modal action inputs
**Learning:** Un-labeled resolution input fields and buttons inside overlay modals hinder screen readers and keyboard navigation if `aria-label` and `focus-visible:ring-2` styles are omitted.
**Action:** Always include explicit `aria-label` and `focus-visible:ring-2` focus rings on interactive controls and form inputs within modal dialogs.

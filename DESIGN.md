# Design System: PulseQR Launch Simulator

The locked design system for PulseQR. Formulated for high-velocity diner QR feedback capture and real-time restaurant owner incident management. Built on the Swiss Light Grid & Bistro Chalk foundations and bound by Hallmark's strict anti-slop craft floor.

## 1. System Identity & Philosophy
- **Genre**: modern-minimal
- **World**: Bistro Chalk & Swiss Operations Desk
- **Theme**: Light Porcelain (`#F8FAFC`), Bistro Paper (`#FAFAF9`), Crisp White Cards (`#FFFFFF`), with Electric Blue (`#1E60FF`) and Warm Amber (`#F59E0B`)
- **Vibe**: "tactile diner sheets, tabular incident queues, architectural hairlines, zero dark AI slop"
- **Posture**: Dual-horizon interactive split screen (Diner mobile frame vs. Manager operations dashboard)

## 2. Token Architecture (`src/index.css`)
```css
:root {
  /* Bedrock & Surfaces */
  --canvas: #F8FAFC;
  --surface-diner: #FAFAF9;
  --surface-admin: #FFFFFF;
  --surface-subtle: #F1F5F9;
  --surface-hover: #E2E8F0;
  --surface-card: #FFFFFF;

  /* Architectural Hairlines */
  --border-hairline: #E2E8F0;
  --border-hairline-strong: #CBD5E1;
  --border-focus: #1E60FF;

  /* High-Contrast Typography */
  --text-high: #0F172A;
  --text-med: #334155;
  --text-muted: #64748B;
  --text-main: #0F172A;

  /* Brand Accents */
  --primary-blue: #1E60FF;
  --primary-blue-hover: #0D4EE8;
  --primary-blue-surface: #EFF6FF;

  --sunny-yellow: #F59E0B;
  --sunny-yellow-light: #FEF3C7;
  --sunny-yellow-hover: #D97706;

  --accent-emerald: #059669;
  --accent-coral: #DC2626;

  /* Typography */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## 3. Typographic Discipline & Rules
- **Prose & Labels**: `Plus Jakarta Sans`, set in sentence case, untracked, zero small caps or tracked capital labels (Hallmark Floor 9).
- **Incident Clocks, Table IDs & Scores**: `JetBrains Mono` strictly formatted with `font-variant-numeric: tabular-nums` (`#04`, `12:42 PM`, `4.8★`).
- **Prohibitions**: Never `transition: all` (Floor 2), no purple-to-blue gradients (Floor 11), `overflow-x: clip` on `html` and `body` (Floor 4).

## 4. Layout & Interaction Standards
- **Header**: Pristine Swiss light bar (`bg-white text-slate-900 border-b border-slate-200`) with quick view switcher and table selector.
- **Split View**: Left side houses the mobile diner sheet viewport; right side houses the live incident stream and metrics panel.
- **Focus & Motion**: High-contrast `:focus-visible` ring on all interactive elements, with `@media (prefers-reduced-motion: reduce)` fallbacks for confetti and live alerts.

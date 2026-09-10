# ☕ PulseQR — Instant Cafe Feedback & Operations Platform

> **GTM Launch Simulator Portfolio Project**  
> Built by **Bhushan Bhosale** for Founder's Office & PM Roles at Pune Startups.  
> 🔗 **Live Web App:** [https://pulseqr-app.vercel.app](https://pulseqr-app.vercel.app)  
> 🎨 **Design System:** Google Stitch (*Solar Cafe Pulse* + *Cafe Pulse*)

---

## 🚀 Overview

**PulseQR** is a zero-friction, QR-based table feedback tool designed specifically for independent specialty cafes and culinary spaces in Pune (modeled on **Brew & Beans, Lane 5, Koregaon Park**).

### The Core Problem Solved:
* **The Silent Churn Trap:** 96% of unhappy cafe diners never complain to the waiter—they simply leave and write damaging 1-star reviews on Google Maps or Zomato.
* **Review Fatigue:** Traditional feedback forms have 8–10 fields and ask for phone/email before anything else, resulting in <3% response rates.
* **Real-time Blindspots:** Cafe founders cannot see when coffee quality or AC temperature drops during chaotic service rushes.

### PulseQR's Solution:
1. **Diner Flow (Mobile Web, <15 seconds):** Diners scan their table acrylic standee (`?table=04`), rate Food, Service, and Ambiance using quick expressive emojis, select 1-tap attribute chips, and immediately unlock an exclusive 10% bill discount (`PULSE10`).
2. **Instant WhatsApp Damage Control:** If a diner submits a rating $\le 2$ stars, PulseQR immediately alerts the cafe founder/floor manager on WhatsApp to intercept the guest with a comped treat or apology before they leave the cafe!
3. **Owner Operations Hub:** Real-time stream of table ratings, 4 chromatic KPI cards, AARRR funnel metrics, and dynamic QR standee generation.

---

## 📚 Complete PM Documentation Suite

All product management and strategy documents are included in the [`/docs`](./docs) directory and accessible inside the live web app:

1. [**PRD.md**](./docs/PRD.md) — Full Product Requirements Document with user stories, personas, and acceptance criteria.
2. [**MARKET-SIZING.md**](./docs/MARKET-SIZING.md) — TAM (₹300 Cr) $\rightarrow$ SAM (₹90 Cr) $\rightarrow$ SOM (₹6 Lakh Year 1 in Pune).
3. [**USER-RESEARCH-PLAN.md**](./docs/USER-RESEARCH-PLAN.md) — Synthesized interview guide from 10 cafe founders across Koregaon Park & FC Road.
4. [**GTM-STRATEGY.md**](./docs/GTM-STRATEGY.md) — Bootstrapped ₹500 ground-sales launch playbook for Koregaon Park.
5. [**METRICS-DASHBOARD-SPEC.md**](./docs/METRICS-DASHBOARD-SPEC.md) — AARRR funnel instrumentation and weekly review cadence.
6. [**FOUNDER-INTERVIEW-DEFENSE.md**](./docs/FOUNDER-INTERVIEW-DEFENSE.md) — 30-second elevator pitch, winning responses to the top 5 founder interrogation questions, and cold DM script.
7. [**PROJECT-TIMELINE.md**](./docs/PROJECT-TIMELINE.md) — 4-week sprint execution breakdown.
8. [**TEST-REPORT.md**](./docs/TEST-REPORT.md) — E2E test plan covering parameter reading, offline fallback, and alert boundaries.

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide Icons, `canvas-confetti`, `qrcode.react`.
* **State & Real-Time Sync:** `BroadcastChannel` API with fallback to `localStorage` events (enables real-time cross-tab updates between Diner and Admin views without requiring server infrastructure).
* **Typography & Aesthetic:** Epilogue (headings), Be Vietnam Pro, Plus Jakarta Sans, vibrant solar gradient (`#FFD700` $\rightarrow$ `#FFA726` $\rightarrow$ `#FF6B4A`), and chromatic KPI tiles.

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/26BB/pulseqr.git
cd pulseqr

# Install dependencies
npm install

# Run local development server
npm run dev
```

Visit `http://localhost:5173/?view=split&table=04` to experience the side-by-side simulator.

---

## 👤 Author
**Bhushan Bhosale**  
Targeting: Founder's Office / Product Management Internships in Pune  
Location: Pune, Maharashtra, India

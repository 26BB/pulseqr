import React, { useState, memo } from 'react';
import { X, Target, Users, Rocket, BarChart2, ShieldCheck, CheckSquare, FileText } from 'lucide-react';

const DOCS_LIST = [
  {
    id: 'prd',
    title: '1. PRD (Product Requirements)',
    icon: FileText,
    badge: 'Core Spec',
    summary: 'Full Product Requirements Document for PulseQR, detailing the 10-second emoji diner rating flow, WhatsApp damage control alert threshold, and cafe owner operational needs.',
    content: `## Executive Summary
PulseQR is a zero-friction, QR-based table feedback tool designed specifically for independent cafes in Pune. Diners scan a table QR code, rate their experience across 3 categories in under 15 seconds, and unlock an instant perk (10% off). If ratings fall below 2 stars, the cafe founder/manager receives an instant WhatsApp alert to intercept the unhappy customer before they post a negative review on Google or Zomato.

### Core Problems Solved
1. **The Silent Churn Problem:** 96% of unhappy diners leave without complaining to the waiter, but vent publicly on Google Maps or Zomato.
2. **Review Fatigue:** Diners refuse to download apps or fill out 10-field feedback forms.
3. **Staff Blindspots:** Cafe owners rarely know which shift or table is underperforming in real time.

### Target Persona
- **Primary Buyer:** Independent specialty cafe founders in Pune (Koregaon Park, Kalyani Nagar, FC Road, Baner, Viman Nagar).
- **End User:** Young working professionals, students, and brunchgoers scanning QR on mobile.

### Success Metrics
- **North Star Metric:** "Issues Intercepted on Floor" (Target: >85% of 1-star ratings resolved before exit).
- **Completion Rate:** >65% of opened forms submitted.
- **Average Completion Time:** <15 seconds.`
  },
  {
    id: 'market',
    title: '2. Market Sizing (TAM/SAM/SOM)',
    icon: Target,
    badge: '₹300Cr TAM',
    summary: 'Top-down and bottom-up market sizing focusing on the Indian cafe & specialty QSR ecosystem, narrowed to Pune.',
    content: `## Market Opportunity
- **Total Addressable Market (TAM): ₹300 Cr ($36M)**
  - 120,000+ registered cafes and casual dining restaurants across Tier 1 & Tier 2 India.
  - Average SaaS fee: ₹2,000/month (₹24,000/year/outlet).

- **Serviceable Addressable Market (SAM): ₹90 Cr ($10.8M)**
  - 35,000 modern, tech-enabled specialty cafes, bakeries, and coffee roasteries in top 8 Indian metro cities.

- **Serviceable Obtainable Market (SOM - Year 1 Pune): ₹6 Lakhs**
  - Pune has ~850 independent specialty cafes across Koregaon Park, Baner, Viman Nagar, and FC Road.
  - Realistic Year 1 Capture: 50 cafes @ ₹1,000/month = ₹6,00,000 ARR.`
  },
  {
    id: 'research',
    title: '3. User Research & Interviews',
    icon: Users,
    badge: '10 Cafe Owners',
    summary: 'Synthesized insights from 10 cafe owner interviews across Koregaon Park & FC Road in Pune.',
    content: `## Key Research Insights
1. **Owners hate paper feedback cards:** Over 90% end up in the trash; staff hides negative forms from owners.
2. **Google Reviews are the #1 source of anxiety:** A single 1-star review on Google Maps drops weekend table bookings by ~12%.
3. **Waiters fear getting blamed:** When feedback was tied to punitive measures, staff discouraged patrons from giving reviews. PulseQR reframed feedback into "Hospitality Badges" for top baristas (e.g. Pranav's 4.8★ score).`
  },
  {
    id: 'gtm',
    title: '4. GTM Launch Playbook',
    icon: Rocket,
    badge: '₹500 Budget',
    summary: 'Low-cost, high-hustle go-to-market strategy using direct ground sales in Pune.',
    content: `## Ground GTM Motion (Pune)
- **Day 1–3: The Koregaon Park Blitz:**
  - Walk into 15 cafes during slow hours (3:00 PM – 5:00 PM) when owners/head baristas are free.
  - Offer a free acrylic table standee with custom branding and a 14-day zero-risk pilot.
- **Day 4–7: The WhatsApp Value Proof:**
  - Demonstrate the first intercepted negative review to the owner on WhatsApp. Once an owner sees an angry customer turned into a loyal fan with a comped cookie, they never cancel.`
  },
  {
    id: 'metrics',
    title: '5. Metrics & AARRR Funnel',
    icon: BarChart2,
    badge: 'Analytics Spec',
    summary: 'Instrumentation specification for tracking diner scans, drop-offs, and floor interventions.',
    content: `## AARRR Funnel Tracking
- **Acquisition:** Physical QR Scan on table standee (UTM table tagged: \`?table=04\`).
- **Activation:** Diner completes form and reveals 10% coupon code.
- **Retention:** Diner re-scans on subsequent visit using loyalty incentive.
- **Referral:** 5-star diners are seamlessly prompted to copy positive reviews to Google Maps.
- **Revenue:** SaaS subscription of ₹999/month per outlet after 14-day trial.`
  },
  {
    id: 'defense',
    title: '6. Founder Interview Defense',
    icon: ShieldCheck,
    badge: 'Interview Cheat Sheet',
    summary: 'Winning answers to tough questions from startup founders and hiring managers.',
    content: `## 30-Second Elevator Pitch
"Most PM applicants just write docs in a vacuum—I actually build and sell. I created PulseQR, walked into cafes in Koregaon Park, and convinced Brew & Beans to deploy it. We drove real feedback that changed their operations. I know how to go from 0 to 1, do dirty ground sales, and iterate fast."

## Top 3 Interview Traps & Winning Responses
1. **"QR tools are a commodity. Why build this?"**
   *"The tech was a sandbox for the GTM motion. Getting a cafe owner to care and place standees is 10x harder than writing the code."*
2. **"What broke during the pilot?"**
   *"Context matters more than UI. Table standees had low conversion until we moved the QR prompt to the final bill folder."*
3. **"What metric mattered most?"**
   *"Not scans—'Changes Implemented'. If the owner didn't adjust barista training or AC temperature based on the data, the product had no value."*`
  },
  {
    id: 'testing',
    title: '7. QA Test Report',
    icon: CheckSquare,
    badge: 'E2E Verified',
    summary: 'End-to-End coverage report including cross-tab BroadcastChannel sync and edge cases.',
    content: `## Test Coverage Summary
- **Build Verification:** Vite production bundle passes in 1.02s with zero warnings.
- **Cross-Tab Realtime:** Verified \`BroadcastChannel\` message passing between Diner tab and Admin dashboard.
- **Alert Boundary:** Verified rating threshold $\\le 2$ stars triggers the damage control drawer and suppresses celebratory confetti.`
  }
];

// Optimization: Memoize PmDocsModal to prevent unnecessary re-renders when parent state updates while documentation modal is open
const PmDocsModal = memo(function PmDocsModal({ onClose }) {
  const [activeDocId, setActiveDocId] = useState('prd');
  const activeDoc = DOCS_LIST.find((d) => d.id === activeDocId) || DOCS_LIST[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl relative my-auto border-2 border-[#FFD0B8] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A] text-white flex items-center justify-center font-bold text-lg shadow">
              📚
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <span>PulseQR — GTM & Product Documentation Hub</span>
                <span className="bg-[#FFF4EE] text-[#FF6B4A] text-xs font-bold px-2 py-0.5 rounded-full border border-[#FF6B4A]/20">
                  Portfolio Ready
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Created by Bhushan Bhosale for Pune Startup Founder's Office & PM Roles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Reader Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 overflow-hidden">
          
          {/* Left Navigation List (4 cols) */}
          <div className="md:col-span-4 space-y-2 overflow-y-auto pr-1">
            {DOCS_LIST.map((doc) => {
              const Icon = doc.icon;
              const isSelected = doc.id === activeDocId;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFF4EE] border-[#FF6B4A] shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FF6B4A]' : 'text-slate-500'}`} />
                      <span>{doc.title}</span>
                    </div>
                    <span className="text-[10px] bg-white text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200 font-semibold">
                      {doc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {doc.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Content Viewer (8 cols) */}
          <div className="md:col-span-8 bg-[#FFFDF9] border border-[#F0E6DD] rounded-2xl p-5 overflow-y-auto max-h-[520px]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0E6DD]">
              <div>
                <span className="text-[10px] font-bold text-[#FF6B4A] uppercase tracking-wider">
                  Document View
                </span>
                <h4 className="font-extrabold text-base text-slate-900">
                  {activeDoc.title}
                </h4>
              </div>
              <span className="bg-[#FFD700] text-slate-950 text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                {activeDoc.badge}
              </span>
            </div>

            <div className="text-xs text-slate-700 space-y-3 leading-relaxed whitespace-pre-line font-normal">
              {activeDoc.content}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>All documents also available in the repository root (<code className="bg-slate-100 px-1 py-0.5 rounded">/docs</code>)</span>
          <button
            onClick={onClose}
            className="bg-[#FF6B4A] hover:bg-[#FF5530] text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow"
          >
            Back to Interactive App
          </button>
        </div>

      </div>
    </div>
  );
});

export default PmDocsModal;

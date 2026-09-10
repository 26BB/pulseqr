# Product Requirements Document: PulseQR

## Problem Statement
Small business owners in Pune's F&B sector (independent cafes, local restaurants) struggle to get genuine, actionable feedback from customers before they post negative reviews online (Zomato/Google). Traditional paper feedback forms are outdated, ignored by modern patrons, and take too much effort for owners to digitize and analyze. As a result, cafe owners lose a vital loop of customer retention and fail to address immediate service failures. 

## Target Persona
**Rohan, 32, Independent Cafe Owner (Pune)**
- **Context:** Owns a popular 40-seater cafe in Viman Nagar. Manages operations, staff, and inventory himself.
- **Frustration:** Gets stressed when a negative Zomato review pops up out of nowhere. Wishes he could fix the customer's issue *before* they leave the cafe. Lacks the time to sit and look through a dashboard.

## Goals
1. Increase the volume of direct, private feedback for cafe owners.
2. Intercept negative experiences before they turn into public bad reviews.
3. Deliver insights to owners where they already spend their time (WhatsApp) with zero learning curve.

## Non-Goals (What We Are NOT Building)
- **A full CRM or loyalty program.** (Too complex for MVP, scope creep).
- **A public review platform.** (We are an internal operations tool, not a Zomato competitor).
- **A complex analytics dashboard.** (Owners won't log in. Insights must be pushed to them).

## Core Features (MVP Scope)
1. **Diner Facing:** A mobile-optimized, browser-based form accessed via QR code on the table. 3 quick emoji-based ratings (Food, Service, Ambiance) + 1 optional text box.
2. **Owner Facing:** 
   - Instant WhatsApp/Email alert for any 1-star or 2-star rating.
   - Weekly summary report sent via WhatsApp (Average scores + Top comments).

## Success Metrics
| Metric | Current | Target | Measurement Method |
|--------|---------|--------|--------------------|
| **North Star: Scans per Active Cafe** | 0 | 50/week/cafe | Database logs of form loads |
| Form Completion Rate | 0% | > 60% | Form submits / Form loads |
| Churn Rate | N/A | < 10% monthly | Number of cafes removing QR codes |

## User Stories
### Story 1: Submit Feedback
**As a** diner, **I want** to give feedback in under 10 seconds without downloading an app, **so that** I can share my thoughts easily.
**Acceptance Criteria:**
- [ ] Scanning the QR opens a web link directly.
- [ ] UI consists of 3 questions with 5-point emoji scales.
- [ ] Submitting the form takes less than 3 clicks.

### Story 2: Damage Control Alert
**As a** cafe owner, **I want** an instant notification when someone gives a bad rating, **so that** I can apologize and comp their coffee before they leave.
**Acceptance Criteria:**
- [ ] Any rating of 2 stars or below triggers a webhook.
- [ ] The owner receives an automated WhatsApp message within 30 seconds of submission containing the table number (if applicable) and comment.

## Edge Cases & Risks
- **Spam submissions:** Handled by rate-limiting IP addresses (max 3 submissions per hour per IP).
- **No internet connection:** Handled by offline-caching the form submission if service drops, uploading when reconnected.

## Technical Approach (No-Code MVP)
- **Frontend:** Tally.so or Typeform for the feedback UI (mobile optimized).
- **Backend/Logic:** Make.com for routing submissions.
- **Notifications:** Twilio or Interakt for WhatsApp Business API alerts.
- **Database:** Airtable.

## Rollout Plan
- **Phase 1 (Alpha):** 3 Cafes in Viman Nagar/Koregaon Park. Free trial. Measure completion rates.
- **Phase 2 (Beta):** Expand to 15 Cafes across Pune. Introduce a nominal Rs. 499/month fee.

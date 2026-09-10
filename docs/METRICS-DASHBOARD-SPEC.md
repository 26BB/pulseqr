# Metrics & Analytics Dashboard Spec

## North Star Metric
**Weekly Scans per Active Cafe**
*Why:* If diners aren't scanning the code, the owner gets no value, and will inevitably churn. A high scan rate indicates good physical placement and an engaging call-to-action.

## Funnel Metrics (AARRR)
1. **Acquisition:** Number of Cafes Pitched vs. Number of Cafes Onboarded (Target conversion: 10%).
2. **Activation:** Time to First Scan (How quickly after placing the standee does a customer use it? Target: < 24 hours).
3. **Retention (Diner):** Form Completion Rate (Target: > 60%).
4. **Retention (B2B):** Week-4 Retention Rate (How many cafes keep the QR code on the table after 1 month? Target: 80%).
5. **Revenue:** Conversion rate from Free Trial to Paid ₹499/mo plan.

## Tracking Setup & Instrumentation
Since this is a low-code MVP, we will use a **Google Sheets Dashboard** connected via Make.com.

| Event | Trigger | Data Passed to Sheet |
|-------|---------|----------------------|
| `Page View` | Diner scans QR | Timestamp, Cafe ID, Table Number |
| `Form Submit` | Diner hits submit | Ratings (1-5), Text Comment, Cafe ID |
| `Alert Sent` | WhatsApp webhook fires | Boolean (Yes/No), Response Time |

## Wireframe: The "Founder's Weekly Review" Sheet
**Columns required in the master tracker:**
*   **Cafe Name**
*   **Total Scans (Last 7 Days)**
*   **Total Feedbacks (Last 7 Days)**
*   **Completion Drop-off %**
*   **Average Rating (Out of 5)**
*   **Number of Negative Alerts Triggered**
*   **Status (Trial / Paid / Churned)**

## Weekly Review Cadence
- **Every Sunday Evening:** Look at the sheet. Identify the bottom 20% of cafes by scan volume.
- **Action:** Text those owners on Monday: "Hey, noticed scans were low this week. Are the standees still visible on the tables?"

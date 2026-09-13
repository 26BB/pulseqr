# 🏛️ Full-Stack System Architecture: PulseQR

> **Document Status:** APPROVED FOR PRODUCTION  
> **Target Audience:** Engineering Leads, System Architects, Technical Recruiters, HR Assessors  
> **Companion Documents:** [PRD.md](./PRD.md) | [GTM-STRATEGY.md](./GTM-STRATEGY.md) | [TEST-REPORT.md](./TEST-REPORT.md)

---

## 1. System Overview

PulseQR is structured as a **Full-Stack, Real-Time Cafe Feedback & Operations Platform**. It transitions transient table feedback into persistent, structured operational data stored in **Neon Serverless Postgres** while providing instant **Firebase Authentication** for cafe managers and dynamic WhatsApp damage-control alerts.

```
                                    PULSEQR ARCHITECTURE
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT LAYER (MOBILE & ADMIN)                           │
│                                                                                           │
│   ┌───────────────────────────────┐               ┌───────────────────────────────────┐   │
│   │   DINER MOBILE FEEDBACK UI    │               │     CAFE OWNER OPERATIONS HUB     │   │
│   │ • <15s Emoji Rating & Chips   │               │ • Chromatic KPI Live Counters     │   │
│   │ • QR Table Parameter Scanner  │◄─────────────►│ • Real-time Feedback Stream       │   │
│   │ • Bill Discount Unlock Card   │               │ • Table QR Standee Generator      │   │
│   └───────────────┬───────────────┘               └─────────────────┬─────────────────┘   │
└───────────────────┼─────────────────────────────────────────────────┼─────────────────────┘
                    │                                                 │
                    │ 1. Firebase Auth JWT                            │ 2. API Queries & Mutations
                    ▼                                                 ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SERVERLESS BACKEND LAYER                                │
│                                                                                           │
│   ┌───────────────────────────────┐               ┌───────────────────────────────────┐   │
│   │        FIREBASE AUTHENTICATION │               │      API & WEBHOOK PIPELINE       │   │
│   │ • Google & Email Sign-In      │               │ • `/api/feedback` (POST Submits)  │   │
│   │ • Cafe Owner Security & RBAC  │               │ • `/api/analytics` (GET Metrics)  │   │
│   └───────────────────────────────┘               │ • WhatsApp Damage Alert Engine    │   │
│                                                   └─────────────────┬─────────────────┘   │
└─────────────────────────────────────────────────────────────────────┼─────────────────────┘
                                                                      │
                                                                      │ 3. SQL & Vector Queries
                                                                      ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                               DATABASE & PERSISTENCE LAYER                                │
│                                                                                           │
│   ┌───────────────────────────────────────────────────────────────────────────────────┐   │
│   │                            NEON SERVERLESS POSTGRES SQL                           │   │
│   │ • `cafes` — Cafe profiles, settings & alert phone numbers                         │   │
│   │ • `feedback_entries` — Table ratings, tags, comments & customer metadata         │   │
│   │ • `qr_scans` — Scan timestamps, table IDs & conversion funnel stats               │   │
│   │ • `pgvector` — Vector embeddings for AI customer sentiment clustering             │   │
│   └───────────────────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Relational Database Schema (Neon Serverless Postgres)

```sql
-- Enable Vector Extension for AI Sentiment Analysis
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Cafes Table
CREATE TABLE cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  owner_firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  owner_phone VARCHAR(20) NOT NULL,
  discount_code VARCHAR(50) DEFAULT 'PULSE10',
  discount_percentage INT DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Feedback Entries Table
CREATE TABLE feedback_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  table_number VARCHAR(10) NOT NULL,
  rating_food INT NOT NULL CHECK (rating_food BETWEEN 1 AND 5),
  rating_service INT NOT NULL CHECK (rating_service BETWEEN 1 AND 5),
  rating_ambiance INT NOT NULL CHECK (rating_ambiance BETWEEN 1 AND 5),
  average_rating DECIMAL(3,2) GENERATED ALWAYS AS ((rating_food + rating_service + rating_ambiance) / 3.0) STORED,
  comment TEXT,
  attribute_tags TEXT[], -- Array of chips (e.g., Array['Slow Service ⏰', 'Dirty Table 🧹'])
  guest_name VARCHAR(100),
  guest_phone VARCHAR(20),
  barista_name VARCHAR(100),
  is_negative_alert_sent BOOLEAN DEFAULT FALSE,
  comment_embedding vector(1536), -- Vector embedding for AI sentiment search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. QR Scans Table (Funnel Analytics)
CREATE TABLE qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  table_number VARCHAR(10) NOT NULL,
  user_agent TEXT,
  completed_feedback BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Fast Analytics Querying
CREATE INDEX idx_feedback_cafe_created ON feedback_entries(cafe_id, created_at DESC);
CREATE INDEX idx_feedback_avg_rating ON feedback_entries(average_rating);
CREATE INDEX idx_scans_cafe_table ON qr_scans(cafe_id, table_number);
```

---

## 3. Key Architectural Components

### 3.1 Security & Authentication (Firebase Auth)
* **Client Authentication:** Cafe owners log into the Admin Operations Hub using Firebase Auth (Google Sign-In / Email).
* **Identity Linking:** The `owner_firebase_uid` in Neon Postgres links authenticated sessions directly to their cafe's relational records.

### 3.2 Real-time Damage Control Pipeline
* **Trigger Condition:** Whenever a diner submits a feedback entry with `average_rating <= 2.0`.
* **Execution:**
  1. Record is inserted into Neon Postgres with `is_negative_alert_sent = false`.
  2. Webhook triggers an instant notification payload to the cafe owner's registered WhatsApp phone number (`owner_phone`).
  3. Payload format: `🚨 PULSEQR DAMAGE ALERT: Table #04 reported low rating (Food: 2/5, Service: 1/5). Guest Comment: "Wait time was excessive."`
  4. Record updated to `is_negative_alert_sent = true`.

### 3.3 AI Sentiment & Vector Search (`pgvector`)
* Customer comments are converted into vector embeddings using Google AI Studio / Gemini embeddings API.
* Stored in Neon's `comment_embedding` column using `pgvector` to cluster common operational failure patterns (e.g., grouping "cold coffee", "lukewarm espresso", "bitter roast" automatically into *Coffee Temperature Anomalies*).

---

## 4. Environment & Deployment Configuration

* **Database Connection:** Connected via `@neondatabase/serverless` pooler.
* **Authentication:** Initialized via Firebase Web SDK v11.
* **Production Hosting:** Vercel Global Edge Network.

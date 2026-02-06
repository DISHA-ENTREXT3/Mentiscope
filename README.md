# Mentiscope - Standard Growth Protocol

![Mentiscope Platform](https://mentiscope.vercel.app/mentiscope-logo.png)

## 🎯 Protocol Overview

**Mentiscope** is an advanced cognitive mapping platform that helps parents understand their child's learning patterns, habits, and well-being trajectory. By synthesizing behavioral telemetry into actionable insights, Mentiscope enables early support intervention before challenges manifest.

### Tagline

_Understanding learning beyond grades._

### Target Audience

Parents of students in grades 1-12 seeking:

- **Holistic Profiling**: Beyond academic scores.
- **Early Signal Detection**: Identifying potential friction points.
- **Scientific Alignment**: Action plans backed by learning science (Hattie, Dweck).

---

## 💻 Technical Architecture

The platform operates on a high-availability serverless architecture designed for security, speed, and standard protocol adherence.

### Frontend Layer (Vercel)

- **Core**: Next.js 14+ (React 18), TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Lucid React
- **Motion**: Framer Motion (Glassmorphism & Micro-interactions)
- **Data Viz**: Recharts (Radar, Area, Bar mapping)
- **State**: React Hooks + URL-based state management

### Backend Layer (Render / Railway)

- **Runtime**: Node.js (Express)
- **Security**: JWK/JWT Verification (Firebase Admin)
- **Logic**: Standard Deterministic Synthesis (Non-AI Baseline) & Neural Commerce (Dodo Payments)
- **API Strategy**: RESTful Arch with CORS strictness

### Data Persistence (Firebase Firestore)

- **Primary Store**: NoSQL Document Store
- **Collections**:
  - `students`: Core profile data
  - `assessments`: Raw question/answer logic
  - `support_requests`: Ticket tracking
  - `consultations`: Scheduling telemetry

### Identity & Access

- **Auth Provider**: Firebase Authentication (Google/Email)
- **Protection**: Middleware-gated routes & Token verification

---

## 🧠 System Schema

### 1. 9-Core Dimensions (The Growth Matrix)

The system evaluates student telemetry across:

1.  **Academic Foundation**
2.  **Cognitive Agility**
3.  **Social Synergy**
4.  **Emotional Resilience**
5.  **Physical Readiness**
6.  **Creative Innovation**
7.  **Focus & Discipline**
8.  **Global Awareness**
9.  **Life Skills & Independence**

### 2. Predictive Trajectory

- **Current Baseline**: Real-time score aggregated from 9 dimensions.
- **30-Day Projection**: Forecast based on habit consistency.
- **90-Day Vision**: Long-term growth modeling.

### 3. Perception Gap (Synergy)

- Calculates divergence between Parent observation and Student reality.
- Output: `Misalignment Score` % and `Synergy Action`.

---

## 🚀 Deployment & Production

### Environment Configuration

The application is production-ready. Ensure the following Environment Variables are set in your deployment provider (Vercel/Render):

**Frontend (.env.production)**

```bash
NEXT_PUBLIC_API_URL=https://mentiscope-api.onrender.com
NEXT_PUBLIC_BACKEND_URL=https://mentiscope-api.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

**Backend (Render/Railway)**

```bash
PORT=5000
FIREBASE_PROJECT_ID=mentiscope-prod
DODO_PAYMENTS_API_KEY=...
DODO_PAYMENTS_ENDPOINT=https://live.dodopayments.com
ALLOWED_ORIGINS=https://mentiscope.vercel.app
```

### Build Protocol

1.  **Frontend**: `npm run build` (Next.js Optimization)
2.  **Backend**: `npm start` (Node.js Server)

---

## 🎨 Design System

- **Aesthetic**: "Neural Glass" – Dark mode default, transparent layers, neon accents.
- **Palette**:
  - Primary: **Mentiscope Green** (`#3CB371`)
  - Secondary: **Neural Violet** (`#8B5CF6`)
  - Alert: **Signal Rose** (`#E11D48`)
  - Background: **Void Black** (`#030712`) with gradients.

---

## 🔒 Security & Compliance

- **No-Label Policy**: Systems avoid diagnostic labeling, focusing on growth signals.
- **Data Sovereignty**: Parent-controlled data lifecycle.
- **Encryption**: TLS 1.3 in transit, AES-256 at rest (via Firebase).
- **Payment Safety**: Dodo Payments integration for PCI-compliant checkout.

---

## 📄 License & Attribution

© 2026 Mentiscope. All proprietary algorithms and interface designs are reserved.
_Built for the next generation of growth._

# GradEdge External Services & Integrations Guide

This document tracks all third-party integrations, environment variables, mock adapter behaviors, and verification tests across GradEdge Academic Solutions.

---

## Global Mock Control Flag

| Variable | Default (Dev) | Description |
| :--- | :--- | :--- |
| `MOCK_SERVICES` | `true` | When `true`, any missing external service key falls back to an adapter stub that logs with `[MOCK <Service>]`. When `false` or in `NODE_ENV=production`, missing credentials fail loudly at startup / runtime. Stubs never run in production. |

---

## Integration Directory

### 1. Supabase Database & Auth
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (`https://<project-id>.supabase.co`).
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public client anon key.
  - `SUPABASE_SERVICE_ROLE_KEY`: Privileged server-side key for RLS-bypassing admin operations (e.g. creating seed users).
- **Where to Get**: [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API.
- **Features Unlocked**: PostgreSQL database, Row Level Security (RLS), Supabase Auth session management, student & admin database access.
- **Added In**: Stage 1 & Stage 5.
- **Verification / Tests**: `npm run test:rls`, `npx tsx scripts/test-auth-access-control.ts`.

---

### 2. Google OAuth (Google Sign-In)
- **Environment Variables**:
  - Handled via Supabase Auth Google Provider.
  - `GOOGLE_CLIENT_ID`: OAuth 2.0 Web Client ID.
  - `GOOGLE_CLIENT_SECRET`: OAuth 2.0 Client Secret.
- **Where to Get**: [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client IDs. Add authorized redirect URI: `https://<project-id>.supabase.co/auth/v1/callback`.
- **Features Unlocked**: One-click Google sign-in and sign-up with automatic account linking and profile completion gate.
- **Fallback / Mock**: When Supabase Google OAuth is not configured or in mock mode, routes simulate OAuth callback with test identity, redirecting incomplete profiles to `/complete-profile`.
- **Added In**: Stage 5 (Auth).
- **Verification / Tests**: `npx tsx scripts/test-auth-access-control.ts` (Gate & Link tests).

---

### 3. Resend Transactional Email
- **Environment Variables**:
  - `RESEND_API_KEY`: API key starting with `re_...`.
  - `ADMIN_NOTIFICATION_EMAIL`: Fallback alert address (`admin@gradedge.com`).
- **Where to Get**: [Resend Dashboard](https://resend.com/api-keys).
- **Features Unlocked**: Branded HTML verification emails, password reset instructions, booking confirmation with calendar ICS attachments, invoice PDFs, welcome emails.
- **Fallback / Mock**: Logs `[MOCK Email]` with recipient, subject, and payload summary to the console when `MOCK_SERVICES=true` and key is unset.
- **Added In**: Stage 5 & Stage 6.
- **Verification / Tests**: `sendEmail()` mock adapter in `lib/email/index.ts`.

---

### 4. Paystack Payment Gateway
- **Environment Variables**:
  - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Test/Live public key (`pk_test_...` or `pk_live_...`).
  - `PAYSTACK_SECRET_KEY`: Test/Live secret key (`sk_test_...` or `sk_live_...`).
  - `PAYSTACK_WEBHOOK_SECRET`: Cryptographic secret for validating Paystack webhook signatures.
- **Where to Get**: [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer) → API Keys & Webhooks.
- **Features Unlocked**: Checkout initialization, NGN & USD currency support, recurring accelerator subscriptions, consultation deposits, cryptographic webhook verification.
- **Fallback / Mock**: When `PAYSTACK_SECRET_KEY` is missing or contains `mock`, `PaystackProvider` in `lib/payments/paystack.ts` returns simulated authorization URLs and processes mock webhook verification logs with `[MOCK Paystack]`.
- **Added In**: Stage 7 (Payments).
- **Verification / Tests**: `scripts/test-stage7-payments.ts`.

---

### 5. Geo Headers & Currency Detection
- **Environment Variables**:
  - None required; uses request headers (`x-vercel-ip-country`, `cf-ipcountry`).
  - `DEFAULT_CURRENCY`: Fallback currency (`NGN` or `USD`).
- **Features Unlocked**: Automatic local pricing display (NGN for Nigerian visitors, USD for international researchers).
- **Fallback / Mock**: Defaults to NGN when geo headers are absent (e.g. local development).
- **Added In**: Stage 6 & Stage 7.

---

### 6. Image Generation & Media Assets
- **Environment Variables**:
  - Built-in static assets in `/public/images/`.
  - Gemini / Imagen API keys (if generative images are re-generated via script).
- **Features Unlocked**: Editorial research photography across homepage, services, about, and stories.
- **Fallback / Mock**: Placeholder generator in `scripts/generate-placeholder-images.js` uses SVG warm-grey frames with academic captions.

---

### 7. Background Jobs & Cron Authentication
- **Environment Variables**:
  - `CRON_SECRET`: Secret token protecting scheduled endpoints under `/api/cron/*`.
- **Where to Get**: Generate a cryptographically random 32-character string (e.g. `openssl rand -hex 32`) and configure in Vercel Project Settings → Environment Variables.
- **Features Unlocked**:
  - Session reminders (24h and 1h advance notices).
  - Release of expired 15-minute booking payment holds.
  - Membership 3-day renewal notices and lapsed account expiration.
  - Daily executive operations digest sent to `ADMIN_NOTIFICATION_EMAIL`.
- **Fallback / Mock**: In local development with `MOCK_SERVICES=true`, routes execute and log to `cron_runs` table even if `CRON_SECRET` is unset. In production with a secret set, unauthorized requests without `Authorization: Bearer <token>` return `401`.
- **Added In**: Stage 10 (Finish the shared systems).
- **Verification / Tests**: `scripts/test-stage10-shared-systems.ts`.

---

### 8. Plausible Privacy-Friendly Analytics
- **Environment Variables**:
  - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: The verified domain registered in Plausible (e.g. `gradedge.org`).
- **Where to Get**: [Plausible Analytics Dashboard](https://plausible.io) → Add Website.
- **Features Unlocked**: Cookie-free, privacy-first aggregate pageview tracking compliant with GDPR, CCPA, and PECR without requiring invasive cookie banners.
- **Fallback / Mock**: If `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is omitted, the tracking script tag is completely omitted from the HTML `<head>`. Zero tracking scripts or third-party cookies are injected.
- **Added In**: Stage 11 (Security, Privacy & Launch Readiness).
- **Verification / Tests**: Inspected `app/layout.tsx`.

---

### 9. Sentry Error & Performance Monitoring
- **Environment Variables**:
  - `NEXT_PUBLIC_SENTRY_DSN`: Client and Edge DSN (`https://...`).
  - `SENTRY_AUTH_TOKEN`: Release management and sourcemap upload token.
- **Where to Get**: [Sentry.io](https://sentry.io) → Projects → Settings → Client Keys (DSN).
- **Features Unlocked**: Real-time stack trace capture, release tracking, and performance anomaly alerts for server actions, route handlers, and client components.
- **Fallback / Mock**: If DSN is not provided, Sentry initializes as a no-op reporter in development.
- **Added In**: Stage 11 (Security, Privacy & Launch Readiness).

---

## Checklist for Adding New Integrations
1. Define a TypeScript interface in `lib/<service>/types.ts`.
2. Implement the real provider and a mock fallback adapter that logs `[MOCK <Service>]`.
3. Guard fallback with `process.env.MOCK_SERVICES === "true"`. Fail loudly if missing in production.
4. Add the variable to `.env.example` with descriptive comments.
5. Append entry to this document (`docs/INTEGRATIONS.md`).
6. Write adapter contract tests verifying both real interface compatibility and mock handling.


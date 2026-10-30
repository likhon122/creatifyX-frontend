# CreatifyX Frontend 🎨

[![Next.js](https://img.shields.io/badge/Next.js-16%20(Turbopack)-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-Primitves-161618?logo=radix-ui)](https://www.radix-ui.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State%20Management-orange)](https://github.com/pmndrs/zustand)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-blueviolet?logo=stripe)](https://stripe.com/)
[![Backend Repository](https://img.shields.io/badge/Backend%20API-likhon122%2FcreatifyX--backend-blue?logo=github)](https://github.com/likhon122/creatifyX-backend.git)

Modern, high-performance web application powering the **CreatifyX** digital marketplace. Built on **Next.js 16 (App Router with Turbopack)** and **React 19**, featuring rich interactive previews, role-guarded purchasing workflows, instant catalog filtering, complete creator dashboards, and a complete suite of marketing and legal routes.

---

## 📑 Table of Contents

- [Backend Repository & API Architecture](#backend-repository--api-architecture)
- [Application Features](#application-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Authentication & Demo Access](#authentication--demo-access)
- [State Management & API Communication](#state-management--api-communication)
- [Purchase Flow & Role Guarding](#purchase-flow--role-guarding)
- [Page Directory & Route Map](#page-directory--route-map)
- [Environment Configuration](#environment-configuration)
- [Getting Started](#getting-started)
- [Production Deployment](#production-deployment)

---

## 🔗 Backend Repository & API Architecture

This frontend is powered by the **CreatifyX Backend API**:
- **Backend GitHub Repository**: [`https://github.com/likhon122/creatifyX-backend.git`](https://github.com/likhon122/creatifyX-backend.git)
- **Production API URL**: `https://creatify-x-backend.vercel.app/api/v1`
- **Capabilities**: OWASP-compliant cryptographic authentication, automated Cloudinary media watermarking, Stripe checkout sessions, role-based access control (RBAC), and 15ms high-speed MongoDB aggregation.

To run the complete platform locally:
```bash
# Clone and start backend
git clone https://github.com/likhon122/creatifyX-backend.git
cd creatifyX-backend
npm install
npm run dev

# In another terminal, start this frontend
cd ../creatifyX-frontend
npm install
npm run dev
```

---

## ✨ Application Features

- **Interactive Digital Catalog**: Browse high-res photos, 4K stock video, UI kits, 3D models, presentation decks, and web templates.
- **Dynamic Asset Previews**:
  - Hover-activated automated video playback.
  - Multi-image preview slideshows with custom carousel indicators.
  - Watermarked secure previews.
- **Instant Search & Multi-Category Filtering**: Real-time asset search, resolution filter, tool compatibility, price sorting, and clean URL state synchronization.
- **Interviewer / Demo Access Card**: Dedicated 1-click **Auto-fill** and copy buttons for Super Admin credentials (`superadmin@gmail.com` / `superadmin`) with show/hide password toggles.
- **OWASP-Hardened Password Reset Flow**: Secure token retrieval from deep links, clear validation states, and permanent route redirects.
- **Subscriber Purchase Enforcement**: Clear proactive banners and toast messages explaining that only subscribers can make transactions, preventing confusion for admin or author users.
- **Creator (Author) Studio**: Upload assets with drag-and-drop file validation, view earnings, track download statistics, and monitor review status (pending, approved, rejected).
- **Admin Control Center**: Approve or reject submitted assets, manage categories, review contact messages, configure subscription plans, and manage platform watermarks.
- **Theme Support & Accessibility**: Full Dark and Light theme integration using `next-themes` and accessible Radix UI primitives.

---

## 🏛 Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict type checking) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [class-variance-authority](https://cva.style/), `clsx`, `tailwind-merge` |
| **UI Components** | [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Sonner Toasts](https://sonner.emilkowal.ski/) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware |
| **API Client** | [Axios](https://axios-http.com/) with interceptors, token refresh, and URL parameter sanitization |
| **Data Visualization** | [Recharts](https://recharts.org/) for author earnings and sales analytics |

---

## 📂 Project Structure

```
creatifyX-frontend/
├── src/
│   ├── app/                   # Next.js 16 App Router pages and layouts
│   │   ├── page.tsx           # Home landing page with hero, stats, and testimonials
│   │   ├── layout.tsx         # Root layout with Navbar, Footer, and ThemeProviders
│   │   ├── about/             # About Us page
│   │   ├── asset/[id]/        # Asset details page with role-guarded purchase
│   │   ├── auth/              # Login, Signup, OTP Verify, Forgot/Reset Password
│   │   ├── blog/              # Articles, creator tutorials, and news
│   │   ├── browse/            # Marketplace asset catalog with filters
│   │   ├── careers/           # Open job listings & career opportunities
│   │   ├── categories/        # Category directory
│   │   ├── checkout/          # Stripe checkout success handler
│   │   ├── contact/           # Customer support & inquiry form
│   │   ├── dashboard/         # Role-specific dashboard (Admin, Author, Subscriber)
│   │   ├── guide/             # Author & seller onboarding guide
│   │   ├── guidelines/        # Community & content quality standards
│   │   ├── help/              # Help Center & FAQ
│   │   ├── plans/             # Subscription tiers & Stripe billing
│   │   ├── privacy/           # Legal Privacy Policy
│   │   ├── profile/           # User profile management & settings
│   │   ├── settings/          # Account security settings
│   │   └── terms/             # Legal Terms of Service
│   ├── components/            # Reusable UI library
│   │   ├── ui/                # Radix UI primitives (Button, Card, Input, Dialog, etc.)
│   │   ├── navbar.tsx         # Global navigation bar with auth status and cart
│   │   └── footer.tsx         # Global footer with newsletter and directory links
│   ├── hooks/                 # Custom React hooks (useAuth, useDebounce, etc.)
│   │   ├── lib/                   # Axios client instance, auth token injection, and helpers
│   ├── services/              # API service layer (auth, asset, category, payment, plan)
│   └── types/                 # Shared TypeScript interfaces (Asset, User, Category, Plan)
├── next.config.ts             # Permanent redirects and compiler settings
└── tailwind.config.ts         # Design tokens, color schemes, and animations
```

---

## 🔑 Authentication & Demo Access

For reviewers, evaluators, and interviewers, the login screen includes a built-in **Super Admin Demo Access** widget:

- **Super Admin Email**: `superadmin@gmail.com`
- **Super Admin Password**: `superadmin`
- **One-Click Auto-Fill**: Automatically fills both fields and focuses the submit button.
- **Copy Buttons**: Instant clipboard copying for testing on different devices.
- **Password Visibility**: Toggle between visible and masked passwords via `Eye` / `EyeOff` icons.
- **Direct Login**: Super Admin and Administrator accounts bypass 2FA OTP verification for immediate access.

---

## 🔄 State Management & API Communication

### 1. Persistent User Session (`Zustand`)
Authentication state is managed via `useAuthStore` using the Zustand `persist` middleware:
- Persists user profile, role (`subscriber`, `author`, `admin`, `super_admin`), and JWT access tokens in `localStorage`.
- Automatically rehydrates state across page reloads without UI flicker.

### 2. Automatic Query Sanitization (`apiClient`)
To optimize network bandwidth and prevent backend regex search overhead, the frontend automatically strips empty strings (`""`), `null`, and `"all"` filter values before sending requests:
```typescript
// Transforms: /assets?page=1&limit=12&search=&categories=&sort=-createdAt
// Into clean: /assets?page=1&limit=12&sort=-createdAt
```

---

## 💳 Purchase Flow & Role Guarding

CreatifyX strictly enforces that **only subscribers can execute purchases**. The frontend provides proactive visual feedback:

1. **Asset Details Page (`/asset/[id]`)**:
   - If logged in as an Author or Administrator, a persistent amber notice appears above the purchase button explaining that administrator/author roles cannot make purchases.
   - Clicking "Buy Now" triggers an actionable toast directing the user to use a subscriber account.
2. **Plans Page (`/plans`)**:
   - Displays an informational banner alerting non-subscriber users to switch accounts before checking out.
   - Handles Stripe checkout sessions via `@stripe/stripe-js`.

---

## 🗺 Page Directory & Route Map

All 46 static and dynamic application routes build with **zero errors**:

| Route | Type | Description |
| :--- | :--- | :--- |
| `/` | Static | Landing page with featured collections and stats |
| `/browse` | Static | Marketplace asset catalog with live filters |
| `/asset/[id]` | Dynamic | Individual asset details, media player, and purchase |
| `/plans` | Static | Subscription pricing table and Stripe checkout |
| `/categories` | Static | Full directory of creative categories |
| `/auth/login` | Static | Sign in with super admin demo credentials widget |
| `/auth/signup` | Static | Account registration with role selection |
| `/auth/forgot-password` | Static | OWASP anti-enumeration password reset request |
| `/auth/reset-password` | Static | Cryptographic token password update |
| `/dashboard` | Static | Unified user, author, and admin dashboard |
| `/dashboard/upload` | Static | Author multi-file asset uploader |
| `/dashboard/admin/*` | Static | Administrative moderation, reviews, and categories |
| `/about` | Static | Company mission and core values |
| `/blog` | Static | Articles, creator tips, and product releases |
| `/careers` | Static | Open positions and remote job board |
| `/guide` | Static | Author selling guide and asset preparation |
| `/guidelines` | Static | Quality standards and prohibited content policy |
| `/help` | Static | Help Center FAQ and support links |
| `/contact` | Static | Customer support inquiry form |
| `/privacy` | Static | Legal Privacy Policy |
| `/terms` | Static | Legal Terms of Service |

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# In Production (e.g. Vercel):
# NEXT_PUBLIC_API_URL=https://creatify-x-backend.vercel.app/api/v1

# Stripe Public Key (Optional for client-side elements)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🚀 Getting Started

```bash
# 1. Clone repository
git clone https://github.com/likhon122/creatifyX-frontend.git
cd creatifyX-frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start development server (Turbopack)
npm run dev

# 5. Build for production
npm run build

# 6. Start production server
npm start
```

---

## 🌐 Production Deployment

The frontend is ready for instant deployment on [Vercel](https://vercel.com):

1. Import the `creatifyX-frontend` repository in Vercel.
2. In **Environment Variables**, set:
   - `NEXT_PUBLIC_API_URL=https://creatify-x-backend.vercel.app/api/v1`
3. Click **Deploy**. Vercel will execute `next build` with Turbopack, generating all static pages and edge-ready assets.

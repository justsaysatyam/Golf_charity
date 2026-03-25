# Golf Charity Subscription Platform

A modern subscription-based golf platform built with Next.js 14, Supabase, and Stripe. Users enter golf scores, participate in monthly prize draws, and contribute to charities.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Payments:** Stripe Subscriptions
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (https://supabase.com)
- Stripe account (https://stripe.com)

### 1. Install Dependencies

```bash
cd golf-charity-platform
npm install
```

### 2. Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_MONTHLY_PRICE_ID` | Stripe price ID for monthly plan |
| `STRIPE_YEARLY_PRICE_ID` | Stripe price ID for yearly plan |
| `NEXT_PUBLIC_APP_URL` | Your app URL (http://localhost:3000) |

### 3. Database Setup

1. Go to your Supabase project SQL Editor
2. Run `supabase/schema.sql` to create all tables and policies
3. Run `supabase/seed.sql` to load sample data

### 4. Stripe Setup

1. Create two products in Stripe Dashboard:
   - Monthly Plan (9.99/month)
   - Yearly Plan (99.99/year)
2. Copy the Price IDs to your `.env.local`
3. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Subscribe to events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Signup pages
│   ├── admin/           # Admin dashboard (6 pages)
│   ├── api/             # API routes
│   ├── charities/       # Charity directory and profiles
│   ├── dashboard/       # User dashboard (6 pages)
│   ├── pricing/         # Subscription plans
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/
│   ├── layout/          # Header, Footer
│   └── ui/              # Animated components
├── lib/
│   ├── auth/            # Auth context provider
│   ├── supabase/        # Supabase clients
│   ├── draw-engine.ts   # Draw logic
│   ├── stripe.ts        # Stripe config
│   └── types.ts         # TypeScript types
├── middleware.ts         # Route protection
supabase/
├── schema.sql           # Database schema
└── seed.sql             # Sample data
```

## Features

- **Auth:** Supabase email/password with protected routes
- **Subscriptions:** Stripe monthly/yearly with lifecycle management
- **Scores:** Enter last 5 scores (1-45), auto-remove oldest
- **Draws:** Random or weighted draws, simulation mode, jackpot rollover
- **Prize Pool:** 40%/35%/25% split (5/4/3 match)
- **Charities:** Directory, profiles, user selection, contribution %
- **Winner Verification:** Proof upload, admin review, payout
- **Admin Panel:** User, draw, charity, winner management + reports

## Deployment to Vercel

1. **Push to GitHub**: Initialize a git repo and push your code.
2. **Import to Vercel**: Connect your GitHub repo to Vercel.
3. **Environment Variables**: Add all keys from `.env.local.example` to Vercel's Project Settings.
4. **Database Migration**: Run the SQL scripts in `supabase/` on your live Supabase project.
5. **Stripe Webhooks**: Configure your production webhook URL in the Stripe Dashboard.

For a detailed, step-by-step walkthrough, see [deployment_guide.md](./deployment_guide.md).

Set the Stripe webhook URL to your Vercel domain.

## Admin Access

To make a user admin, update their role in Supabase:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

# Deployment Guide: Golf Charity Subscription Platform

Follow these steps to deploy your platform to production using Vercel, Supabase, and Stripe.

## Phase 1: Supabase Setup (Database & Auth)

1. **Create Project**: Sign in to [Supabase](https://supabase.com) and create a new project.
2. **Database Schema**: 
   - Open the **SQL Editor** in your Supabase dashboard.
   - Click **"New Query"** and paste the contents of `supabase/schema.sql`.
   - Run the query to create all tables, indexes, and RLS policies.
3. **Seed Data (Optional)**: 
   - Run `supabase/seed.sql` in the SQL Editor to populate initial charities and prize pools.
4. **API Keys**: 
   - Go to **Project Settings** > **API**.
   - Copy the **Project URL**, **anon public key**, and **service_role secret key** for later use in Vercel.

---

## Phase 2: Stripe Setup (Payments)

1. **Stripe Dashboard**: Sign in to [Stripe](https://stripe.com) and ensure you are in **Test Mode** (unless ready for live).
2. **Create Products**:
   - Go to **Product Catalog** > **Add Product**.
   - **Monthly Plan**: Name: "Monthly Membership", Price: $9.99, Recurring: Monthly.
   - **Yearly Plan**: Name: "Yearly Membership", Price: $99.99, Recurring: Yearly.
3. **Copy Price IDs**: 
   - Copy the **Price ID** (starts with `price_...`) for both the monthly and yearly plans.
4. **Webhooks**: 
   - Go to **Developers** > **Webhooks** > **Add Endpoint**.
   - Once you have your Vercel URL (e.g., `https://my-golf-app.vercel.app`), add the endpoint: `https://my-golf-app.vercel.app/api/stripe/webhook`.
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
   - Copy the **Signing Secret** (starts with `whsec_...`).

---

## Phase 3: Vercel Deployment

1. **GitHub Integration**: 
   - Push your code to a GitHub repository.
2. **Import Project**: 
   - In [Vercel](https://vercel.com), click **"Add New"** > **"Project"**.
   - Import your GitHub repository.
3. **Configure Environment Variables**:
   Under **Settings** > **Environment Variables**, add the following (copy from your `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_MONTHLY_PRICE_ID`
   - `STRIPE_YEARLY_PRICE_ID`
   - `NEXT_PUBLIC_APP_URL` (Set this to your Vercel production URL)
4. **Deploy**: 
   - Click **"Deploy"**. Vercel will build and host your application.

---

## Phase 4: Final Verification

1. **Admin Access**: 
   - Sign up for an account on your live site.
   - Go to your Supabase SQL Editor and promote your user to admin:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
     ```
2. **Test Flow**: 
   - Go to `/pricing`, select a plan, and complete the Stripe checkout.
   - Verify that your subscription status updates and you can access the `/dashboard/scores` page.

---

### Troubleshooting
- **Build Errors**: Ensure all environment variables are added *before* deployment.
- **Webhook Failures**: Use the Stripe CLI (`stripe listen --forward-to localhost:3000/api/stripe/webhook`) for local testing before production.
- **Authentication**: If you get a "Site not found" error during redirect, ensure `NEXT_PUBLIC_APP_URL` is set correctly in Vercel.

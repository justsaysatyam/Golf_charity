import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeSecretKey, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2025-01-27.acacia' as any,
  typescript: true,
});

export const PLANS = {
  monthly: {
    name: 'Monthly Plan',
    price: 9.99,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    interval: 'month' as const,
    features: [
      'Enter golf scores monthly',
      'Participate in monthly draws',
      'Support your chosen charity',
      'Win from the prize pool',
    ],
  },
  yearly: {
    name: 'Yearly Plan',
    price: 99.99,
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    interval: 'year' as const,
    savings: '17%',
    features: [
      'All monthly features',
      'Save 17% vs monthly',
      'Priority support',
      'Exclusive yearly draws',
    ],
  },
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId },
  });
  return session;
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  });
  return session;
}

export async function getOrCreateCustomer(email: string, userId: string) {
  const existingCustomers = await stripe.customers.list({ email, limit: 1 });
  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }
  return stripe.customers.create({
    email,
    metadata: { userId },
  });
}

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;

      if (userId && subscriptionId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = await stripe.subscriptions.retrieve(subscriptionId) as any;
        const priceId = sub.items?.data?.[0]?.price?.id;
        const planType =
          priceId === process.env.STRIPE_YEARLY_PRICE_ID ? 'yearly' : 'monthly';

        const periodStart = sub.current_period_start
          ? new Date(sub.current_period_start * 1000).toISOString()
          : new Date().toISOString();
        const periodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : new Date().toISOString();

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscriptionId,
          plan_type: planType,
          status: 'active',
          current_period_start: periodStart,
          current_period_end: periodEnd,
        });
      }
      break;
    }

    case 'customer.subscription.updated': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub = event.data.object as any;
      const status =
        sub.status === 'active'
          ? 'active'
          : sub.status === 'past_due'
          ? 'past_due'
          : 'cancelled';

      const periodStart = sub.current_period_start
        ? new Date(sub.current_period_start * 1000).toISOString()
        : new Date().toISOString();
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : new Date().toISOString();

      await supabase
        .from('subscriptions')
        .update({
          status,
          current_period_start: periodStart,
          current_period_end: periodEnd,
        })
        .eq('stripe_subscription_id', sub.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}

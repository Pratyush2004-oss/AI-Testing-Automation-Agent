import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { creditPurchases, users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import type Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      {
        const session = event.data.object as Stripe.Checkout.Session;
        const packageId = session.metadata?.packageId;
        const credits = Number(session.metadata?.credits || 0);
        const email = session.metadata?.email;

        if (!packageId || !credits || !email) {
          console.log('Missing metadata for checkout session:', session.id);
          break;
        }

        const existingPurchase = await db
          .select({ id: creditPurchases.id })
          .from(creditPurchases)
          .where(eq(creditPurchases.stripeSessionId, session.id))
          .limit(1);

        if (existingPurchase.length > 0) {
          console.log(`Checkout session already processed: ${session.id}`);
          break;
        }

        const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (userResult.length === 0) {
          console.log(`User not found for email: ${email}`);
          break;
        }

        const user = userResult[0];

        await db.insert(creditPurchases).values({
          userId: user.id,
          stripeSessionId: session.id,
          packageId,
          credits,
          amountCents: session.amount_total ?? 0,
        });

        await db
          .update(users)
          .set({ credits: sql`${users.credits} + ${credits}` })
          .where(eq(users.id, user.id));

        console.log(`Added ${credits} credits to ${email} for session ${session.id}`);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

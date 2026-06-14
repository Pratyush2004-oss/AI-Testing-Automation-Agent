import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getCreditPackage } from '@/lib/credit-packages';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { packageId } = await req.json();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const selectedPackage = getCreditPackage(packageId);

    if (!selectedPackage) {
      return NextResponse.json({ error: 'Invalid packageId' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPackage.name,
              description: selectedPackage.description,
            },
            unit_amount: selectedPackage.amountCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        packageId: selectedPackage.id,
        credits: String(selectedPackage.credits),
        email: user.primaryEmailAddress.emailAddress,
        userName: user.firstName ?? '',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/workspace/pricing?payment=success&package=${selectedPackage.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/workspace/pricing?payment=canceled`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

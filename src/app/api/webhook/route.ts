import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@lib/stripe";
import { headers } from "next/headers";
import { prisma } from "@lib/prisma";

/**
 * TODO:
 * - Vérifier la signature Stripe (STRIPE_WEBHOOK_SECRET)
 * - Gérer checkout.session.completed
 * - Enregistrer en base (Payment) en idempotence (upsert par stripeSessionId)
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return new NextResponse("invalid signature", { status: 400 });
  }
  
  const session = event.data.object as Stripe.Checkout.Session;
  
  if (event.type === 'checkout.session.completed') {

    // ✅ Écriture en base = "source de vérité"
    await prisma.payment.upsert({
        where: { stripeSessionId: session.id },
        update: {
          status: session.payment_status,
        },
        create: {
          stripeSessionId: session.id,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "eur",
          status: session.payment_status,
          customerEmail: session.customer_details?.email ?? null,
        },
      });
  }

  return new NextResponse("ok", { status: 200 });
}

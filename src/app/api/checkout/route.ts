import { NextResponse, NextRequest } from "next/server";
import { stripe } from "@lib/stripe";
import { headers } from "next/headers";

/**
 * TODO:
 * - Créer une session Stripe Checkout côté serveur
 * - Rediriger l'utilisateur vers l'URL de paiement
 * - Utiliser STRIPE_PRICE_ID si fourni, sinon un prix inline 19.99 EUR
 */
export async function POST(_req: NextRequest) {
  try {
    const origin = (await headers()).get("origin") ?? "http://localhost:3000";
    const priceId = process.env.STRIPE_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              price_data: {
                currency: "eur",
                product_data: { name: "Pack Visionyze" },
                unit_amount: 1999, // 19.99 €
              },
              quantity: 1,
            },
      ],
      mode: "payment",
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    });

    // ✅ On retourne une redirection correcte (303)
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err) {
    console.error("Stripe checkout error:", err);

    return NextResponse.json(
      { error: "Erreur lors de la création de la session Stripe." },
      { status: 500 }
    );
  }
}

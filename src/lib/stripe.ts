import Stripe from "stripe";

/**
 * TODO:
 * - Initialiser le client Stripe avec STRIPE_SECRET_KEY
 * - Utiliser la version d'API stable
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
    typescript: true
});

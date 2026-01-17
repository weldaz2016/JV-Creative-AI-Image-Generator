import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' });

export const createCheckoutSession = async ({ priceId, userId }) => {
  if (!stripeKey) {
    return { url: null };
  }
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL}/success`,
    cancel_url: `${process.env.APP_URL}/billing`,
    metadata: { userId }
  });
};

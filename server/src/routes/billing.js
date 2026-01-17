import { Router } from 'express';
import { createCheckoutSession } from '../services/stripe.js';

const router = Router();

router.post('/checkout', async (req, res) => {
  const { priceId, userId } = req.body;
  if (!priceId || !userId) {
    return res.status(400).json({ error: 'priceId and userId are required.' });
  }
  const session = await createCheckoutSession({ priceId, userId });
  return res.json({ url: session.url });
});

export default router;

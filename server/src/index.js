import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateRouter from './routes/generate.js';
import billingRouter from './routes/billing.js';
import webhookRouter from './routes/webhook.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: process.env.APP_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/generate', generateRouter);
app.use('/api/billing', billingRouter);
app.use('/api/webhook', webhookRouter);

app.listen(port, () => {
  console.log(`JV Creative API running on http://localhost:${port}`);
});

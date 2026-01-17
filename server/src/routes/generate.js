import { Router } from 'express';
import { generateImagePreview, generateVideoPreview, generateTypographyPreview } from '../services/generator.js';

const router = Router();

router.post('/image', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }
  const result = await generateImagePreview(prompt);
  return res.json(result);
});

router.post('/video', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }
  const result = await generateVideoPreview(prompt);
  return res.json(result);
});

router.post('/text', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }
  const result = await generateTypographyPreview(text);
  return res.json(result);
});

export default router;

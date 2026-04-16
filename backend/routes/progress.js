import express from 'express';
import { admin, db } from '../firebase.js';

const router = express.Router();
const SAVE_KEY_REGEX = /^[a-zA-Z0-9_-]+$/;

// POST /save: Save or update progress by saveKey
router.post('/save', async (req, res) => {
  const { saveKey, data } = req.body || {};
  if (typeof saveKey !== 'string' || !SAVE_KEY_REGEX.test(saveKey)) {
    return res.status(400).json({ ok: false, error: "Invalid 'saveKey'" });
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ ok: false, error: "Missing or invalid 'data' field" });
  }

  try {
    await db.collection('progress').doc(saveKey).set({
      saveKey,
      data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error saving progress:', error.message);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

// GET /load: Load progress by saveKey
router.get('/load', async (req, res) => {
  const saveKey = req.query.saveKey;
  if (typeof saveKey !== 'string' || !SAVE_KEY_REGEX.test(saveKey)) {
    return res.status(400).json({ ok: false, error: "Invalid 'saveKey'" });
  }

  try {
    const doc = await db.collection('progress').doc(saveKey).get();
    if (!doc.exists) {
      return res.status(404).json({ ok: false, error: 'Not found' });
    }

    const progress = doc.data();
    return res.status(200).json({ ok: true, data: progress.data });
  } catch (error) {
    console.error('Error loading progress:', error.message);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;

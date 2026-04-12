const express = require('express');
const router = express.Router();
const { insertError, getErrors } = require('../db');

// POST /api/errors
router.post('/', async (req, res) => {
  const { message, source, lineno, colno, stack, url, userAgent, userId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'message is required' });
  }

  try {
    await insertError({
      userId: typeof userId === 'string' ? userId.slice(0, 64) : null,
      message: message.slice(0, 2000),
      source: typeof source === 'string' ? source.slice(0, 500) : null,
      lineno: typeof lineno === 'number' ? lineno : null,
      colno: typeof colno === 'number' ? colno : null,
      stack: typeof stack === 'string' ? stack.slice(0, 5000) : null,
      url: typeof url === 'string' ? url.slice(0, 500) : null,
      userAgent: typeof userAgent === 'string' ? userAgent.slice(0, 500) : null,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('POST /api/errors error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to save error' });
  }
});

// GET /api/errors
router.get('/', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 500);

  try {
    const errors = await getErrors(limit);
    res.json({ success: true, count: errors.length, errors });
  } catch (err) {
    console.error('GET /api/errors error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch errors' });
  }
});

module.exports = router;

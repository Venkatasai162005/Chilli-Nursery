const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const Admin   = require('../models/Admin');
const mongoose = require('mongoose');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // ── Check MongoDB connection ──────────────────────────────────────────────
  const dbReady = mongoose.connection.readyState === 1; // 1 = connected

  if (!dbReady) {
    // ── Fallback: compare directly against .env credentials ──────────────
    const envEmail    = (process.env.ADMIN_EMAIL    || '').toLowerCase().trim();
    const envPassword =  process.env.ADMIN_PASSWORD || '';
    const inputEmail  = email.toLowerCase().trim();

    if (inputEmail === envEmail && password === envPassword) {
      // Generate a token using a fixed synthetic ID
      const syntheticId = 'env-admin-' + Buffer.from(envEmail).toString('hex').slice(0, 12);
      const token = generateToken(syntheticId);
      console.log('⚠️  DB offline — used .env credentials for admin login');
      return res.json({
        _id:   syntheticId,
        email: envEmail,
        token,
        warning: 'DB offline — fix MongoDB Atlas IP whitelist to persist sessions',
      });
    }

    return res.status(503).json({
      message: 'Database not connected. Fix MongoDB Atlas IP whitelist. Using .env credentials for now.',
    });
  }

  // ── Normal DB login ───────────────────────────────────────────────────────
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id:   admin._id,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (err) {
    console.error('Login error:', err.message);

    // If it's a MongoDB topology error, give helpful message
    if (err.message && (err.message.includes('topology') || err.message.includes('ECONNREFUSED') || err.message.includes('Atlas'))) {
      return res.status(503).json({
        message: 'Cannot reach database. Please whitelist your IP in MongoDB Atlas → Network Access → Allow 0.0.0.0/0',
      });
    }

    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ── GET /api/auth/me ────────────────────────────────────────────────────────
const { protect } = require('../middleware/adminAuth');
router.get('/me', protect, (req, res) => {
  res.json({ _id: req.admin._id, email: req.admin.email });
});

module.exports = router;

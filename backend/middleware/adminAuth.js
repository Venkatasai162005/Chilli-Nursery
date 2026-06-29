const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const mongoose = require('mongoose');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── Env-fallback synthetic token (DB was offline at login time) ──────────
    // The ID starts with 'env-admin-' and is not a valid ObjectId.
    // We trust the JWT signature and skip the DB lookup.
    if (typeof decoded.id === 'string' && decoded.id.startsWith('env-admin-')) {
      const envEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
      req.admin = { _id: decoded.id, email: envEmail };
      return next();
    }

    // ── Normal DB lookup ─────────────────────────────────────────────────────
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    req.admin = await Admin.findById(decoded.id).select('-passwordHash');

    if (!req.admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };

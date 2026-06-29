/**
 * create-admin.js — Run once to create / reset the admin account
 * Usage: node create-admin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Admin    = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'dvsaii@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sai162005';

(async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB');

    // Delete old admin (full reset)
    await Admin.deleteMany({ email: ADMIN_EMAIL });

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.create({ email: ADMIN_EMAIL, passwordHash });

    console.log('✅ Admin account created / reset successfully!');
    console.log('   Email   :', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
})();

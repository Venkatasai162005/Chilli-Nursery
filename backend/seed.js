/**
 * seed.js — Run once to create the admin account
 * Usage: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Admin    = require('./models/Admin');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      console.log('ℹ️  Admin already exists:', existing.email);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await Admin.create({ email: process.env.ADMIN_EMAIL, passwordHash });

    console.log('✅ Admin seeded successfully!');
    console.log('   Email:', process.env.ADMIN_EMAIL);
    console.log('   Password:', process.env.ADMIN_PASSWORD);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
})();

const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── HTTP server + Socket.io ──────────────────────────────────────────────────
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
  });
});

// Export io so routes can emit real-time events
module.exports.io = io;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/plants', require('./routes/plants'));
app.use('/api/orders', require('./routes/orders'));

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🌶️ Chilli Nursery API is running' });
});

// ── Connect to MongoDB & start server ───────────────────────────────────────
const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log('✅ Connected to MongoDB Atlas');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      console.log('⏳ Retrying MongoDB connection in 10 seconds...');
      console.log('👉 Fix: Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
      setTimeout(connectWithRetry, 10000);
    });
};

// Start server immediately, connect to DB in background
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  connectWithRetry();
});

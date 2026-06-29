const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Order = require('../models/Order');
const Plant = require('../models/Plant');
const { protect } = require('../middleware/adminAuth');

// ── POST /api/orders ─────────────────────────────────────────────────────────
// Public — place a new order
router.post('/', async (req, res) => {
  try {
    const { farmerName, phone, address, deliveryType, items, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Verify stock and compute total
    let total = 0;
    const resolvedItems = [];
    const mongoose = require('mongoose');

    for (const item of items) {
      // Check if it's a valid MongoDB ObjectId
      const isValidId = mongoose.Types.ObjectId.isValid(item.plantId);

      if (isValidId) {
        // Fetch from DB
        const plant = await Plant.findById(item.plantId);
        if (!plant) {
          return res.status(400).json({ message: `Plant not found: ${item.plantId}` });
        }
        if (plant.stock < item.qty) {
          return res.status(400).json({
            message: `Not enough stock for "${plant.name}". Available: ${plant.stock}`,
          });
        }
        resolvedItems.push({
          plantId:   plant._id,
          plantName: plant.name,
          priceEach: plant.price,
          qty:       item.qty,
        });
        total += plant.price * item.qty;
        // Deduct stock
        plant.stock -= item.qty;
        await plant.save();
      } else {
        // Static plant (e.g. 'shark-chilli') — use price/name from payload
        const priceEach = Number(item.price) || 0;
        const plantName = item.name || item.plantId;
        resolvedItems.push({
          plantId:   item.plantId,
          plantName,
          priceEach,
          qty:       item.qty,
        });
        total += priceEach * item.qty;
      }
    }

    const orderId = 'ORD-' + nanoid(6).toUpperCase();

    const order = await Order.create({
      orderId,
      farmerName,
      phone,
      address,
      deliveryType: deliveryType || 'pickup',
      items: resolvedItems,
      total,
      notes: notes || '',
      status: 'Pending',
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ message: err.message });
  }
});


// ── GET /api/orders ──────────────────────────────────────────────────────────
// Admin — get all orders
router.get('/', protect, async (req, res) => {
  try {
    const { status, search, from, to } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { farmerName: { $regex: search, $options: 'i' } },
        { phone:      { $regex: search, $options: 'i' } },
        { orderId:    { $regex: search, $options: 'i' } },
      ];
    }
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to)   query.createdAt.$lte = new Date(to);
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/orders/track/:orderId ───────────────────────────────────────────
// Public — farmer tracks order by orderId string (kept for backward compat)
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({
      orderId:    order.orderId,
      status:     order.status,
      farmerName: order.farmerName,
      total:      order.total,
      items:      order.items,
      createdAt:  order.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/orders/by-phone/:phone ──────────────────────────────────────────
// Public — farmer tracks ALL their orders by mobile number (no login needed)
router.get('/by-phone/:phone', async (req, res) => {
  try {
    const phone = req.params.phone.trim();
    if (!phone || phone.length < 6) {
      return res.status(400).json({ message: 'Please enter a valid mobile number' });
    }
    const orders = await Order.find({ phone: { $regex: phone, $options: 'i' } })
      .sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this mobile number' });
    }
    // Return safe fields only (no internal _ids beyond what's needed)
    res.json(orders.map((o) => ({
      orderId:      o.orderId,
      status:       o.status,
      farmerName:   o.farmerName,
      phone:        o.phone,
      address:      o.address,
      deliveryType: o.deliveryType,
      total:        o.total,
      items:        o.items,
      notes:        o.notes,
      createdAt:    o.createdAt,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/orders/:id ──────────────────────────────────────────────────────
// Admin — get single order by MongoDB _id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/orders/:id/status ───────────────────────────────────────────────
// Admin — update order status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Ready', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/orders/admin/stats ──────────────────────────────────────────────
// Admin — dashboard stats
router.get('/admin/stats', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, pendingOrders, allOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ status: 'Pending' }),
      Order.find(),
    ]);

    const totalRevenue = allOrders
      .filter((o) => o.status !== 'Pending')
      .reduce((sum, o) => sum + o.total, 0);

    // Top plants by quantity ordered
    const plantCounts = {};
    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!plantCounts[item.plantName]) plantCounts[item.plantName] = 0;
        plantCounts[item.plantName] += item.qty;
      });
    });
    const topPlants = Object.entries(plantCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));

    res.json({
      todayOrders,
      pendingOrders,
      totalOrders: allOrders.length,
      totalRevenue,
      topPlants,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

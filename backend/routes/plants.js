const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const Plant   = require('../models/Plant');
const { protect } = require('../middleware/adminAuth');

// ── Detect if Cloudinary is properly configured ──────────────────────────────
const CLOUDINARY_OK = (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY    &&
  process.env.CLOUDINARY_API_KEY    !== 'your_api_key'
);

let upload;

if (CLOUDINARY_OK) {
  // Use Cloudinary storage
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'chilli-nursery',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    },
  });

  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
  console.log('🖼️  Cloudinary image storage active');
} else {
  // Fallback: store image as base64 in MongoDB
  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new Error('Only image files are allowed'), false);
    },
  });
  console.log('🖼️  Cloudinary not configured — using base64 image storage');
}

// Helper: extract imageUrl from uploaded file (Cloudinary or base64)
function getImageUrl(req) {
  if (!req.file) return '';
  if (CLOUDINARY_OK) {
    // Cloudinary sets req.file.path as the secure URL
    return req.file.path || '';
  }
  // Base64 fallback
  const mime = req.file.mimetype || 'image/jpeg';
  return `data:${mime};base64,${req.file.buffer.toString('base64')}`;
}

function getPublicId(req) {
  if (!req.file) return '';
  if (CLOUDINARY_OK) return req.file.filename || '';
  return '';
}

// ── GET /api/plants ─────────────────────────────────────────────────────────
// Public — returns all visible plants
router.get('/', async (req, res) => {
  try {
    const { search, type, minPrice, maxPrice } = req.query;
    const query = { hidden: false };

    if (search)   query.name  = { $regex: search, $options: 'i' };
    if (type)     query.type  = type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const plants = await Plant.find(query).sort({ createdAt: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/plants/admin/all ────────────────────────────────────────────────
// Admin — returns ALL plants including hidden
router.get('/admin/all', protect, async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/plants/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/plants ─────────────────────────────────────────────────────────
// Admin — add new plant
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { name, type, description, growingTips, price, stock, hidden } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ message: 'Name, price and stock are required' });
    }

    const plant = await Plant.create({
      name,
      type:          type  || 'Seedling',
      description:   description   || '',
      growingTips:   growingTips   || '',
      price:         Number(price),
      stock:         Number(stock),
      hidden:        hidden === 'true',
      imageUrl:      getImageUrl(req),
      imagePublicId: getPublicId(req),
    });

    res.status(201).json(plant);
  } catch (err) {
    console.error('Add plant error:', err);
    res.status(400).json({ message: err.message });
  }
});

// ── PUT /api/plants/:id ──────────────────────────────────────────────────────
// Admin — update plant
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });

    const { name, type, description, growingTips, price, stock, hidden } = req.body;

    if (name)                        plant.name        = name;
    if (type)                        plant.type        = type;
    if (description  !== undefined)  plant.description = description;
    if (growingTips  !== undefined)  plant.growingTips = growingTips;
    if (price        !== undefined)  plant.price       = Number(price);
    if (stock        !== undefined)  plant.stock       = Number(stock);
    if (hidden       !== undefined)  plant.hidden      = hidden === 'true';

    if (req.file) {
      // Delete old Cloudinary image if applicable
      if (CLOUDINARY_OK && plant.imagePublicId) {
        const cloudinary = require('cloudinary').v2;
        await cloudinary.uploader.destroy(plant.imagePublicId).catch(() => {});
      }
      plant.imageUrl      = getImageUrl(req);
      plant.imagePublicId = getPublicId(req);
    }

    const updated = await plant.save();
    res.json(updated);
  } catch (err) {
    console.error('Update plant error:', err);
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE /api/plants/:id ───────────────────────────────────────────────────
// Admin — delete plant
router.delete('/:id', protect, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });

    if (CLOUDINARY_OK && plant.imagePublicId) {
      const cloudinary = require('cloudinary').v2;
      await cloudinary.uploader.destroy(plant.imagePublicId).catch(() => {});
    }

    await plant.deleteOne();
    res.json({ message: 'Plant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

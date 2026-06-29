const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plant name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Plant type is required'],
      enum: ['Seedling', 'Grafted', 'Hybrid', 'Open Pollinated', 'Other'],
      default: 'Seedling',
    },
    description: {
      type: String,
      default: '',
    },
    growingTips: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    imageUrl: {
      type: String,
      default: '',
      // Supports both Cloudinary URLs and base64 data URIs
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plant', plantSchema);

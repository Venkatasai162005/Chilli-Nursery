const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  plantId:    { type: mongoose.Schema.Types.Mixed, required: true },
  plantName:  { type: String, required: true },
  priceEach:  { type: Number, required: true },
  qty:        { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    farmerName: {
      type: String,
      required: [true, 'Farmer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address / Village is required'],
      trim: true,
    },
    deliveryType: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'pickup',
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Ready', 'Delivered'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

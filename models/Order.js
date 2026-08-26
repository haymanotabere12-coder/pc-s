import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product_id: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  user_id: { type: String },
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_phone: { type: String, required: true },
  shipping_address: {
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    postal_code: { type: String, default: '' },
    country: { type: String, default: 'Ethiopia' }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, default: 0 },
  discount_amount: { type: Number, default: 0 },
  shipping_fee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
  payment_method: { type: String, default: 'card' },
  payment_status: { type: String, default: 'paid' },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  notes: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

export const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

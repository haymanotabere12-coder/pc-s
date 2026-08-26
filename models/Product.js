import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  stock: { type: Number, default: 10 },
  category_id: { type: Number, default: 1 },
  category_name: { type: String, default: 'Hardware' },
  image: { type: String, default: '2.webp' },
  featured: { type: Number, default: 0 },
  rating: { type: Number, default: 4.8 },
  reviews_count: { type: Number, default: 12 },
  specs: { type: Map, of: String, default: {} },
  created_at: { type: Date, default: Date.now }
});

export const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

export const CategoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema);

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  created_at: { type: Date, default: Date.now }
});

export const MessageModel = mongoose.models.Message || mongoose.model('Message', messageSchema);

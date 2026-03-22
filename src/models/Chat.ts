import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  role: { type: String, enum: ['user', 'model'], required: true },
  content: { type: Schema.Types.Mixed, required: [true, "Message content is required"] }
});

const ChatSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "New Chat"
  },
  messages: [MessageSchema]
}, {
  timestamps: true,
});

export const Chat = models.Chat || model('Chat', ChatSchema);

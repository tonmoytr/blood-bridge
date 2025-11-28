import { IChatThread } from '@/types/database';
import mongoose, { Model, Schema } from 'mongoose';

// Mongoose schema for Chat Thread
const ChatThreadSchema = new Schema<IChatThread>(
  {
    requestId: {
      type: String,
      required: [true, 'Request ID is required'],
      ref: 'Request',
    },
    donorId: {
      type: String,
      required: [true, 'Donor ID is required'],
      ref: 'User',
    },
    seekerId: {
      type: String,
      required: [true, 'Seeker ID is required'],
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phoneRevealed: {
      type: Boolean,
      default: false, // Set to true when donor accepts request
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ChatThreadSchema.index({ requestId: 1 });
ChatThreadSchema.index({ donorId: 1, isActive: 1 });
ChatThreadSchema.index({ seekerId: 1, isActive: 1 });

// Prevent model recompilation
const ChatThread: Model<IChatThread> = mongoose.models.ChatThread || mongoose.model<IChatThread>('ChatThread', ChatThreadSchema);

export default ChatThread;

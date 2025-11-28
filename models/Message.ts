import { IMessage } from '@/types/database';
import mongoose, { Model, Schema } from 'mongoose';

// Mongoose schema for Message
const MessageSchema = new Schema<IMessage>(
  {
    threadId: {
      type: String,
      required: [true, 'Thread ID is required'],
      ref: 'ChatThread',
    },
    senderId: {
      type: String,
      required: [true, 'Sender ID is required'],
      ref: 'User',
    },
    senderName: {
      type: String,
      required: [true, 'Sender name is required'],
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MessageSchema.index({ threadId: 1, createdAt: -1 }); // For fetching messages in order

// Prevent model recompilation
const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;

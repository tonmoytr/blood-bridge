import mongoose, { Document, Model, Schema } from "mongoose";

export interface IChatThread extends Document {
  requestId: mongoose.Types.ObjectId;
  donorId: mongoose.Types.ObjectId;
  seekerId: mongoose.Types.ObjectId;
  lastMessageAt: Date;
  unreadCount: {
    donor: number;
    seeker: number;
  };
  status: "ACTIVE" | "CLOSED";
  createdAt: Date;
  updatedAt: Date;
}

const ChatThreadSchema = new Schema<IChatThread>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
      unique: true, // One thread per request
    },
    donorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seekerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      donor: {
        type: Number,
        default: 0,
      },
      seeker: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
ChatThreadSchema.index({ donorId: 1, lastMessageAt: -1 });
ChatThreadSchema.index({ seekerId: 1, lastMessageAt: -1 });
ChatThreadSchema.index({ requestId: 1 });

const ChatThread: Model<IChatThread> =
  mongoose.models.ChatThread ||
  mongoose.model<IChatThread>("ChatThread", ChatThreadSchema);

export default ChatThread;

import { IReport } from '@/types/database';
import mongoose, { Model, Schema } from 'mongoose';

// Mongoose schema for Report (Anti-Dalal System)
const ReportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: String,
      required: [true, 'Reporter ID is required'],
      ref: 'User',
    },
    reportedUserId: {
      type: String,
      required: [true, 'Reported user ID is required'],
      ref: 'User',
    },
    requestId: {
      type: String,
      ref: 'Request',
      default: null,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      enum: [
        'ASKING_MONEY',
        'FAKE_REQUEST',
        'NO_SHOW',
        'INAPPROPRIATE_BEHAVIOR',
        'OTHER',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'REVIEWED', 'ACTIONED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ReportSchema.index({ reportedUserId: 1, status: 1 });
ReportSchema.index({ reporterId: 1 });
ReportSchema.index({ status: 1, createdAt: -1 });

// Prevent model recompilation
const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;

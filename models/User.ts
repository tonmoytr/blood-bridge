import { BloodGroup, DonorStatus, Gender, IUser } from '@/types/database';
import mongoose, { Model, Schema } from 'mongoose';

// Mongoose schema for User
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^\+8801[0-9]{9}$/, 'Please enter a valid Bangladesh phone number'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Must be at least 18 years old'],
      max: [65, 'Must be under 65 years old'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['male', 'female'] as Gender[],
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as BloodGroup[],
    },
    location: {
      division: {
        type: String,
        required: [true, 'Division is required'],
      },
      district: {
        type: String,
        required: [true, 'District is required'],
      },
      thana: {
        type: String,
        required: [true, 'Thana is required'],
      },
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    totalDonations: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COOLDOWN', 'SNOOZED', 'BANNED'] as DonorStatus[],
      default: 'ACTIVE',
    },
    cooldownUntil: {
      type: Date,
      default: null,
    },
    snoozedUntil: {
      type: Date,
      default: null,
    },
    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes for performance
// UserSchema.index({ phone: 1 }); // Already indexed by unique: true
UserSchema.index({ bloodGroup: 1, status: 1 });
UserSchema.index({ 'location.district': 1, 'location.thana': 1 });

// Prevent model recompilation in Next.js hot reload
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

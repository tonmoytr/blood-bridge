import { BloodGroup, IRequest, MissionStatus, RequestStatus, TrustLevel, UrgencyLevel } from '@/types/database';
import mongoose, { Model, Schema } from 'mongoose';

// Mongoose schema for Blood Request
const RequestSchema = new Schema<IRequest>(
  {
    seekerId: {
      type: String,
      required: [true, 'Seeker ID is required'],
      ref: 'User',
    },
    seekerName: {
      type: String,
      required: [true, 'Seeker name is required'],
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    patientAge: {
      type: Number,
      required: [true, 'Patient age is required'],
      min: [0, 'Age must be positive'],
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as BloodGroup[],
    },
    unitsNeeded: {
      type: Number,
      required: [true, 'Units needed is required'],
      min: [1, 'At least 1 unit required'],
      max: [10, 'Maximum 10 units allowed'],
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    hospitalAddress: {
      type: String,
      required: false, // Optional - location is already in division/district/thana
      default: '',
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
    urgency: {
      type: String,
      required: [true, 'Urgency level is required'],
      enum: ['CRITICAL', 'HIGH', 'NORMAL'] as UrgencyLevel[],
    },
    neededBy: {
      type: Date,
      required: [true, 'Needed by date is required'],
    },
    hasPrescription: {
      type: Boolean,
      default: false,
    },
    prescriptionUrl: {
      type: String,
      default: null,
    },
    additionalInfo: {
      type: String,
      required: false,
      default: '',
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    alternatePhone: {
      type: String,
      required: false,
      default: '',
      trim: true,
    },
    trustScore: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'] as TrustLevel[],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['OPEN', 'ACCEPTED', 'COMPLETED', 'CANCELLED'] as RequestStatus[],
      default: 'OPEN',
    },
    acceptedDonorId: {
      type: String,
      ref: 'User',
      default: null,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    missionStatus: {
      type: String,
      enum: ['ACCEPTED', 'ON_THE_WAY', 'AT_HOSPITAL', 'DONATING', 'COMPLETED'] as MissionStatus[],
      default: null,
    },
    missionTimestamps: {
      accepted: { type: Date, default: null },
      onTheWay: { type: Date, default: null },
      atHospital: { type: Date, default: null },
      donating: { type: Date, default: null },
      completed: { type: Date, default: null },
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
RequestSchema.index({ bloodGroup: 1, status: 1 });
RequestSchema.index({ 'location.district': 1, 'location.thana': 1, status: 1 });
RequestSchema.index({ urgency: 1, status: 1 });
RequestSchema.index({ seekerId: 1 });
RequestSchema.index({ acceptedDonorId: 1 });

// Prevent model recompilation
const Request: Model<IRequest> = mongoose.models.Request || mongoose.model<IRequest>('Request', RequestSchema);

export default Request;

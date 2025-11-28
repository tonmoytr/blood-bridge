// TypeScript types for MongoDB models

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
export type DonorStatus = "ACTIVE" | "COOLDOWN" | "SNOOZED" | "BANNED";
export type Gender = "male" | "female";
export type UrgencyLevel = "CRITICAL" | "HIGH" | "NORMAL";
export type TrustLevel = "HIGH" | "MEDIUM" | "LOW";
export type RequestStatus = "OPEN" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
export type MissionStatus = "ACCEPTED" | "LEAVING_HOME" | "AT_HOSPITAL" | "COMPLETED";

export interface Location {
  division: string;
  district: string;
  thana: string;
}

// User/Donor Interface
export interface IUser {
  name: string;
  phone: string; // unique
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  location: Location;
  lastDonationDate?: Date;
  totalDonations: number;
  status: DonorStatus;
  cooldownUntil?: Date;
  snoozedUntil?: Date;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Blood Request Interface
export interface IRequest {
  seekerId: string; // User ID
  seekerName: string;
  patientName: string;
  patientAge: number;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  location: Location;
  urgency: UrgencyLevel;
  neededBy: Date;
  hasPrescription: boolean;
  prescriptionUrl?: string;
  additionalInfo?: string;
  contactPhone: string;
  alternatePhone?: string;
  trustScore: TrustLevel;
  status: RequestStatus;
  acceptedDonorId?: string; // User ID
  acceptedAt?: Date;
  missionStatus?: MissionStatus;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Chat Thread Interface
export interface IChatThread {
  requestId: string;
  donorId: string;
  seekerId: string;
  isActive: boolean;
  phoneRevealed: boolean; // true after donor accepts
  createdAt: Date;
  updatedAt: Date;
}

// Message Interface
export interface IMessage {
  threadId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
}

// Report Interface (Anti-Dalal)
export interface IReport {
  reporterId: string; // User ID
  reportedUserId: string; // User ID
  requestId?: string;
  reason: string;
  description: string;
  status: "PENDING" | "REVIEWED" | "ACTIONED";
  createdAt: Date;
}

// Chronic Patient Pair Interface (Week 8)
export interface IChronicPair {
  donorId: string;
  patientName: string;
  patientAge: number;
  bloodGroup: BloodGroup;
  condition: string;
  frequency: number; // days between donations
  lastDonationDate?: Date;
  nextReminderDate?: Date;
  isActive: boolean;
  createdAt: Date;
}

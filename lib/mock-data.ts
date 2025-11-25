// Mock data for UI development
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
export type DonorStatus = "ACTIVE" | "COOLDOWN" | "SNOOZED" | "BANNED";
export type UrgencyLevel = "CRITICAL" | "HIGH" | "NORMAL";
export type TrustLevel = "HIGH" | "MEDIUM" | "LOW";
export type RequestStatus = "OPEN" | "ACCEPTED" | "COMPLETED" | "CANCELLED";

export interface MockUser {
  id: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  location: {
    division: string;
    district: string;
    thana: string;
  };
  totalDonations: number;
  status: DonorStatus;
  cooldownDaysRemaining?: number;
  badges: string[];
}

export interface MockRequest {
  id: string;
  seekerId: string;
  seekerName: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  district: string;
  thana: string;
  urgency: UrgencyLevel;
  trustScore: TrustLevel;
  status: RequestStatus;
  hasPrescription: boolean;
  createdAt: Date;
  neededBy: Date;
}

// Mock donors
export const mockDonors: MockUser[] = [
  {
    id: "1",
    name: "Rafiq Ahmed",
    phone: "+8801712345678",
    bloodGroup: "O-",
    location: {
      division: "Dhaka",
      district: "Dhaka",
      thana: "Dhanmondi",
    },
    totalDonations: 12,
    status: "ACTIVE",
    badges: ["Rojonigondha", "Krishnachura", "Rokto Joddha"],
  },
  {
    id: "2",
    name: "Fatima Khan",
    phone: "+8801812345678",
    bloodGroup: "A+",
    location: {
      division: "Dhaka",
      district: "Dhaka",
      thana: "Gulshan",
    },
    totalDonations: 5,
    status: "COOLDOWN",
    cooldownDaysRemaining: 45,
    badges: ["Rojonigondha"],
  },
  {
    id: "3",
    name: "Karim Hassan",
    phone: "+8801912345678",
    bloodGroup: "B+",
    location: {
      division: "Chittagong",
      district: "Chittagong",
      thana: "Agrabad",
    },
    totalDonations: 3,
    status: "ACTIVE",
    badges: ["Rojonigondha"],
  },
];

// Mock requests
export const mockRequests: MockRequest[] = [
  {
    id: "1",
    seekerId: "s1",
    seekerName: "Rahim Mia",
    patientName: "Ayesha Begum",
    bloodGroup: "O-",
    unitsNeeded: 2,
    hospitalName: "Dhaka Medical College Hospital",
    hospitalAddress: "Secretariat Rd, Dhaka 1000",
    district: "Dhaka",
    thana: "Shahbag",
    urgency: "CRITICAL",
    trustScore: "HIGH",
    status: "OPEN",
    hasPrescription: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    neededBy: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
  },
  {
    id: "2",
    seekerId: "s2",
    seekerName: "Salma Khatun",
    patientName: "Mohammad Ali",
    bloodGroup: "A+",
    unitsNeeded: 1,
    hospitalName: "Square Hospital",
    hospitalAddress: "18/F, Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205",
    district: "Dhaka",
    thana: "Panthapath",
    urgency: "HIGH",
    trustScore: "HIGH",
    status: "OPEN",
    hasPrescription: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    neededBy: new Date(Date.now() + 12 * 60 * 60 * 1000),
  },
  {
    id: "3",
    seekerId: "s3",
    seekerName: "Jamal Uddin",
    patientName: "Nazia Rahman",
    bloodGroup: "B+",
    unitsNeeded: 1,
    hospitalName: "Bangabandhu Sheikh Mujib Medical University",
    hospitalAddress: "Shahbag, Dhaka 1000",
    district: "Dhaka",
    thana: "Shahbag",
    urgency: "NORMAL",
    trustScore: "MEDIUM",
    status: "OPEN",
    hasPrescription: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    neededBy: new Date(Date.now() + 48 * 60 * 60 * 1000),
  },
  {
    id: "4",
    seekerId: "s4",
    seekerName: "Nasrin Akter",
    patientName: "Habib Khan",
    bloodGroup: "AB-",
    unitsNeeded: 3,
    hospitalName: "United Hospital",
    hospitalAddress: "Plot 15, Road 71, Gulshan, Dhaka 1212",
    district: "Dhaka",
    thana: "Gulshan",
    urgency: "CRITICAL",
    trustScore: "HIGH",
    status: "OPEN",
    hasPrescription: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    neededBy: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
];

// Current logged-in donor (for dashboard)
export const currentDonor: MockUser = mockDonors[1]; // Fatima Khan (in cooldown)

// Stats for landing page
export const stats = {
  totalDonors: 2847,
  activeDonors: 1523,
  requestsFulfilled: 4291,
  livesImpacted: 12873,
};

"use client";

import { BloodGroupBadge } from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bangladeshLocations } from "@/lib/locations";
import { formatDistanceToNow } from "date-fns";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  Edit,
  Heart,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  TrendingUp,
  User,
  X
} from "lucide-react";
import { useState } from "react";

// Mock unified user profile
const mockProfile = {
  // Shared Info
  id: "USER001",
  name: "Karim Rahman",
  email: "karim.rahman@example.com",
  phone: "01712345678",
  division: "Dhaka",
  district: "Dhaka",
  thana: "Dhanmondi",
  joinedDate: new Date("2024-01-15"),
  
  // Donor-specific
  isDonor: true,
  bloodGroup: "O+" as const,
  totalDonations: 12,
  lastDonation: new Date("2024-10-20"),
  nextEligibleDate: new Date("2025-01-20"),
  donorBadges: ["Life Saver", "Hero", "Reliable Donor", "Speedster"],
  
  // Seeker-specific
  isSeeker: true,
  totalRequests: 3,
  successfulRequests: 2,
  averageResponseTime: "22 mins",
  seekerTrustScore: "HIGH" as const,
};

// Mock donation history
const mockDonationHistory = [
  {
    id: "DON012",
    date: new Date("2024-10-20"),
    patientName: "Ahmed Hassan",
    hospital: "Dhaka Medical College Hospital",
    bloodGroup: "O+" as const,
    units: 2,
  },
  {
    id: "DON011",
    date: new Date("2024-07-15"),
    patientName: "Fatima Begum",
    hospital: "Square Hospital",
    bloodGroup: "O+" as const,
    units: 1,
  },
  {
    id: "DON010",
    date: new Date("2024-04-10"),
    patientName: "Rahim Khan",
    hospital: "United Hospital",
    bloodGroup: "O+" as const,
    units: 2,
  },
];

export default function UnifiedProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: mockProfile.name,
    phone: mockProfile.phone,
    division: mockProfile.division,
    district: mockProfile.district,
    thana: mockProfile.thana,
  });

  const handleSave = () => {
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: mockProfile.name,
      phone: mockProfile.phone,
      division: mockProfile.division,
      district: mockProfile.district,
      thana: mockProfile.thana,
    });
    setIsEditing(false);
  };

  const daysUntilEligible = Math.ceil(
    (mockProfile.nextEligibleDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-emergency-600 hover:bg-emergency-700">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-emergency-600 hover:bg-emergency-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              {mockProfile.isDonor && <TabsTrigger value="donor">Donor Profile</TabsTrigger>}
              {mockProfile.isSeeker && <TabsTrigger value="seeker">Seeker Profile</TabsTrigger>}
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-6">
              {/* Account Overview Card */}
              <Card className="border-2 border-emergency-200 bg-gradient-to-br from-emergency-50 to-white">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-emergency-600 flex items-center justify-center text-white text-3xl font-bold">
                      {mockProfile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{mockProfile.name}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Member since {mockProfile.joinedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </CardDescription>
                      <div className="flex gap-2 mt-2">
                        {mockProfile.isDonor && (
                          <Badge className="bg-emergency-600 text-white">
                            <Droplet className="h-3 w-3 mr-1" fill="currentColor" />
                            Donor
                          </Badge>
                        )}
                        {mockProfile.isSeeker && (
                          <Badge className="bg-trust-600 text-white">
                            <Heart className="h-3 w-3 mr-1" />
                            Seeker
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic profile details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                        Full Name *
                      </Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="text-base"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <User className="h-5 w-5 text-gray-400" />
                          <p className="font-semibold text-gray-900">{mockProfile.name}</p>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Email Address</Label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-gray-900">{mockProfile.email}</p>
                        </div>
                        <Badge variant="outline" className="text-trust-600 border-trust-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        Phone Number *
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="text-base"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <p className="font-mono font-semibold text-gray-900">{mockProfile.phone}</p>
                        </div>
                      )}
                    </div>

                    {/* Member Since */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Member Since</Label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {mockProfile.joinedDate.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(mockProfile.joinedDate, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Location */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-gray-700">Location Information</Label>
                    {isEditing ? (
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="division" className="text-xs text-gray-600">Division *</Label>
                          <Select value={formData.division} onValueChange={(value) => setFormData({ ...formData, division: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {bangladeshLocations.divisions.map((div) => (
                                <SelectItem key={div} value={div}>{div}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district" className="text-xs text-gray-600">District *</Label>
                          <Input
                            id="district"
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="thana" className="text-xs text-gray-600">Thana *</Label>
                          <Input
                            id="thana"
                            value={formData.thana}
                            onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {mockProfile.thana}, {mockProfile.district}
                          </p>
                          <p className="text-sm text-gray-600">{mockProfile.division} Division, Bangladesh</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {mockProfile.isDonor && (
                    <>
                      <Separator />
                      {/* Blood Group - Read Only */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Blood Group</Label>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <Droplet className="h-5 w-5 text-emergency-600" fill="currentColor" />
                          <div className="flex-1">
                            <BloodGroupBadge bloodGroup={mockProfile.bloodGroup} size="md" />
                          </div>
                          <Badge variant="outline" className="text-gray-600">
                            <Shield className="h-3 w-3 mr-1" />
                            Cannot be changed
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Password</p>
                      <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donor Profile Tab */}
            {mockProfile.isDonor && (
              <TabsContent value="donor" className="space-y-6">
                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="border-2 border-emergency-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emergency-100 rounded-lg">
                          <Heart className="h-6 w-6 text-emergency-600" fill="currentColor" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{mockProfile.totalDonations}</p>
                          <p className="text-sm text-gray-600">Lives Saved</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-success-100 rounded-lg">
                          <CheckCircle2 className="h-6 w-6 text-success-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">100%</p>
                          <p className="text-sm text-gray-600">Completion</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-warning-100 rounded-lg">
                          <Clock className="h-6 w-6 text-warning-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">18m</p>
                          <p className="text-sm text-gray-600">Avg Response</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-cooldown-100 rounded-lg">
                          <Award className="h-6 w-6 text-cooldown-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{mockProfile.donorBadges.length}</p>
                          <p className="text-sm text-gray-600">Badges</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Blood Group & Eligibility */}
                <Card>
                  <CardHeader>
                    <CardTitle>Donor Information</CardTitle>
                    <CardDescription>Your blood donation details and eligibility status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-emergency-50 rounded-lg border-2 border-emergency-200">
                        <Label className="mb-3 block text-sm font-semibold">Blood Group</Label>
                        <BloodGroupBadge bloodGroup={mockProfile.bloodGroup} size="lg" />
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <Label className="mb-3 block text-sm font-semibold">Donation Eligibility</Label>
                        {daysUntilEligible > 0 ? (
                          <Badge className="bg-cooldown-600 text-white text-lg px-4 py-2">
                            <Clock className="h-4 w-4 mr-2" />
                            Eligible in {daysUntilEligible} days
                          </Badge>
                        ) : (
                          <Badge className="bg-trust-600 text-white text-lg px-4 py-2">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Ready to Donate
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Last Donation</p>
                          <p className="font-semibold text-gray-900">
                            {formatDistanceToNow(mockProfile.lastDonation, { addSuffix: true })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {mockProfile.lastDonation.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Next Eligible Date</p>
                          <p className="font-semibold text-gray-900">
                            {mockProfile.nextEligibleDate.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(mockProfile.nextEligibleDate, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Donation History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Donations</CardTitle>
                    <CardDescription>Your latest blood donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockDonationHistory.map((donation) => (
                        <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-trust-100 rounded-lg">
                              <Heart className="h-6 w-6 text-trust-600" fill="currentColor" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{donation.patientName}</p>
                              <p className="text-sm text-gray-600">{donation.hospital}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {donation.date.toLocaleDateString()} • {donation.units} unit{donation.units > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <BloodGroupBadge bloodGroup={donation.bloodGroup} size="sm" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-cooldown-600" />
                      Badges & Achievements
                    </CardTitle>
                    <CardDescription>Recognition for your life-saving contributions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {mockProfile.donorBadges.map((badge) => (
                        <div 
                          key={badge} 
                          className="flex items-center gap-3 p-4 border-2 border-cooldown-200 bg-cooldown-50 rounded-lg"
                        >
                          <Award className="h-8 w-8 text-cooldown-600" />
                          <div>
                            <p className="font-semibold text-cooldown-900">{badge}</p>
                            <p className="text-xs text-cooldown-700">Earned</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Seeker Profile Tab */}
            {mockProfile.isSeeker && (
              <TabsContent value="seeker" className="space-y-6">
                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emergency-100 rounded-lg">
                          <Droplet className="h-6 w-6 text-emergency-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{mockProfile.totalRequests}</p>
                          <p className="text-sm text-gray-600">Total Requests</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-trust-100 rounded-lg">
                          <CheckCircle2 className="h-6 w-6 text-trust-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{mockProfile.successfulRequests}</p>
                          <p className="text-sm text-gray-600">Successful</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-warning-100 rounded-lg">
                          <Clock className="h-6 w-6 text-warning-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{mockProfile.averageResponseTime}</p>
                          <p className="text-sm text-gray-600">Avg Response</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-success-100 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-success-600" />
                        </div>
                        <div>
                          <Badge className="bg-trust-600 text-white text-sm">
                            {mockProfile.seekerTrustScore}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">Trust Score</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Seeker Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Request Statistics</CardTitle>
                    <CardDescription>Your blood request history and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 bg-trust-50 rounded-lg border-2 border-trust-200">
                        <p className="text-sm text-gray-600 mb-2">Success Rate</p>
                        <p className="text-4xl font-bold text-trust-600">
                          {Math.round((mockProfile.successfulRequests / mockProfile.totalRequests) * 100)}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {mockProfile.successfulRequests} of {mockProfile.totalRequests} requests fulfilled
                        </p>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Average Response Time</p>
                        <p className="text-4xl font-bold text-gray-900">
                          {mockProfile.averageResponseTime}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Time to first donor response
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="p-6 bg-gradient-to-br from-trust-50 to-white rounded-lg border-2 border-trust-200">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="h-6 w-6 text-trust-600" />
                        <p className="text-sm font-semibold text-gray-900">Trust Score</p>
                      </div>
                      <Badge className="bg-trust-600 text-white text-2xl px-6 py-3">
                        {mockProfile.seekerTrustScore}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-3">
                        Based on request accuracy, response time, completion rate, and community feedback
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
}

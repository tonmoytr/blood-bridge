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
import { IRequest, IUser } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import {
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    Droplet,
    Edit,
    Heart,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    User,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UnifiedProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [donations, setDonations] = useState<IRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    division: "",
    district: "",
    thana: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          router.push("/auth/signin");
          return;
        }

        // Fetch User Data
        const userRes = await fetch(`/api/users/${userId}`);
        if (!userRes.ok) throw new Error("Failed to fetch user profile");
        const userData = await userRes.json();
        setUser(userData);
        setFormData({
          name: userData.name,
          phone: userData.phone,
          email: userData.email || "",
          division: userData.location.division,
          district: userData.location.district,
          thana: userData.location.thana,
        });

        // Fetch Donation History
        const donationsRes = await fetch(`/api/requests?acceptedDonorId=${userId}&status=COMPLETED`);
        if (donationsRes.ok) {
          const donationsData = await donationsRes.json();
          setDonations(donationsData.requests || []);
        }

      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          location: {
            division: formData.division,
            district: formData.district,
            thana: formData.thana,
          }
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        email: user.email || "",
        division: user.location.division,
        district: user.location.district,
        thana: user.location.thana,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <SidebarLayout userType="donor">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-emergency-600" />
        </div>
      </SidebarLayout>
    );
  }

  if (!user) return null;

  const lastDonation = user.lastDonationDate ? new Date(user.lastDonationDate) : null;
  const nextEligibleDate = lastDonation 
    ? new Date(lastDonation.getTime() + 90 * 24 * 60 * 60 * 1000) // 90 days cooldown
    : new Date();
    
  const daysUntilEligible = Math.ceil((nextEligibleDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isEligible = daysUntilEligible <= 0;

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
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="donor">Donor Profile</TabsTrigger>
              {/* Seeker profile can be added later if needed */}
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-6">
              {/* Account Overview Card */}
              <Card className="border-2 border-emergency-200 bg-gradient-to-br from-emergency-50 to-white">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-emergency-600 flex items-center justify-center text-white text-3xl font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{user.name}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </CardDescription>
                      <div className="flex gap-2 mt-2">
                        {user.isAvailable && (
                          <Badge className="bg-emergency-600 text-white">
                            <Droplet className="h-3 w-3 mr-1" fill="currentColor" />
                            Donor
                          </Badge>
                        )}
                        <Badge className="bg-trust-600 text-white">
                          <Heart className="h-3 w-3 mr-1" />
                          Seeker
                        </Badge>
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
                          <p className="font-semibold text-gray-900">{user.name}</p>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Email Address</Label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-gray-900">{user.email || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        Phone Number *
                      </Label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <p className="font-mono font-semibold text-gray-900">{user.phone}</p>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Member Since</Label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
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
                            {user.location.thana}, {user.location.district}
                          </p>
                          <p className="text-sm text-gray-600">{user.location.division} Division, Bangladesh</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {user.isAvailable && (
                    <>
                      <Separator />
                      {/* Blood Group - Read Only */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Blood Group</Label>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <Droplet className="h-5 w-5 text-emergency-600" fill="currentColor" />
                          <div className="flex-1">
                            <BloodGroupBadge bloodGroup={user.bloodGroup} size="md" />
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donor Profile Tab */}
            {user.isAvailable && (
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
                          <p className="text-2xl font-bold text-gray-900">{user.totalDonations}</p>
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
                          <p className="text-2xl font-bold text-gray-900">{user.badges.length}</p>
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
                        <BloodGroupBadge bloodGroup={user.bloodGroup} size="lg" />
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <Label className="mb-3 block text-sm font-semibold">Donation Eligibility</Label>
                        {!isEligible ? (
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
                            {user.lastDonationDate 
                              ? formatDistanceToNow(new Date(user.lastDonationDate), { addSuffix: true })
                              : "Never"}
                          </p>
                          {user.lastDonationDate && (
                            <p className="text-xs text-gray-500">
                              {new Date(user.lastDonationDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Next Eligible Date</p>
                          <p className="font-semibold text-gray-900">
                            {nextEligibleDate.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isEligible ? "Now" : formatDistanceToNow(nextEligibleDate, { addSuffix: true })}
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
                    {donations.length > 0 ? (
                      <div className="space-y-4">
                        {donations.map((donation) => (
                          <div key={donation._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-trust-100 rounded-lg">
                                <Heart className="h-6 w-6 text-trust-600" fill="currentColor" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{donation.patientName}</p>
                                <p className="text-sm text-gray-600">{donation.hospitalName}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(donation.completedAt!).toLocaleDateString()} • {donation.unitsNeeded} unit{donation.unitsNeeded > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <BloodGroupBadge bloodGroup={donation.bloodGroup} size="sm" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No donations yet. Start your journey today!
                      </div>
                    )}
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
                    {user.badges.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-3">
                        {user.badges.map((badge) => (
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
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Complete donations to earn badges!
                      </div>
                    )}
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

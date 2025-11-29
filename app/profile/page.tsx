
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bangladeshLocations } from "@/lib/locations";
import { IRequest, IUser } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import {
    Activity,
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    Droplet,
    Edit,
    FileText,
    Heart,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    User,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UnifiedProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [donorHistory, setDonorHistory] = useState<IRequest[]>([]);
  const [seekerHistory, setSeekerHistory] = useState<IRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    division: "",
    district: "",
    thana: "",
    isAvailable: true,
  });

  // Helper to safely parse dates
  const parseDate = (dateValue: any) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          router.push("/auth/signin");
          return;
        }

        // 1. Fetch User Data
        const userRes = await fetch(`/api/users/${userId}`);
        if (!userRes.ok) throw new Error("Failed to fetch user profile");
        const userData = await userRes.json();
        setUser(userData.user);
        setFormData({
          name: userData.user.name,
          email: userData.user.email || "",
          division: userData.user.location?.division || "",
          district: userData.user.location?.district || "",
          thana: userData.user.location?.thana || "",
          isAvailable: userData.user.isAvailable ?? true,
        });

        // 2. Fetch Donor History (Completed missions)
        const donorRes = await fetch(`/api/requests?acceptedDonorId=${userId}&status=COMPLETED`);
        if (donorRes.ok) {
          const donorData = await donorRes.json();
          setDonorHistory(donorData.requests || []);
        }

        // 3. Fetch Seeker History (My requests)
        const seekerRes = await fetch(`/api/requests?seekerId=${userId}`);
        if (seekerRes.ok) {
          const seekerData = await seekerRes.json();
          setSeekerHistory(seekerData.requests || []);
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
          isAvailable: formData.isAvailable,
          location: {
            division: formData.division,
            district: formData.district,
            thana: formData.thana,
          }
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      
      const updatedUser = await response.json();
      setUser(updatedUser.user);
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
        email: user.email || "",
        division: user.location?.division || "",
        district: user.location?.district || "",
        thana: user.location?.thana || "",
        isAvailable: user.isAvailable ?? true,
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

  const lastDonation = parseDate(user.lastDonationDate);
  const nextEligibleDate = lastDonation 
    ? new Date(lastDonation.getTime() + 56 * 24 * 60 * 60 * 1000) // 56 days cooldown (consistent with dashboard)
    : new Date();
    
  const daysUntilEligible = Math.ceil((nextEligibleDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isEligible = daysUntilEligible <= 0;

  // Calculate Seeker Stats
  const totalRequests = seekerHistory.length;
  const fulfilledRequests = seekerHistory.filter(r => r.status === 'COMPLETED').length;

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emergency-500 to-emergency-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {(user.name || 'User').split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location?.thana || 'Unknown'}, {user.location?.district || 'Unknown'}</span>
                </div>
              </div>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm">
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

          {/* Main Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Personal Info</TabsTrigger>
              <TabsTrigger value="donor" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Donor Info</TabsTrigger>
              <TabsTrigger value="seeker" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Seeker Info</TabsTrigger>
            </TabsList>

            {/* 1. Personal Info Tab */}
            <TabsContent value="personal" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>Your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                      ) : (
                        <p className="text-lg font-medium text-gray-900">{user.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900">{user.email || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900 font-mono">{user.phone}</p>
                      </div>
                      <p className="text-xs text-gray-400">Cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900">
                          {parseDate(user.createdAt)?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || 'Recently'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location Details
                    </h3>
                    {isEditing ? (
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Division</Label>
                          <Select value={formData.division} onValueChange={(value) => setFormData({ ...formData, division: value })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {bangladeshLocations.divisions.map((div) => (
                                <SelectItem key={div} value={div}>{div}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">District</Label>
                          <Input value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Thana</Label>
                          <Input value={formData.thana} onChange={(e) => setFormData({ ...formData, thana: e.target.value })} />
                        </div>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Division</p>
                          <p className="font-medium text-gray-900">{user.location?.division || 'N/A'}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">District</p>
                          <p className="font-medium text-gray-900">{user.location?.district || 'N/A'}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Thana</p>
                          <p className="font-medium text-gray-900">{user.location?.thana || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 2. Donor Info Tab */}
            <TabsContent value="donor" className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Stats & Availability */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-emergency-600" fill="currentColor" />
                        Donor Status
                      </div>
                      {isEditing && (
                        <div className="flex items-center gap-2">
                          <Label htmlFor="availability" className="text-sm font-normal text-gray-600">Available to donate</Label>
                          <Switch 
                            id="availability"
                            checked={formData.isAvailable}
                            onCheckedChange={(checked) => setFormData({...formData, isAvailable: checked})}
                          />
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                        {user.bloodGroup ? <BloodGroupBadge bloodGroup={user.bloodGroup} size="lg" /> : <span className="text-gray-500">N/A</span>}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Current Status</p>
                        {user.isAvailable ? (
                          <Badge className="bg-success-100 text-success-700 hover:bg-success-100 border-success-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Unavailable
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${isEligible ? 'bg-success-100' : 'bg-cooldown-100'}`}>
                        <Clock className={`h-6 w-6 ${isEligible ? 'text-success-600' : 'text-cooldown-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {isEligible ? "You are eligible to donate!" : `Eligible in ${daysUntilEligible} days`}
                        </p>
                        <p className="text-sm text-gray-500">
                          Next eligible date: {nextEligibleDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emergency-50 to-white border-emergency-100">
                  <CardContent className="pt-6 text-center space-y-6">
                    <div>
                      <p className="text-4xl font-bold text-emergency-600">{user.totalDonations ?? 0}</p>
                      <p className="text-sm font-medium text-emergency-800">Lives Saved</p>
                    </div>
                    <Separator className="bg-emergency-200" />
                    <div>
                      <p className="text-4xl font-bold text-trust-600">{user.badges?.length ?? 0}</p>
                      <p className="text-sm font-medium text-trust-800">Badges Earned</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-cooldown-600" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(user.badges?.length ?? 0) > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(user.badges || []).map((badge) => (
                        <div key={badge} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                          <div className="h-12 w-12 rounded-full bg-cooldown-100 flex items-center justify-center mb-3 text-cooldown-600">
                            <Award className="h-6 w-6" />
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{badge}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Complete your first donation to earn badges!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Donation History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-gray-500" />
                    Donation History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {donorHistory.length > 0 ? (
                    <div className="space-y-4">
                      {donorHistory.map((donation) => (
                        <div key={donation._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-trust-100 rounded-lg">
                              <Heart className="h-6 w-6 text-trust-600" fill="currentColor" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{donation.patientName || 'Unknown Patient'}</p>
                              <p className="text-sm text-gray-600">{donation.hospitalName || 'Unknown Hospital'}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {parseDate(donation.completedAt)?.toLocaleDateString() || 'Date unknown'}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-trust-200 text-trust-700 bg-trust-50">
                            {donation.unitsNeeded} Unit{donation.unitsNeeded > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>No donation history yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 3. Seeker Info Tab */}
            <TabsContent value="seeker" className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Seeker Stats */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{totalRequests}</p>
                      <p className="text-sm text-gray-600">Total Requests</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="p-4 bg-green-100 rounded-full text-green-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{fulfilledRequests}</p>
                      <p className="text-sm text-gray-600">Requests Fulfilled</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Request History */}
              <Card>
                <CardHeader>
                  <CardTitle>My Requests</CardTitle>
                  <CardDescription>History of blood requests you have posted</CardDescription>
                </CardHeader>
                <CardContent>
                  {seekerHistory.length > 0 ? (
                    <div className="space-y-4">
                      {seekerHistory.map((request) => (
                        <div key={request._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${
                              request.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                              request.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              <Activity className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{request.patientName}</p>
                              <p className="text-sm text-gray-600">{request.hospitalName}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Posted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`mb-1 ${
                              request.status === 'COMPLETED' ? 'bg-green-600' :
                              request.status === 'CANCELLED' ? 'bg-red-600' :
                              'bg-blue-600'
                            }`}>
                              {request.status}
                            </Badge>
                            <p className="text-xs text-gray-500">
                              {request.unitsNeeded} Unit{request.unitsNeeded > 1 ? 's' : ''} • {request.bloodGroup}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p className="mb-4">You haven't posted any requests yet.</p>
                      <Button onClick={() => router.push('/request/new')} className="bg-emergency-600 hover:bg-emergency-700 text-white">
                        <Activity className="mr-2 h-4 w-4" />
                        Create a Request
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
}

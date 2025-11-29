"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  bangladeshLocations,
  getDistrictsByDivision,
  getThanasByDistrict
} from "@/lib/locations";
import { Calendar, Droplet, Heart, MapPin, Phone, User, Weight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    password: "",
    email: "",
    bloodGroup: "",
    division: "",
    district: "",
    thana: "",
    dateOfBirth: "",
    weight: "",
    isDonor: true, // Default to true as per "user can donor"
    lastDonation: "",
  });
  
  const [districts, setDistricts] = useState<string[]>([]);
  const [thanas, setThanas] = useState<string[]>([]);
  
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDivisionChange = (division: string) => {
    setFormData({ ...formData, division, district: "", thana: "" });
    setDistricts(getDistrictsByDivision(division));
    setThanas([]);
  };

  const handleDistrictChange = (district: string) => {
    setFormData({ ...formData, district, thana: "" });
    setThanas(getThanasByDistrict(district));
  };

  const handleSendOTP = async () => {
    if (!formData.mobileNumber || !/^\d{11}$/.test(formData.mobileNumber)) {
      toast.error("Please enter a valid 11-digit mobile number (e.g., 01XXXXXXXXX)");
      return;
    }

    setIsLoading(true);
    // TODO: Add actual OTP sending logic
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast.success("OTP sent successfully");
    }, 1000);
  };

  const handleSignUp = async () => {
    if (!formData.name || !formData.mobileNumber || !formData.password || !formData.bloodGroup || !formData.division || !formData.district || !formData.thana) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      toast.success("Account created successfully!");

      // Store user ID in localStorage for "auth"
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userRole", "donor"); // Everyone is a donor/seeker now

      // Redirect to donor dashboard
      router.push("/donor");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emergency-50 via-white to-trust-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emergency-600 to-emergency-700 flex items-center justify-center shadow-lg">
              <Droplet className="h-8 w-8 text-white" fill="currentColor" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emergency-600 to-trust-600 bg-clip-text text-transparent">
              BloodBridge
            </h1>
          </div>
          <p className="text-gray-600">Join the community of life savers</p>
        </div>

        {/* Sign Up Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>One account for both donating and requesting blood</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* 1. Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <User className="h-5 w-5 text-emergency-600" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      maxLength={11}
                      className="pl-10"
                      disabled={otpSent}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Blood & Health Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <Heart className="h-5 w-5 text-emergency-600" />
                Blood & Health
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group *</Label>
                  <Select 
                    value={formData.bloodGroup} 
                    onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g. 65"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Donor Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-trust-50 rounded-lg border border-trust-200">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold text-trust-900">Available to Donate?</Label>
                  <p className="text-sm text-trust-700">Turn this on to appear in donor searches</p>
                </div>
                <Switch
                  checked={formData.isDonor}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isDonor: checked })}
                />
              </div>

              {formData.isDonor && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="lastDonation">Last Donation Date (Optional)</Label>
                  <Input
                    id="lastDonation"
                    type="date"
                    value={formData.lastDonation}
                    onChange={(e) => setFormData({ ...formData, lastDonation: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Leave empty if you haven't donated recently</p>
                </div>
              )}
            </div>

            {/* 3. Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <MapPin className="h-5 w-5 text-emergency-600" />
                Address
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="division">Division *</Label>
                  <Select 
                    value={formData.division} 
                    onValueChange={handleDivisionChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent>
                      {bangladeshLocations.divisions.map((div) => (
                        <SelectItem key={div} value={div}>{div}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Select 
                    value={formData.district} 
                    onValueChange={handleDistrictChange}
                    disabled={!formData.division}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((dist) => (
                        <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thana">Thana *</Label>
                  <Select 
                    value={formData.thana} 
                    onValueChange={(value) => setFormData({ ...formData, thana: value })}
                    disabled={!formData.district}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Thana" />
                    </SelectTrigger>
                    <SelectContent>
                      {thanas.map((thana) => (
                        <SelectItem key={thana} value={thana}>{thana}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 justify-center pt-4">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked: boolean) => setAgreedToTerms(checked)}
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-emergency-600 hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-emergency-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <Button 
              onClick={handleSignUp} 
              className="w-full bg-gradient-to-r from-emergency-600 to-trust-600 hover:from-emergency-700 hover:to-trust-700 text-lg py-6"
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Sign In Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/auth/signin" className="text-emergency-600 hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

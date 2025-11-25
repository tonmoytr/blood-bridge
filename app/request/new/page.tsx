"use client";

import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    bangladeshLocations,
    bloodGroups,
    getDistrictsByDivision,
    getThanasByDistrict
} from "@/lib/locations";
import { AlertCircle, ArrowLeft, Droplet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    unitsNeeded: "1",
    urgency: "HIGH",
    hospitalName: "",
    division: "",
    district: "",
    thana: "",
    contactPhone: "",
    alternatePhone: "",
    neededBy: "",
    additionalInfo: "",
    hasPrescription: false
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [thanas, setThanas] = useState<string[]>([]);

  const handleDivisionChange = (division: string) => {
    setFormData({ ...formData, division, district: "", thana: "" });
    setDistricts(getDistrictsByDivision(division));
    setThanas([]);
  };

  const handleDistrictChange = (district: string) => {
    setFormData({ ...formData, district, thana: "" });
    setThanas(getThanasByDistrict(district));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - will connect to API later
    console.log("Request submitted:", formData);
    alert("Emergency request posted successfully! (Mock)");
    router.push("/seeker");
  };

  return (
    <SidebarLayout userType="seeker">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Post Emergency Request</h1>
              <p className="text-gray-600 mt-1">Fill in the details to find donors quickly</p>
            </div>
          </div>

          {/* Emergency Alert */}
          <Alert className="border-emergency-200 bg-emergency-50">
            <AlertCircle className="h-4 w-4 text-emergency-600" />
            <AlertDescription className="text-emergency-900">
              <strong>Emergency Protocol:</strong> Your request will be visible to all eligible donors in your area immediately.
            </AlertDescription>
          </Alert>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Provide accurate details for faster matching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Patient Name */}
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Enter patient's full name"
                  />
                </div>

                {/* Blood Group & Units */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group *</Label>
                    <Select required value={formData.bloodGroup} onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            <div className="flex items-center gap-2">
                              <Droplet className="h-4 w-4 text-emergency-600" fill="currentColor" />
                              {bg}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unitsNeeded">Units Needed *</Label>
                    <Input
                      id="unitsNeeded"
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={formData.unitsNeeded}
                      onChange={(e) => setFormData({ ...formData, unitsNeeded: e.target.value })}
                    />
                  </div>
                </div>

                {/* Urgency & Needed By */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level *</Label>
                    <Select required value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRITICAL">🔴 Critical (Immediate - Within 3 hours)</SelectItem>
                        <SelectItem value="URGENT_6H">🟠 Urgent (Within 6 hours)</SelectItem>
                        <SelectItem value="URGENT_12H">🟡 Urgent (Within 12 hours)</SelectItem>
                        <SelectItem value="HIGH">🟢 High (Within 24 hours)</SelectItem>
                        <SelectItem value="NORMAL">⚪ Normal (Within 2-3 days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neededBy">Needed By *</Label>
                    <Input
                      id="neededBy"
                      type="datetime-local"
                      required
                      value={formData.neededBy}
                      onChange={(e) => setFormData({ ...formData, neededBy: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Hospital Location</h3>
                  
                  {/* Hospital Name */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="hospitalName">Hospital Name *</Label>
                    <Input
                      id="hospitalName"
                      required
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      placeholder="e.g., Dhaka Medical College Hospital"
                    />
                  </div>

                  {/* Division → District → Thana */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="division">Division *</Label>
                      <Select required value={formData.division} onValueChange={handleDivisionChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select division" />
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
                        required 
                        value={formData.district} 
                        onValueChange={handleDistrictChange}
                        disabled={!formData.division}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
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
                        required 
                        value={formData.thana} 
                        onValueChange={(value) => setFormData({ ...formData, thana: value })}
                        disabled={!formData.district}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select thana" />
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

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone *</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        required
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="01XXXXXXXXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alternatePhone">Alternate Phone (Optional)</Label>
                      <Input
                        id="alternatePhone"
                        type="tel"
                        value={formData.alternatePhone}
                        onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    placeholder="Any additional details that might help donors..."
                    rows={4}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-emergency-600 hover:bg-emergency-700 font-bold">
                    <Droplet className="mr-2 h-4 w-4" fill="currentColor" />
                    Post Emergency Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
}

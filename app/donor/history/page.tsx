"use client";

import { BloodGroupBadge } from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Building2, Calendar, CheckCircle2, Heart } from "lucide-react";

// Mock donation history
const mockHistory = [
  {
    id: "DON012",
    date: new Date("2024-10-20"),
    patientName: "Ahmed Hassan",
    hospital: "Dhaka Medical College Hospital",
    location: "Shahbag, Dhaka",
    bloodGroup: "O+" as const,
    units: 2,
    status: "completed" as const,
  },
  {
    id: "DON011",
    date: new Date("2024-07-15"),
    patientName: "Fatima Begum",
    hospital: "Square Hospital",
    location: "Panthapath, Dhaka",
    bloodGroup: "O+" as const,
    units: 1,
    status: "completed" as const,
  },
  {
    id: "DON010",
    date: new Date("2024-04-10"),
    patientName: "Rahim Khan",
    hospital: "United Hospital",
    location: "Gulshan, Dhaka",
    bloodGroup: "O+" as const,
    units: 2,
    status: "completed" as const,
  },
  {
    id: "DON009",
    date: new Date("2024-01-20"),
    patientName: "Salma Khatun",
    hospital: "Apollo Hospital",
    location: "Bashundhara, Dhaka",
    bloodGroup: "O+" as const,
    units: 1,
    status: "completed" as const,
  },
];

export default function DonorHistoryPage() {
  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
            <p className="text-gray-600 mt-1">Your complete record of life-saving donations</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 border-emergency-200 bg-emergency-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-emergency-600 flex items-center justify-center">
                    <Heart className="h-7 w-7 text-white" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-emergency-900">{mockHistory.length}</p>
                    <p className="text-sm text-emergency-700">Total Donations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-trust-100 flex items-center justify-center">
                    <Heart className="h-7 w-7 text-trust-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{mockHistory.reduce((sum, d) => sum + d.units, 0)}</p>
                    <p className="text-sm text-gray-600">Total Units</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-success-100 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-success-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{mockHistory.length * 3}</p>
                    <p className="text-sm text-gray-600">Lives Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History List */}
          <Card>
            <CardHeader>
              <CardTitle>Donation Records</CardTitle>
              <CardDescription>Chronological list of all your donations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockHistory.map((donation, index) => (
                  <div key={donation.id}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-trust-100 flex items-center justify-center">
                        <Heart className="h-7 w-7 text-trust-600" fill="currentColor" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{donation.patientName}</h3>
                            <p className="text-sm text-gray-600">Donation ID: {donation.id}</p>
                          </div>
                          <Badge className="bg-trust-600 text-white">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900">{donation.hospital}</p>
                              <p className="text-sm text-gray-600">{donation.location}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {donation.date.toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDistanceToNow(donation.date, { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <BloodGroupBadge bloodGroup={donation.bloodGroup} size="sm" />
                          <Badge variant="outline">{donation.units} unit{donation.units > 1 ? 's' : ''}</Badge>
                        </div>
                      </div>
                    </div>

                    {index < mockHistory.length - 1 && (
                      <div className="border-t mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}

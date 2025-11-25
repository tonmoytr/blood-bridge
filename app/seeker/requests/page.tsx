"use client";

import { BloodGroupBadge, TrustScoreBadge, UrgencyIndicator } from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Calendar, CheckCircle2, Clock, MapPin, Plus } from "lucide-react";
import Link from "next/link";

// Mock seeker requests
const mockSeekerRequests = [
  {
    id: "REQ001",
    patientName: "Ahmed Hassan",
    bloodGroup: "O-" as const,
    unitsNeeded: 2,
    urgency: "CRITICAL" as const,
    hospitalName: "Dhaka Medical College Hospital",
    location: "Shahbag, Dhaka",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    neededBy: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: "OPEN" as const,
    trustScore: "HIGH" as const,
    responsesCount: 5,
  },
  {
    id: "REQ002",
    patientName: "Fatima Begum",
    bloodGroup: "A+" as const,
    unitsNeeded: 1,
    urgency: "HIGH" as const,
    hospitalName: "Square Hospital",
    location: "Panthapath, Dhaka",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    neededBy: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "COMPLETED" as const,
    trustScore: "HIGH" as const,
    responsesCount: 12,
  },
];

export default function SeekerRequestsPage() {
  const openRequests = mockSeekerRequests.filter(r => r.status === "OPEN");
  const completedRequests = mockSeekerRequests.filter(r => r.status === "COMPLETED");

  return (
    <SidebarLayout userType="seeker">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
              <p className="text-gray-600 mt-1">Manage your blood requests</p>
            </div>
            <Button asChild className="bg-emergency-600 hover:bg-emergency-700">
              <Link href="/request/new">
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emergency-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-emergency-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{openRequests.length}</p>
                    <p className="text-sm text-gray-600">Active Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-trust-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-trust-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{completedRequests.length}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{mockSeekerRequests.length}</p>
                    <p className="text-sm text-gray-600">Total Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Requests */}
          {openRequests.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Requests</h2>
              <div className="space-y-4">
                {openRequests.map((request) => (
                  <Card key={request.id} className="border-2 border-emergency-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{request.patientName}</CardTitle>
                          <CardDescription>Request ID: {request.id}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <UrgencyIndicator level={request.urgency} />
                          <TrustScoreBadge level={request.trustScore} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
                          <span className="text-gray-600">{request.unitsNeeded} unit(s) needed</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">{request.hospitalName}</p>
                            <p className="text-sm text-gray-600">{request.location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Posted {formatDistanceToNow(request.createdAt, { addSuffix: true })}</span>
                          <span>•</span>
                          <span>{request.responsesCount} responses</span>
                        </div>
                        <Button asChild variant="outline">
                          <Link href={`/request/${request.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Requests */}
          {completedRequests.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Requests</h2>
              <div className="space-y-4">
                {completedRequests.map((request) => (
                  <Card key={request.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{request.patientName}</CardTitle>
                          <CardDescription>Request ID: {request.id}</CardDescription>
                        </div>
                        <Badge className="bg-trust-600 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
                          <span className="text-gray-600">{request.unitsNeeded} unit(s)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">{request.hospitalName}</p>
                            <p className="text-sm text-gray-600">{request.location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Completed {formatDistanceToNow(request.createdAt, { addSuffix: true })}</span>
                          <span>•</span>
                          <span>{request.responsesCount} responses</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

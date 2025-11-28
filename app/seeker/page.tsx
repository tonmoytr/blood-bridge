"use client";

import {
    BloodGroupBadge,
    UrgencyIndicator
} from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IRequest } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import {
    Clock,
    Droplet,
    FileText,
    Loader2,
    MapPin,
    Plus,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SeekerDashboard() {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // TODO: Replace with real seeker ID from auth
        const response = await fetch("/api/requests?seekerId=temp-seeker-id&sortBy=createdAt&sortOrder=desc");
        
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();
        setRequests(data.requests || []);
      } catch (error: any) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Calculate stats
  const activeRequests = requests.filter(r => r.status === "OPEN" || r.status === "ACCEPTED");
  const totalRequests = requests.length;
  const fulfilledRequests = requests.filter(r => r.status === "COMPLETED").length;
  const responseRate = requests.length > 0 
    ? Math.round((requests.filter(r => r.acceptedDonorId).length / requests.length) * 100) 
    : 0;

  if (loading) {
    return (
      <SidebarLayout userType="seeker">
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emergency-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout userType="seeker">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blood Requests</h1>
              <p className="text-gray-600 mt-1">Manage your emergency requests</p>
            </div>
            <Link href="/request/new">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emergency-600 to-emergency-700 hover:from-emergency-700 hover:to-emergency-800 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse"
              >
                <Droplet className="mr-2 h-5 w-5 animate-bounce" fill="currentColor" />
                🆘 Post Emergency Request
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-2 border-emergency-200 bg-emergency-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emergency-700 font-medium">Active Requests</p>
                    <p className="text-4xl font-bold text-emergency-600 mt-2">{activeRequests.length}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-emergency-600 flex items-center justify-center">
                    <Droplet className="h-7 w-7 text-white" fill="currentColor" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{totalRequests}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Fulfilled</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{fulfilledRequests}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-trust-100 flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-trust-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Response Rate</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{responseRate}%</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Requests</CardTitle>
                  <CardDescription>Recent blood requests you've posted</CardDescription>
                </div>
                <Link href="/seeker/requests">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {activeRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No active requests</h3>
                  <p className="text-gray-600 mb-4">Post your first emergency blood request</p>
                  <Link href="/request/new">
                    <Button className="bg-emergency-600 hover:bg-emergency-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Post Request
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRequests.slice(0, 3).map((request) => (
                    <RequestCard key={request._id} request={request} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}

function RequestCard({ request }: { request: IRequest }) {
  const responseCount = request.acceptedDonorId ? 1 : 0;

  return (
    <Link href={`/seeker/requests/${request._id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3">
              <div className="flex items-center gap-3 mb-3">
                <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
                <UrgencyIndicator level={request.urgency} />
                {request.status === "ACCEPTED" && (
                  <Badge className="bg-trust-600">Accepted</Badge>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{request.patientName}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {request.location?.thana}, {request.location?.district}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="col-span-2 text-right flex flex-col justify-center">
              <p className="text-3xl font-bold text-emergency-600">{request.unitsNeeded}</p>
              <p className="text-sm text-gray-600">units needed</p>
              <p className="text-sm text-gray-500 mt-2">{responseCount} response{responseCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

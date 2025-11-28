"use client";

import {
    BloodGroupBadge,
    UrgencyIndicator
} from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IRequest } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import {
    AlertCircle,
    Building2,
    Clock,
    Droplet,
    Loader2,
    MapPin,
    Search
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DonorRequestsPage() {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/requests?status=OPEN&sortBy=urgency&sortOrder=desc");
        
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

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = bloodGroupFilter === "all" || request.bloodGroup === bloodGroupFilter;
    const matchesUrgency = urgencyFilter === "all" || request.urgency === urgencyFilter;
    
    return matchesSearch && matchesBloodGroup && matchesUrgency;
  });

  // Calculate stats
  const criticalCount = requests.filter(r => r.urgency === "CRITICAL").length;
  const highPriorityCount = requests.filter(r => r.urgency === "HIGH" || r.urgency === "URGENT_6H" || r.urgency === "URGENT_12H").length;

  if (loading) {
    return (
      <SidebarLayout userType="donor">
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emergency-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading requests...</p>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Blood Requests</h1>
            <p className="text-gray-600 mt-1">Find people who need your help</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 border-emergency-200 bg-emergency-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-10 w-10 text-emergency-600" />
                  <div>
                    <p className="text-3xl font-bold text-emergency-900">{criticalCount}</p>
                    <p className="text-sm text-emergency-700">Critical</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-10 w-10 text-warning-600" />
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{highPriorityCount}</p>
                    <p className="text-sm text-gray-600">High Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Droplet className="h-10 w-10 text-trust-600" fill="currentColor" />
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
                    <p className="text-sm text-gray-600">Total Open</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by patient or hospital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blood Groups</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgencies</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="URGENT_6H">Urgent (6H)</SelectItem>
                    <SelectItem value="URGENT_12H">Urgent (12H)</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Link key={request._id} href={`/request/${request._id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-3">
                          <div className="flex items-center gap-3 mb-3">
                            <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
                            <UrgencyIndicator level={request.urgency} />
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{request.patientName}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              {request.hospitalName}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {request.location?.thana}, {request.location?.district}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Posted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 text-right flex flex-col justify-center">
                          <p className="text-4xl font-bold text-emergency-600">{request.unitsNeeded}</p>
                          <p className="text-sm text-gray-600">units needed</p>
                          <Badge className="mt-3 bg-emergency-600">View Details</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

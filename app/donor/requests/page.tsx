"use client";

import {
    BloodGroupBadge,
    TrustScoreBadge,
    UrgencyIndicator
} from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bloodGroups } from "@/lib/locations";
import { mockRequests } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import {
    Clock,
    Droplet,
    FileText,
    MapPin,
    Search,
    SlidersHorizontal
} from "lucide-react";
import Link from "next/link";

export default function DonorRequestFeed() {
  // Mock data - will be filtered based on donor's blood group and location
  const requests = mockRequests.filter(r => r.status === "OPEN");

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Blood Requests</h1>
            <p className="text-gray-600 mt-1">Help save lives by responding to urgent requests</p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by hospital, location..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Blood Group Filter */}
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blood Groups</SelectItem>
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

                {/* Urgency Filter */}
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency</SelectItem>
                    <SelectItem value="CRITICAL">🔴 Critical (3h)</SelectItem>
                    <SelectItem value="URGENT_6H">🟠 Urgent (6h)</SelectItem>
                    <SelectItem value="URGENT_12H">🟡 Urgent (12h)</SelectItem>
                    <SelectItem value="HIGH">🟢 High (24h)</SelectItem>
                    <SelectItem value="NORMAL">⚪ Normal (2-3d)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 border-emergency-200 bg-emergency-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emergency-700 font-medium">Critical Requests</p>
                    <p className="text-3xl font-bold text-emergency-600 mt-1">
                      {requests.filter(r => r.urgency === "CRITICAL").length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emergency-600 flex items-center justify-center animate-pulse">
                    <Droplet className="h-6 w-6 text-white" fill="currentColor" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">High Priority</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {requests.filter(r => r.urgency === "HIGH").length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-cooldown-100 flex items-center justify-center">
                    <Droplet className="h-6 w-6 text-cooldown-600" fill="currentColor" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Open</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{requests.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Request Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {requests.length} Request{requests.length !== 1 ? 's' : ''} Found
              </h2>
              <Select defaultValue="urgency">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgency">Sort by Urgency</SelectItem>
                  <SelectItem value="distance">Sort by Distance</SelectItem>
                  <SelectItem value="time">Sort by Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {requests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Droplet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
                  <p className="text-gray-600">Try adjusting your filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {requests.map((request) => (
                  <Link key={request.id} href={`/request/${request.id}`}>
                    <RequestCard request={request} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

function RequestCard({ request }: { request: typeof mockRequests[0] }) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-2 hover:border-emergency-200 cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
              <div>
                <CardTitle className="text-xl">{request.patientName}</CardTitle>
                <CardDescription className="text-base">{request.unitsNeeded} unit(s) needed</CardDescription>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <UrgencyIndicator level={request.urgency} />
            <TrustScoreBadge level={request.trustScore} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">{request.hospitalName}</p>
              <p className="text-sm text-gray-600">{request.thana}, {request.district}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Needed by</p>
              <p className="text-sm text-gray-600">
                {formatDistanceToNow(request.neededBy, { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {request.hasPrescription && (
              <div className="flex items-center gap-1 text-trust-600 text-sm">
                <FileText className="h-4 w-4" />
                <span>Verified</span>
              </div>
            )}
          </div>
          <Button className="bg-emergency-600 hover:bg-emergency-700">
            Respond to Request
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

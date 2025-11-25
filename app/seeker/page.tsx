import {
    BloodGroupBadge,
    TrustScoreBadge,
    UrgencyIndicator
} from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockRequests } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import {
    Clock,
    Droplet,
    FileText,
    MapPin,
    Plus,
    TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function SeekerDashboard() {
  // Filter requests for current seeker (mock: showing all for demo)
  const myRequests = mockRequests.slice(0, 2);
  const openRequests = myRequests.filter(r => r.status === "OPEN");

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
                    <p className="text-4xl font-bold text-emergency-600 mt-2">{openRequests.length}</p>
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
                    <p className="text-4xl font-bold text-gray-900 mt-2">{myRequests.length}</p>
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
                    <p className="text-4xl font-bold text-trust-600 mt-2">0</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-trust-100 flex items-center justify-center">
                    <Droplet className="h-7 w-7 text-trust-600" fill="currentColor" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Response Rate</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">85%</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-cooldown-100 flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-cooldown-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Requests</h2>
              <Button variant="outline">View All</Button>
            </div>
            
            {myRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Droplet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
                  <p className="text-gray-600 mb-6">Create your first emergency blood request</p>
                  <Button className="bg-emergency-600 hover:bg-emergency-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Post Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
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
    <Card className="hover:shadow-lg transition-shadow border-2 hover:border-emergency-200">
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
        <div className="grid md:grid-cols-2 gap-4">
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
            <Badge variant={request.status === "OPEN" ? "default" : "secondary"} className="text-sm px-3 py-1">
              {request.status}
            </Badge>
            {request.hasPrescription && (
              <Badge variant="outline" className="text-trust-600 border-trust-600 text-sm px-3 py-1">
                <FileText className="h-3 w-3 mr-1" />
                Prescription
              </Badge>
            )}
          </div>
          <Button variant="outline" size="lg">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}

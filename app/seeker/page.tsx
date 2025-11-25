import {
    BloodGroupBadge,
    TrustScoreBadge,
    UrgencyIndicator
} from "@/components/features";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockRequests } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import {
    Bell,
    Clock,
    Droplet,
    FileText,
    MapPin,
    Plus,
    Settings
} from "lucide-react";
import Link from "next/link";

export default function SeekerDashboard() {
  // Filter requests for current seeker (mock: showing all for demo)
  const myRequests = mockRequests.slice(0, 2);
  const openRequests = myRequests.filter(r => r.status === "OPEN");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Droplet className="h-8 w-8 text-emergency-600" fill="currentColor" />
              <span className="text-2xl font-bold text-gray-900">BloodBridge</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blood Requests</h1>
              <p className="text-gray-600 mt-1">Manage your emergency requests</p>
            </div>
            <Link href="/request/new">
              <Button size="lg" className="bg-emergency-600 hover:bg-emergency-700 font-bold">
                <Plus className="mr-2 h-5 w-5" />
                Post Emergency Request
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Requests</p>
                    <p className="text-3xl font-bold text-emergency-600">{openRequests.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emergency-100 flex items-center justify-center">
                    <Droplet className="h-6 w-6 text-emergency-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-3xl font-bold text-gray-900">{myRequests.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Fulfilled</p>
                    <p className="text-3xl font-bold text-trust-600">0</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-trust-100 flex items-center justify-center">
                    <Droplet className="h-6 w-6 text-trust-600" fill="currentColor" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Requests */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Requests</h2>
            {myRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Droplet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
                  <p className="text-gray-600 mb-6">Create your first emergency blood request</p>
                  <Link href="/request/new">
                    <Button className="bg-emergency-600 hover:bg-emergency-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Post Request
                    </Button>
                  </Link>
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
    </div>
  );
}

function RequestCard({ request }: { request: typeof mockRequests[0] }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
              <div>
                <CardTitle className="text-xl">{request.patientName}</CardTitle>
                <CardDescription>{request.unitsNeeded} unit(s) needed</CardDescription>
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
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">{request.hospitalName}</p>
              <p className="text-sm text-gray-600">{request.thana}, {request.district}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Needed by</p>
              <p className="text-sm text-gray-600">
                {formatDistanceToNow(request.neededBy, { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge variant={request.status === "OPEN" ? "default" : "secondary"}>
              {request.status}
            </Badge>
            {request.hasPrescription && (
              <Badge variant="outline" className="text-trust-600 border-trust-600">
                <FileText className="h-3 w-3 mr-1" />
                Prescription
              </Badge>
            )}
          </div>
          <Button variant="outline">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}

import {
    BloodGroupBadge,
    CooldownProgress,
    StatusBadge,
    TrustScoreBadge,
    UrgencyIndicator
} from "@/components/features";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ComponentsShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">BloodBridge Components</h1>
          <p className="text-gray-600">Emergency-focused UI component library</p>
        </div>

        {/* Blood Group Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Group Badges</CardTitle>
            <CardDescription>
              Negative blood groups (rare) get darker red for priority visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Small Size</p>
              <div className="flex flex-wrap gap-2">
                <BloodGroupBadge bloodGroup="A+" size="sm" />
                <BloodGroupBadge bloodGroup="A-" size="sm" />
                <BloodGroupBadge bloodGroup="B+" size="sm" />
                <BloodGroupBadge bloodGroup="B-" size="sm" />
                <BloodGroupBadge bloodGroup="O+" size="sm" />
                <BloodGroupBadge bloodGroup="O-" size="sm" />
                <BloodGroupBadge bloodGroup="AB+" size="sm" />
                <BloodGroupBadge bloodGroup="AB-" size="sm" />
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Medium Size (Default)</p>
              <div className="flex flex-wrap gap-2">
                <BloodGroupBadge bloodGroup="A+" />
                <BloodGroupBadge bloodGroup="A-" />
                <BloodGroupBadge bloodGroup="B+" />
                <BloodGroupBadge bloodGroup="B-" />
                <BloodGroupBadge bloodGroup="O+" />
                <BloodGroupBadge bloodGroup="O-" />
                <BloodGroupBadge bloodGroup="AB+" />
                <BloodGroupBadge bloodGroup="AB-" />
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Large Size</p>
              <div className="flex flex-wrap gap-2">
                <BloodGroupBadge bloodGroup="O-" size="lg" />
                <BloodGroupBadge bloodGroup="AB-" size="lg" />
                <BloodGroupBadge bloodGroup="A+" size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Donor Status Badges</CardTitle>
            <CardDescription>
              Visual indicators for donor availability status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <StatusBadge status="ACTIVE" />
              <StatusBadge status="COOLDOWN" />
              <StatusBadge status="SNOOZED" />
              <StatusBadge status="BANNED" />
            </div>
          </CardContent>
        </Card>

        {/* Urgency Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Urgency Indicators</CardTitle>
            <CardDescription>
              Request urgency levels with animated critical state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <UrgencyIndicator level="CRITICAL" />
              <UrgencyIndicator level="HIGH" />
              <UrgencyIndicator level="NORMAL" />
            </div>
          </CardContent>
        </Card>

        {/* Trust Score Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Trust Score Badges</CardTitle>
            <CardDescription>
              Anti-dalal system: request verification levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <TrustScoreBadge level="HIGH" />
              <TrustScoreBadge level="MEDIUM" />
              <TrustScoreBadge level="LOW" />
            </div>
          </CardContent>
        </Card>

        {/* Cooldown Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Cooldown Progress</CardTitle>
            <CardDescription>
              Visual feedback for donor cooldown period (90/120 days)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">Early Stage (60 days remaining)</p>
              <CooldownProgress daysRemaining={60} totalDays={90} />
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-3">Mid Stage (30 days remaining)</p>
              <CooldownProgress daysRemaining={30} totalDays={90} />
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-3">Almost Ready (5 days remaining)</p>
              <CooldownProgress daysRemaining={5} totalDays={90} />
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 pt-4">
          <p>Next.js 16.0.3 | React 19 | Tailwind CSS 4.0 | shadcn/ui 3.5.0</p>
        </div>
      </div>
    </div>
  );
}

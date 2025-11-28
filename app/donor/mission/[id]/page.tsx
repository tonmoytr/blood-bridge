"use client";

import { BloodGroupBadge, UrgencyIndicator } from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { IRequest } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Heart,
    Loader2,
    Navigation,
    Phone,
    User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Mission steps
const MISSION_STEPS = [
  { id: "accepted", label: "Accepted", icon: CheckCircle2 },
  { id: "leaving", label: "On the Way", icon: Navigation },
  { id: "arrived", label: "At Hospital", icon: Building2 },
  { id: "completed", label: "Completed", icon: Heart },
] as const;

type MissionStep = typeof MISSION_STEPS[number]["id"];

export default function MissionModePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [request, setRequest] = useState<IRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<MissionStep>("accepted");

  useEffect(() => {
    params.then((p) => setRequestId(p.id));
  }, [params]);

  useEffect(() => {
    if (!requestId) return;

    const fetchMission = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/requests/${requestId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch mission details");
        }

        const data = await response.json();
        setRequest(data.request);
        
        // Set current step based on status
        if (data.request.status === "COMPLETED") {
          setCurrentStep("completed");
        } else if (data.request.status === "ACCEPTED") {
          setCurrentStep("accepted");
        }
      } catch (error: any) {
        console.error("Error fetching mission:", error);
        toast.error("Failed to load mission details");
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [requestId]);

  if (loading) {
    return (
      <SidebarLayout userType="donor">
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emergency-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading mission...</p>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!request) {
    return (
      <SidebarLayout userType="donor">
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Mission not found</p>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const currentStepIndex = MISSION_STEPS.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / MISSION_STEPS.length) * 100;

  const handleNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < MISSION_STEPS.length) {
      setCurrentStep(MISSION_STEPS[nextIndex].id);
    }
  };

  const isStepCompleted = (stepId: MissionStep) => {
    const stepIndex = MISSION_STEPS.findIndex(step => step.id === stepId);
    return stepIndex <= currentStepIndex;
  };

  const isStepCurrent = (stepId: MissionStep) => stepId === currentStep;

  const seeker = typeof request.seekerId === 'object' ? request.seekerId : null;

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Mission Mode</h1>
              <p className="text-gray-600 mt-1">Track your donation journey</p>
            </div>
            <Badge className="bg-emergency-600 text-white">
              {request.status === "COMPLETED" ? "Completed" : "Active Mission"}
            </Badge>
          </div>

          {/* Progress Overview */}
          <Card className="border-2 border-emergency-200 bg-gradient-to-br from-emergency-50 to-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-emergency-900">
                    Saving a Life in Progress
                  </CardTitle>
                  <CardDescription className="text-emergency-700">
                    {MISSION_STEPS[currentStepIndex].label} • {Math.round(progress)}% Complete
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Mission Stepper */}
          <Card>
            <CardHeader>
              <CardTitle>Mission Progress</CardTitle>
              <CardDescription>Track each step of your donation journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {MISSION_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const completed = isStepCompleted(step.id);
                  const current = isStepCurrent(step.id);
                  const isLast = index === MISSION_STEPS.length - 1;

                  return (
                    <div key={step.id} className="relative">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          completed 
                            ? "bg-emergency-600 border-emergency-600 text-white" 
                            : current
                            ? "bg-white border-emergency-600 text-emergency-600 animate-pulse"
                            : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className={`font-semibold text-lg ${
                                completed || current ? "text-gray-900" : "text-gray-500"
                              }`}>
                                {step.label}
                              </h3>
                              {current && (
                                <p className="text-sm text-emergency-600 font-medium mt-1">
                                  Current Step
                                </p>
                              )}
                              {completed && !current && (
                                <p className="text-sm text-gray-500 mt-1">
                                  ✓ Completed
                                </p>
                              )}
                            </div>
                            {current && currentStepIndex < MISSION_STEPS.length - 1 && (
                              <Button 
                                onClick={handleNextStep}
                                className="bg-emergency-600 hover:bg-emergency-700"
                              >
                                Mark as Complete
                              </Button>
                            )}
                            {current && currentStepIndex === MISSION_STEPS.length - 1 && (
                              <Button 
                                onClick={() => router.push("/donor")}
                                className="bg-trust-600 hover:bg-trust-700"
                              >
                                <Heart className="mr-2 h-4 w-4" />
                                Finish Mission
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Connector Line */}
                      {!isLast && (
                        <div className={`absolute left-6 top-12 w-0.5 h-6 -ml-px ${
                          completed ? "bg-emergency-600" : "bg-gray-300"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Patient & Hospital Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-semibold">{request.patientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Blood Group Needed</p>
                    <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Units Required</p>
                    <p className="text-2xl font-bold text-emergency-600">{request.unitsNeeded}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Urgency</p>
                    <UrgencyIndicator level={request.urgency} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hospital Info */}
            <Card>
              <CardHeader>
                <CardTitle>Hospital Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Hospital</p>
                    <p className="font-semibold">{request.hospitalName}</p>
                    <p className="text-sm text-gray-500">{request.location?.thana}, {request.location?.district}</p>
                  </div>
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  <Navigation className="mr-2 h-4 w-4" />
                  Open in Maps
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          {seeker && (
            <Card className="border-2 border-trust-200 bg-trust-50">
              <CardHeader>
                <CardTitle className="text-trust-900">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-trust-600" />
                  <div>
                    <p className="text-sm text-trust-700">Contact Person</p>
                    <p className="font-semibold text-trust-900">{seeker.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-trust-600" />
                  <div className="flex-1">
                    <p className="text-sm text-trust-700">Phone Number</p>
                    <p className="font-mono font-semibold text-trust-900">{seeker.phone}</p>
                  </div>
                  <Button size="sm" className="bg-trust-600 hover:bg-trust-700">
                    <Phone className="mr-2 h-3 w-3" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mission Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Mission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Request ID</p>
                  <p className="font-mono font-semibold text-sm">{request._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accepted</p>
                  <p className="font-semibold">
                    {request.acceptedAt ? formatDistanceToNow(new Date(request.acceptedAt), { addSuffix: true }) : 'Recently'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className="bg-emergency-600 text-white">{request.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}

"use client";

import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Droplet,
    Heart,
    Hospital,
    Navigation,
    Phone,
    User
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Request {
  _id: string;
  patientName: string;
  patientAge: number;
  bloodGroup: string;
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  urgency: string;
  neededBy: string;
  contactPhone: string;
  alternatePhone?: string;
  status: string;
  missionStatus?: string;
  missionTimestamps?: {
    accepted?: string;
    onTheWay?: string;
    atHospital?: string;
    donating?: string;
    completed?: string;
  };
  seekerName: string;
}

const MISSION_STAGES = [
  { id: "ACCEPTED", label: "Accepted", icon: CheckCircle2, color: "text-green-600" },
  { id: "ON_THE_WAY", label: "On the Way", icon: Navigation, color: "text-blue-600" },
  { id: "AT_HOSPITAL", label: "At Hospital", icon: Hospital, color: "text-purple-600" },
  { id: "DONATING", label: "Donating", icon: Heart, color: "text-red-600" },
  { id: "COMPLETED", label: "Completed", icon: Check, color: "text-emerald-600" },
];

export default function MissionControlPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;

  useEffect(() => {
    params.then((p) => setRequestId(p.id));
  }, [params]);

  // Fetch request details
  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) return;
      
      try {
        const response = await fetch(`/api/requests/${requestId}`);
        if (response.ok) {
          const data = await response.json();
          setRequest(data.request);
        } else {
          toast.error("Failed to load mission details");
          router.push("/donor/missions");
        }
      } catch (error) {
        console.error("Error fetching request:", error);
        toast.error("Failed to load mission details");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, router]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!userId || !request) return;

    // Show confirmation dialog for completion
    if (newStatus === "COMPLETED") {
      setShowCompleteDialog(true);
      return;
    }

    await updateMissionStatus(newStatus);
  };

  const updateMissionStatus = async (newStatus: string) => {
    if (!requestId) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/requests/${requestId}/mission`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId: userId,
          missionStatus: newStatus,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRequest(data.request);
        toast.success(`Status updated to ${MISSION_STAGES.find(s => s.id === newStatus)?.label}`);
        
        // If completed, redirect after a delay
        if (newStatus === "COMPLETED") {
          setTimeout(() => {
            router.push("/donor");
          }, 2000);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating mission status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
      setShowCompleteDialog(false);
    }
  };

  const getCurrentStageIndex = () => {
    if (!request?.missionStatus) return 0;
    return MISSION_STAGES.findIndex(s => s.id === request.missionStatus);
  };

  const getStageTimestamp = (stageId: string) => {
    if (!request?.missionTimestamps) return null;
    
    const key = stageId === "ACCEPTED" ? "accepted" :
                stageId === "ON_THE_WAY" ? "onTheWay" :
                stageId === "AT_HOSPITAL" ? "atHospital" :
                stageId === "DONATING" ? "donating" :
                stageId === "COMPLETED" ? "completed" : null;
    
    return key ? request.missionTimestamps[key as keyof typeof request.missionTimestamps] : null;
  };

  if (loading) {
    return (
      <SidebarLayout userType="donor">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading mission details...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!request) {
    return null;
  }

  const currentStageIndex = getCurrentStageIndex();
  const isCompleted = request.missionStatus === "COMPLETED";

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/donor/missions">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Missions
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Mission Control</h1>
            <p className="text-gray-600 mt-1">Track your donation journey</p>
          </div>

          {/* Patient Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-red-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patient Name</p>
                  <p className="font-semibold">{request.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold">{request.patientAge} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Group</p>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-red-600" fill="currentColor" />
                    <span className="font-semibold text-red-600">{request.bloodGroup}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Units Needed</p>
                  <p className="font-semibold">{request.unitsNeeded} bag(s)</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600 mb-2">Hospital</p>
                <div className="flex items-start gap-2">
                  <Hospital className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">{request.hospitalName}</p>
                    <p className="text-sm text-gray-600">{request.hospitalAddress}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Contact</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <a href={`tel:${request.contactPhone}`} className="text-blue-600 hover:underline">
                      {request.contactPhone}
                    </a>
                  </div>
                  {request.alternatePhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <a href={`tel:${request.alternatePhone}`} className="text-blue-600 hover:underline">
                        {request.alternatePhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Progress */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Mission Progress</CardTitle>
              <CardDescription>Update your status as you progress</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress Stepper */}
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-red-600 transition-all duration-500"
                    style={{ width: `${(currentStageIndex / (MISSION_STAGES.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Stages */}
                <div className="relative flex justify-between">
                  {MISSION_STAGES.map((stage, index) => {
                    const Icon = stage.icon;
                    const isCompleted = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const timestamp = getStageTimestamp(stage.id);

                    return (
                      <div key={stage.id} className="flex flex-col items-center" style={{ width: '20%' }}>
                        {/* Icon Circle */}
                        <div
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                            ${isCompleted ? 'bg-green-600 border-green-600' : ''}
                            ${isCurrent ? 'bg-white border-blue-600 shadow-lg animate-pulse' : ''}
                            ${!isCompleted && !isCurrent ? 'bg-white border-gray-300' : ''}
                          `}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              isCompleted ? 'text-white' :
                              isCurrent ? 'text-blue-600' :
                              'text-gray-400'
                            }`}
                          />
                        </div>

                        {/* Label */}
                        <p className={`mt-2 text-xs font-medium text-center ${
                          isCurrent ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {stage.label}
                        </p>

                        {/* Timestamp */}
                        {timestamp && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              {!isCompleted && (
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  {MISSION_STAGES.map((stage, index) => {
                    const isNext = index === currentStageIndex + 1;
                    if (!isNext) return null;

                    return (
                      <Button
                        key={stage.id}
                        onClick={() => handleUpdateStatus(stage.id)}
                        disabled={updating}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        {updating ? "Updating..." : `Mark as ${stage.label}`}
                      </Button>
                    );
                  })}
                </div>
              )}

              {isCompleted && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Mission Completed!</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Thank you for saving a life! You're now in cooldown for 90 days.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Completion Confirmation Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Complete Mission?</DialogTitle>
            <DialogDescription className="text-gray-600">
              Marking this mission as completed will:
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                <li>Record this as a successful donation</li>
                <li>Put you in cooldown for 90 days (3 months)</li>
                <li>Increment your total donations count</li>
              </ul>
              <p className="mt-3 font-semibold text-red-600">This action cannot be undone.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)} className="text-gray-700 border-gray-300">
              Cancel
            </Button>
            <Button
              onClick={() => updateMissionStatus("COMPLETED")}
              disabled={updating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {updating ? "Completing..." : "Yes, Complete Mission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}

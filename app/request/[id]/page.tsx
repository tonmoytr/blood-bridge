"use client";

import {
    BloodGroupBadge,
    TrustScoreBadge,
    UrgencyIndicator
} from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    MapPin,
    MessageSquare,
    Phone,
    Reply,
    Send,
    User,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Mock request data - will come from API later
const mockRequest = {
  id: "REQ001",
  patientName: "Ahmed Hassan",
  bloodGroup: "O-" as const,
  unitsNeeded: 2,
  urgency: "CRITICAL" as const,
  hospitalName: "Dhaka Medical College Hospital",
  division: "Dhaka",
  district: "Dhaka",
  thana: "Shahbag",
  contactPhone: "01712345678",
  alternatePhone: "01812345679",
  neededBy: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  additionalInfo: "Patient is in ICU. Urgent surgery scheduled. Please contact immediately if available.",
  hasPrescription: true,
  status: "OPEN" as const,
  trustScore: "HIGH" as const,
  seekerName: "Fatima Hassan",
  seekerPhone: "01712345678",
  relationship: "Sister"
};

// Mock chat messages
const mockMessages = [
  {
    id: "1",
    sender: "seeker",
    senderName: "Fatima Hassan",
    message: "Assalamu Alaikum. My brother needs O- blood urgently. Are you available?",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: "2",
    sender: "donor",
    senderName: "You",
    message: "Wa Alaikum Salam. Yes, I can help. What's the situation?",
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
  },
  {
    id: "3",
    sender: "seeker",
    senderName: "Fatima Hassan",
    message: "He's in ICU at DMCH. Surgery is scheduled in 2 hours. We need 2 units.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  },
];

export default function RequestDetailsPage() {
  const router = useRouter();
  const [hasAccepted, setHasAccepted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<typeof mockMessages[0] | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleAcceptRequest = () => {
    setHasAccepted(true);
    // In real app, this would call API to accept the request
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      sender: "donor" as const,
      senderName: "You",
      message: newMessage,
      timestamp: new Date(),
      replyTo: replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        message: replyingTo.message,
      } : undefined,
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    setReplyingTo(null);
  };

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMessage]);

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Request Details</h1>
              <p className="text-gray-600 mt-1">Request ID: {mockRequest.id}</p>
            </div>
            <Badge variant="outline" className="text-sm">
              {mockRequest.status}
            </Badge>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Request Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Patient Information</CardTitle>
                      <CardDescription>Emergency blood requirement details</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <UrgencyIndicator level={mockRequest.urgency} />
                      <TrustScoreBadge level={mockRequest.trustScore} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Blood Group & Units */}
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Blood Group Needed</p>
                      <BloodGroupBadge bloodGroup={mockRequest.bloodGroup} size="lg" />
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Units Required</p>
                      <p className="text-4xl font-bold text-emergency-600">{mockRequest.unitsNeeded}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Patient Name</p>
                        <p className="font-semibold text-gray-900">{mockRequest.patientName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Needed By</p>
                        <p className="font-semibold text-gray-900">
                          {formatDistanceToNow(mockRequest.neededBy, { addSuffix: true })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {mockRequest.neededBy.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Hospital</p>
                        <p className="font-semibold text-gray-900">{mockRequest.hospitalName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">
                          {mockRequest.thana}, {mockRequest.district}
                        </p>
                        <p className="text-xs text-gray-500">{mockRequest.division} Division</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Posted</p>
                        <p className="font-semibold text-gray-900">
                          {formatDistanceToNow(mockRequest.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {mockRequest.hasPrescription && (
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-trust-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Prescription</p>
                          <Badge variant="outline" className="text-trust-600 border-trust-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {mockRequest.additionalInfo && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Additional Information</p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-900">{mockRequest.additionalInfo}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Seeker Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Posted By</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{mockRequest.seekerName}</p>
                      <p className="text-sm text-gray-500">({mockRequest.relationship})</p>
                    </div>
                  </div>

                  {hasAccepted ? (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-trust-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Contact Numbers</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              {mockRequest.contactPhone}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                          </div>
                          {mockRequest.alternatePhone && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono">
                                {mockRequest.alternatePhone}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-cooldown-50 border border-cooldown-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-cooldown-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-cooldown-900">Phone numbers hidden</p>
                          <p className="text-sm text-cooldown-700 mt-1">
                            Accept this request to view contact information
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!hasAccepted ? (
                    <Button 
                      className="w-full bg-emergency-600 hover:bg-emergency-700 font-bold"
                      size="lg"
                      onClick={handleAcceptRequest}
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Accept Request
                    </Button>
                  ) : (
                    <div className="bg-trust-50 border border-trust-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-trust-700">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="font-semibold">Request Accepted!</p>
                      </div>
                      <p className="text-sm text-trust-600 mt-1">
                        Contact numbers are now visible
                      </p>
                    </div>
                  )}

                  {/* Chat Dialog */}
                  <Dialog open={chatOpen} onOpenChange={setChatOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" size="lg">
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Message Seeker
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] h-[650px] flex flex-col p-0 gap-0 bg-white overflow-hidden">
                      {/* Chat Header - Rounded top corners */}
                      <div className="px-6 py-4 border-b bg-gradient-to-r from-emergency-600 to-emergency-700 rounded-t-lg">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-emergency-600 font-bold text-lg">
                            {mockRequest.seekerName.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <DialogTitle className="text-white text-lg">{mockRequest.seekerName}</DialogTitle>
                            <DialogDescription className="text-emergency-100 text-sm">
                              Request #{mockRequest.id} • {mockRequest.relationship}
                            </DialogDescription>
                          </div>
                        </div>
                      </div>
                      
                      {/* Messages Area */}
                      <ScrollArea className="flex-1 px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          {messages.map((msg, index) => {
                            const isOwn = msg.sender === "donor";
                            const showAvatar = index === 0 || messages[index - 1].sender !== msg.sender;
                            
                            return (
                              <div
                                key={msg.id}
                                className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"} group`}
                              >
                                {/* Avatar */}
                                <div className={`flex-shrink-0 ${showAvatar ? "visible" : "invisible"}`}>
                                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                    isOwn ? "bg-emergency-600" : "bg-gray-600"
                                  }`}>
                                    {msg.senderName.split(' ').map((n: string) => n[0]).join('')}
                                  </div>
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex flex-col max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                                  {showAvatar && (
                                    <span className={`text-xs font-medium mb-1 px-1 ${
                                      isOwn ? "text-emergency-700" : "text-gray-700"
                                    }`}>
                                      {msg.senderName}
                                    </span>
                                  )}
                                  <div className="relative">
                                    <div
                                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                                        isOwn
                                          ? "bg-emergency-600 text-white rounded-tr-sm"
                                          : "bg-white text-gray-900 border border-gray-200 rounded-tl-sm"
                                      }`}
                                    >
                                      {/* Reply Preview */}
                                      {(msg as any).replyTo && (
                                        <div className={`mb-2 pb-2 border-l-2 pl-2 ${
                                          isOwn ? "border-emergency-300" : "border-gray-300"
                                        }`}>
                                          <p className={`text-xs font-semibold ${
                                            isOwn ? "text-emergency-100" : "text-gray-600"
                                          }`}>
                                            {(msg as any).replyTo.senderName}
                                          </p>
                                          <p className={`text-xs ${
                                            isOwn ? "text-emergency-100" : "text-gray-500"
                                          } line-clamp-2`}>
                                            {(msg as any).replyTo.message}
                                          </p>
                                        </div>
                                      )}
                                      <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                                      <div className={`flex items-center gap-1 mt-1 justify-end ${
                                        isOwn ? "text-emergency-100" : "text-gray-500"
                                      }`}>
                                        <span className="text-xs">
                                          {msg.timestamp.toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit',
                                            hour12: true 
                                          })}
                                        </span>
                                        {isOwn && (
                                          <CheckCircle2 className="h-3 w-3" />
                                        )}
                                      </div>
                                    </div>
                                    {/* Reply Button */}
                                    <button
                                      onClick={() => setReplyingTo(msg)}
                                      className={`absolute -bottom-6 ${isOwn ? "right-0" : "left-0"} opacity-0 group-hover:opacity-100 transition-opacity`}
                                    >
                                      <div className="bg-gray-200 hover:bg-gray-300 rounded-full p-1.5">
                                        <Reply className="h-3 w-3 text-gray-700" />
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>

                      {/* Input Area - Rounded bottom corners */}
                      <div className="px-4 py-4 border-t bg-white rounded-b-lg">
                        {/* Reply Preview */}
                        {replyingTo && (
                          <div className="mb-3 bg-gray-100 rounded-lg p-3 flex items-start gap-2">
                            <Reply className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-700">
                                Replying to {replyingTo.senderName}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {replyingTo.message}
                              </p>
                            </div>
                            <button
                              onClick={() => setReplyingTo(null)}
                              className="flex-shrink-0 text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        
                        <div className="flex gap-2 items-end">
                          <Textarea
                            ref={textareaRef}
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            className="flex-1 bg-gray-50 border-gray-300 focus:border-emergency-500 focus:ring-emergency-500 min-h-[44px] max-h-[120px] resize-none"
                            rows={1}
                          />
                          <Button 
                            onClick={handleSendMessage} 
                            className="bg-emergency-600 hover:bg-emergency-700 px-4 h-[44px]"
                            disabled={!newMessage.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Messages are encrypted end-to-end
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="border-2 border-emergency-200 bg-emergency-50">
                <CardHeader>
                  <CardTitle className="text-emergency-900">Emergency Protocol</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-emergency-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Verify patient details before donating</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Bring valid ID and donor card</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Contact hospital blood bank directly</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

"use client";

import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Search, Send } from "lucide-react";
import { useState } from "react";

// Mock conversations
const mockConversations = [
  {
    id: "1",
    requestId: "REQ001",
    seekerName: "Fatima Hassan",
    lastMessage: "Thank you so much! On my way to the hospital now.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    unread: 2,
  },
  {
    id: "2",
    requestId: "REQ002",
    seekerName: "Salma Begum",
    lastMessage: "Are you still available?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: 0,
  },
];

export default function DonorMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Chat with blood seekers</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search messages..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {mockConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation.id === conv.id ? "bg-emergency-50 border-l-4 border-l-emergency-600" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-emergency-600 text-white">
                            {conv.seekerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900 truncate">{conv.seekerName}</p>
                            {conv.unread > 0 && (
                              <Badge className="bg-emergency-600 text-white">{conv.unread}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(conv.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2 flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-emergency-600 text-white">
                      {selectedConversation.seekerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedConversation.seekerName}</CardTitle>
                    <CardDescription>Request #{selectedConversation.requestId}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Select a conversation to view messages</p>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input placeholder="Type your message..." />
                  <Button className="bg-emergency-600 hover:bg-emergency-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

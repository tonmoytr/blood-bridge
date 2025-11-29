"use client";

import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageSquare, Search, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
  _id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Thread {
  _id: string;
  requestId: {
    _id: string;
    patientName: string;
    bloodGroup: string;
  };
  otherUser: {
    _id: string;
    name: string;
  };
  lastMessageAt: string;
  unreadCount: number;
  status: string;
}

export default function SeekerMessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
  const userName = typeof window !== 'undefined' ? localStorage.getItem("userName") : null;

  // Fetch threads
  useEffect(() => {
    if (!userId) return;

    const fetchThreads = async () => {
      try {
        const response = await fetch(`/api/threads?userId=${userId}&userType=seeker`);
        if (response.ok) {
          const data = await response.json();
          setThreads(data.threads);
          if (data.threads.length > 0 && !selectedThread) {
            setSelectedThread(data.threads[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [userId]);

  // Fetch messages when thread is selected
  useEffect(() => {
    if (!selectedThread || !userId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const response = await fetch(
          `/api/messages/${selectedThread._id}?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
          
          // Update thread's unread count to 0
          setThreads(prev =>
            prev.map(t =>
              t._id === selectedThread._id ? { ...t, unreadCount: 0 } : t
            )
          );
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedThread, userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    console.log("Send message clicked");
    console.log("newMessage:", newMessage);
    console.log("selectedThread:", selectedThread);
    console.log("userId:", userId);
    console.log("userName:", userName);
    
    if (!newMessage.trim() || !selectedThread || !userId || !userName) {
      console.error("Missing required fields for sending message");
      if (!newMessage.trim()) console.error("- newMessage is empty");
      if (!selectedThread) console.error("- selectedThread is null");
      if (!userId) console.error("- userId is null");
      if (!userName) console.error("- userName is null");
      toast.error("Cannot send message. Please sign in again.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: selectedThread._id,
          senderId: userId,
          senderName: userName,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        setNewMessage("");
        
        // Update thread's last message time
        setThreads(prev =>
          prev.map(t =>
            t._id === selectedThread._id
              ? { ...t, lastMessageAt: new Date().toISOString() }
              : t
          )
        );
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout userType="seeker">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-trust-600" />
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout userType="seeker">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Chat with potential donors</p>
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
                  {threads.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No conversations yet</p>
                      <p className="text-sm mt-1">Wait for a donor to accept your request</p>
                    </div>
                  ) : (
                    threads.map((thread) => (
                      <div
                        key={thread._id}
                        onClick={() => setSelectedThread(thread)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedThread?._id === thread._id
                            ? "bg-trust-50 border-l-4 border-l-trust-600"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-trust-600 text-white">
                              {(thread.otherUser?.name || "User")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900 truncate">
                                {thread.otherUser?.name || "Unknown User"}
                              </p>
                              {thread.unreadCount > 0 && (
                                <Badge className="bg-trust-600 text-white">
                                  {thread.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {thread.requestId?.patientName} - {thread.requestId?.bloodGroup}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {thread.lastMessageAt && !isNaN(new Date(thread.lastMessageAt).getTime())
                                ? formatDistanceToNow(new Date(thread.lastMessageAt), {
                                    addSuffix: true,
                                  })
                                : "Just now"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2 flex flex-col">
              {selectedThread ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-trust-600 text-white">
                          {(selectedThread.otherUser?.name || "User")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{selectedThread.otherUser?.name || "Unknown User"}</CardTitle>
                        <CardDescription>
                          {selectedThread.requestId?.patientName} - {selectedThread.requestId?.bloodGroup}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-6 overflow-y-auto">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-trust-600" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <p>No messages yet</p>
                          <p className="text-sm mt-1">Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isOwnMessage = message.senderId === userId;
                          return (
                            <div
                              key={message._id}
                              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                  isOwnMessage
                                    ? "bg-trust-600 text-white"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isOwnMessage ? "text-trust-100" : "text-gray-500"
                                  }`}
                                >
                                  {message.createdAt && !isNaN(new Date(message.createdAt).getTime())
                                    ? formatDistanceToNow(new Date(message.createdAt), {
                                        addSuffix: true,
                                      })
                                    : "Just now"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </CardContent>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !sending) {
                            handleSendMessage();
                          }
                        }}
                        disabled={sending}
                      />
                      <Button
                        className="bg-trust-600 hover:bg-trust-700"
                        onClick={handleSendMessage}
                        disabled={sending || !newMessage.trim()}
                      >
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 p-6">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p>Select a conversation to view messages</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

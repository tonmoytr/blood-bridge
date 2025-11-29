import dbConnect from "@/lib/db/mongoose";
import ChatThread from "@/lib/models/ChatThread";
import Message from "@/lib/models/Message";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { threadId, senderId, senderName, content } = await req.json();

    // Validate required fields
    if (!threadId || !senderId || !senderName || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify thread exists and user is part of it
    const thread = await ChatThread.findById(threadId);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const isDonor = thread.donorId.toString() === senderId;
    const isSeeker = thread.seekerId.toString() === senderId;

    if (!isDonor && !isSeeker) {
      return NextResponse.json(
        { error: "User not authorized for this thread" },
        { status: 403 }
      );
    }

    // Create message
    const message = await Message.create({
      threadId,
      senderId,
      senderName,
      content,
      isRead: false,
    });

    // Update thread
    await ChatThread.findByIdAndUpdate(threadId, {
      lastMessageAt: new Date(),
      $inc: isDonor
        ? { "unreadCount.seeker": 1 }
        : { "unreadCount.donor": 1 },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

import dbConnect from "@/lib/db/mongoose";
import ChatThread from "@/lib/models/ChatThread";
import Message from "@/lib/models/Message";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    await dbConnect();

    const { threadId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify thread exists and user is part of it
    const thread = await ChatThread.findById(threadId);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const isDonor = thread.donorId.toString() === userId;
    const isSeeker = thread.seekerId.toString() === userId;

    if (!isDonor && !isSeeker) {
      return NextResponse.json(
        { error: "User not authorized for this thread" },
        { status: 403 }
      );
    }

    // Fetch all messages in thread
    const messages = await Message.find({ threadId }).sort({ createdAt: 1 });

    // Mark all messages as read for current user
    await Message.updateMany(
      {
        threadId,
        senderId: { $ne: userId },
        isRead: false,
      },
      { isRead: true }
    );

    // Reset unread counter for current user
    const updateField = isDonor
      ? { "unreadCount.donor": 0 }
      : { "unreadCount.seeker": 0 };

    await ChatThread.findByIdAndUpdate(threadId, updateField);

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

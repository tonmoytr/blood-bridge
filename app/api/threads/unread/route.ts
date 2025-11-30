import connectDB from "@/lib/db/mongoose";
import ChatThread from "@/lib/models/ChatThread";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const userType = searchParams.get("userType"); // "donor" or "seeker"

    if (!userId || !userType) {
      return NextResponse.json(
        { error: "Missing userId or userType" },
        { status: 400 }
      );
    }

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Build query based on user type
    let query;
    if (userType === "donor") {
      query = { donorId: userObjectId };
    } else {
      query = { seekerId: userObjectId };
    }

    // Get all threads for this user
    const threads = await ChatThread.find(query).lean();

    // Calculate total unread count based on user type
    const totalUnread = threads.reduce((sum, thread: any) => {
      if (userType === "donor") {
        return sum + (thread.unreadCount?.donor || 0);
      } else {
        return sum + (thread.unreadCount?.seeker || 0);
      }
    }, 0);

    return NextResponse.json({ unreadCount: totalUnread }, { status: 200 });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread count" },
      { status: 500 }
    );
  }
}

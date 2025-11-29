import dbConnect from "@/lib/db/mongoose";
import ChatThread from "@/lib/models/ChatThread";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { requestId, donorId, seekerId } = await req.json();

    // Validate required fields
    if (!requestId || !donorId || !seekerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if thread already exists for this request
    let thread = await ChatThread.findOne({ requestId });

    if (thread) {
      // Thread already exists, return it
      return NextResponse.json({ thread }, { status: 200 });
    }

    // Create new thread
    thread = await ChatThread.create({
      requestId,
      donorId,
      seekerId,
      lastMessageAt: new Date(),
      unreadCount: {
        donor: 0,
        seeker: 0,
      },
      status: "ACTIVE",
    });

    return NextResponse.json({ thread }, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const userType = searchParams.get("userType"); // 'donor' or 'seeker'

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching threads for user:", userId, "as", userType);

    // Filter threads based on user type
    let query: any;
    if (userType === "donor") {
      // Donor page: only show threads where user is the donor
      query = { donorId: userId };
    } else if (userType === "seeker") {
      // Seeker page: only show threads where user is the seeker
      query = { seekerId: userId };
    } else {
      // Fallback: show all threads (for backward compatibility)
      query = { $or: [{ donorId: userId }, { seekerId: userId }] };
    }

    const threads = await ChatThread.find(query)
      .populate("requestId")
      .populate("donorId")
      .populate("seekerId")
      .sort({ lastMessageAt: -1 })
      .lean();

    console.log(`Found ${threads.length} threads for ${userType}`);

    // If no threads, return empty array
    if (threads.length === 0) {
      return NextResponse.json({ threads: [] }, { status: 200 });
    }

    // Transform threads to include unread count for current user
    const transformedThreads = threads.map((thread: any) => {
      const isDonor = thread.donorId?._id?.toString() === userId;
      
      return {
        _id: thread._id,
        requestId: thread.requestId || {},
        donorId: thread.donorId || {},
        seekerId: thread.seekerId || {},
        lastMessageAt: thread.lastMessageAt,
        unreadCount: isDonor
          ? thread.unreadCount?.donor || 0
          : thread.unreadCount?.seeker || 0,
        otherUser: isDonor ? thread.seekerId : thread.donorId,
        status: thread.status,
      };
    });

    return NextResponse.json({ threads: transformedThreads }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching threads:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch threads", details: error.message },
      { status: 500 }
    );
  }
}

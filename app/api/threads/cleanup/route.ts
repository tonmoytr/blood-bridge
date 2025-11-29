import dbConnect from "@/lib/db/mongoose";
import ChatThread from "@/lib/models/ChatThread";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    console.log("Starting duplicate thread cleanup...");

    // Find all threads
    const allThreads = await ChatThread.find({}).lean();
    console.log(`Total threads found: ${allThreads.length}`);

    // Group by requestId
    const threadsByRequest = new Map<string, any[]>();
    
    for (const thread of allThreads) {
      const reqId = thread.requestId.toString();
      if (!threadsByRequest.has(reqId)) {
        threadsByRequest.set(reqId, []);
      }
      threadsByRequest.get(reqId)!.push(thread);
    }

    // Find duplicates
    let duplicatesFound = 0;
    let threadsDeleted = 0;
    const threadsToDelete: string[] = [];

    for (const [requestId, threads] of threadsByRequest.entries()) {
      if (threads.length > 1) {
        duplicatesFound++;
        console.log(`Request ${requestId} has ${threads.length} threads`);
        
        // Keep the oldest thread, delete the rest
        threads.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        for (let i = 1; i < threads.length; i++) {
          threadsToDelete.push(threads[i]._id.toString());
        }
      }
    }

    // Delete duplicates
    if (threadsToDelete.length > 0) {
      const result = await ChatThread.deleteMany({
        _id: { $in: threadsToDelete }
      });
      threadsDeleted = result.deletedCount || 0;
    }

    console.log(`Cleanup complete. Deleted ${threadsDeleted} duplicate threads.`);

    return NextResponse.json({
      message: "Cleanup complete",
      totalThreads: allThreads.length,
      duplicatesFound,
      threadsDeleted,
      remainingThreads: allThreads.length - threadsDeleted
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error cleaning up threads:", error);
    return NextResponse.json(
      { error: "Failed to cleanup threads", details: error.message },
      { status: 500 }
    );
  }
}

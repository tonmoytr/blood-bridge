import dbConnect from "@/lib/db/mongoose";
import ChatThread from "@/lib/models/ChatThread";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const threads = await ChatThread.find({}).lean();
    return NextResponse.json({ 
      count: threads.length,
      threads: threads.map((t: any) => ({
        _id: t._id,
        requestId: t.requestId,
        donorId: t.donorId,
        seekerId: t.seekerId,
        createdAt: t.createdAt
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

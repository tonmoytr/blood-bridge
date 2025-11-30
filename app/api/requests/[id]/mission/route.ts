import connectDB from "@/lib/db/mongoose";
import { Request, User } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { donorId, missionStatus } = body;

    if (!donorId || !missionStatus) {
      return NextResponse.json(
        { error: "Missing donorId or missionStatus" },
        { status: 400 }
      );
    }

    // Validate mission status
    const validStatuses = ["ACCEPTED", "ON_THE_WAY", "AT_HOSPITAL", "DONATING", "COMPLETED"];
    if (!validStatuses.includes(missionStatus)) {
      return NextResponse.json(
        { error: "Invalid mission status" },
        { status: 400 }
      );
    }

    // Find the request
    const req = await Request.findById(id);
    if (!req) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Verify this donor owns this mission
    if (req.acceptedDonorId?.toString() !== donorId) {
      return NextResponse.json(
        { error: "You are not assigned to this mission" },
        { status: 403 }
      );
    }

    // Verify request is in ACCEPTED status
    if (req.status !== "ACCEPTED") {
      return NextResponse.json(
        { error: "Request is not in ACCEPTED status" },
        { status: 400 }
      );
    }

    // Initialize missionTimestamps if not exists
    if (!req.missionTimestamps) {
      req.missionTimestamps = {};
    }

    // Update mission status and record timestamp
    req.missionStatus = missionStatus;
    const now = new Date();

    switch (missionStatus) {
      case "ACCEPTED":
        req.missionTimestamps.accepted = now;
        break;
      case "ON_THE_WAY":
        req.missionTimestamps.onTheWay = now;
        break;
      case "AT_HOSPITAL":
        req.missionTimestamps.atHospital = now;
        break;
      case "DONATING":
        req.missionTimestamps.donating = now;
        break;
      case "COMPLETED":
        req.missionTimestamps.completed = now;
        req.status = "COMPLETED";
        req.completedAt = now;

        // Trigger completion flow - update donor
        const donor = await User.findById(donorId);
        if (donor) {
          donor.lastDonationDate = now;
          donor.totalDonations = (donor.totalDonations || 0) + 1;
          
          // Calculate cooldown (90 days / 3 months)
          const cooldownDate = new Date(now);
          cooldownDate.setDate(cooldownDate.getDate() + 90);
          donor.cooldownUntil = cooldownDate;
          donor.status = "COOLDOWN";
          
          await donor.save();
        }
        break;
    }

    await req.save();

    return NextResponse.json({
      success: true,
      request: req,
      message: `Mission status updated to ${missionStatus}`,
    });
  } catch (error) {
    console.error("Error updating mission status:", error);
    return NextResponse.json(
      { error: "Failed to update mission status" },
      { status: 500 }
    );
  }
}

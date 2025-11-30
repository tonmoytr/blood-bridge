import connectDB from '@/lib/db/mongoose';
import { Request } from '@/models';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/requests/[id]/accept - Accept a blood request
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const { donorId, donorName } = body;

    // Validate required fields
    if (!donorId || !donorName) {
      return NextResponse.json(
        { error: 'Donor ID and name are required' },
        { status: 400 }
      );
    }

    // Find the request
    const request = await Request.findById(id);

    if (!request) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Validate request can be accepted
    if (request.status !== 'OPEN') {
      return NextResponse.json(
        { error: `Request is already ${request.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    if (request.acceptedDonorId) {
      return NextResponse.json(
        { error: 'Request has already been accepted by another donor' },
        { status: 400 }
      );
    }

    // Prevent seeker from accepting their own request
    const seekerIdString = request.seekerId.toString();
    if (seekerIdString === donorId) {
      return NextResponse.json(
        { error: 'You cannot accept your own request' },
        { status: 400 }
      );
    }

    // Check donor eligibility (cooldown period)
    const User = (await import('@/models')).User;
    const donor = await User.findById(donorId);
    
    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }

    // Check if donor is in cooldown period
    if (donor.lastDonationDate) {
      const { isDonorEligible } = await import('@/lib/donor-utils');
      if (!isDonorEligible(donor.lastDonationDate)) {
        const daysSince = Math.floor(
          (Date.now() - new Date(donor.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysRemaining = 56 - daysSince;
        
        return NextResponse.json(
          { 
            error: 'You are in cooldown period',
            details: `You must wait ${daysRemaining} more days before donating again. Your safety is our priority.`
          },
          { status: 403 }
        );
      }
    }

    // Update request with acceptance
    request.status = 'ACCEPTED';
    request.acceptedDonorId = donorId;
    request.acceptedAt = new Date();
    
    await request.save();

    // Create chat thread automatically
    let threadId = null;
    try {
      const ChatThread = (await import('@/lib/models/ChatThread')).default;
      
      // Check if thread already exists
      let thread = await ChatThread.findOne({ requestId: id });
      
      if (!thread) {
        // Create new thread - ensure seekerId is a string
        const seekerIdString = typeof request.seekerId === 'string' 
          ? request.seekerId 
          : request.seekerId?._id?.toString() || request.seekerId.toString();
        
        thread = await ChatThread.create({
          requestId: id,
          donorId,
          seekerId: seekerIdString,
          lastMessageAt: new Date(),
          unreadCount: {
            donor: 0,
            seeker: 0,
          },
          status: 'ACTIVE',
        });
      }
      
      threadId = thread._id.toString();
    } catch (threadError) {
      console.error('Error creating chat thread:', threadError);
      // Don't fail the request acceptance if thread creation fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Request accepted successfully',
        request,
        threadId, // Return thread ID for redirect
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error accepting request:', error);
    return NextResponse.json(
      { error: 'Failed to accept request', details: error.message },
      { status: 500 }
    );
  }
}

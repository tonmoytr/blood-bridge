import connectDB from '@/lib/db/mongoose';
import { Request } from '@/models';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/requests/[id] - Get single request by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    let request = await Request.findById(id).lean();

    if (!request) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Only populate if acceptedDonorId is a valid ObjectId
    if (request.acceptedDonorId && typeof request.acceptedDonorId === 'string' && mongoose.Types.ObjectId.isValid(request.acceptedDonorId)) {
      request = await Request.findById(id)
        .populate('acceptedDonorId', 'name phone bloodGroup totalDonations lastDonationDate location')
        .lean();
    }

    return NextResponse.json({
      success: true,
      request,
    });
  } catch (error: any) {
    console.error('Error fetching request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch request', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/requests/[id] - Update request
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = await params;

    // Find existing request
    const existingRequest = await Request.findById(id);

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Update allowed fields
    const allowedUpdates = [
      'status',
      'acceptedDonorId',
      'acceptedAt',
      'missionStatus',
      'completedAt',
      'urgency',
      'neededBy',
    ];

    Object.keys(body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (existingRequest as any)[key] = body[key];
      }
    });

    // If status is being set to ACCEPTED, set acceptedAt
    if (body.status === 'ACCEPTED' && !existingRequest.acceptedAt) {
      existingRequest.acceptedAt = new Date();
    }

    // If status is being set to COMPLETED, set completedAt
    if (body.status === 'COMPLETED' && !existingRequest.completedAt) {
      existingRequest.completedAt = new Date();
    }

    await existingRequest.save();

    return NextResponse.json({
      success: true,
      message: 'Request updated successfully',
      request: existingRequest,
    });
  } catch (error: any) {
    console.error('Error updating request:', error);
    return NextResponse.json(
      { error: 'Failed to update request', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/requests/[id] - Cancel/Delete request
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    const request = await Request.findById(id);

    if (!request) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Only allow deletion if request is OPEN
    if (request.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Cannot delete request that is already accepted or completed' },
        { status: 400 }
      );
    }

    // Soft delete by setting status to CANCELLED
    request.status = 'CANCELLED';
    await request.save();

    return NextResponse.json({
      success: true,
      message: 'Request cancelled successfully',
    });
  } catch (error: any) {
    console.error('Error deleting request:', error);
    return NextResponse.json(
      { error: 'Failed to delete request', details: error.message },
      { status: 500 }
    );
  }
}

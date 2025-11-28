import connectDB from '@/lib/db/mongoose';
import { Request } from '@/models';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/requests - Create new blood request
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate required fields
    const {
      seekerId,
      seekerName,
      patientName,
      patientAge,
      bloodGroup,
      unitsNeeded,
      hospitalName,
      hospitalAddress,
      location,
      urgency,
      neededBy,
      hasPrescription,
      prescriptionUrl,
      additionalInfo,
      contactPhone,
      alternatePhone,
    } = body;

    if (!seekerId || !seekerName || !patientName || !bloodGroup || !hospitalName || !location || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate trust score (basic implementation for now)
    const trustScore = hasPrescription ? 'HIGH' : 'MEDIUM';

    // Create new request
    const newRequest = await Request.create({
      seekerId,
      seekerName,
      patientName,
      patientAge,
      bloodGroup,
      unitsNeeded: unitsNeeded || 1,
      hospitalName,
      hospitalAddress,
      location,
      urgency: urgency || 'NORMAL',
      neededBy: neededBy || new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24 hours
      hasPrescription: hasPrescription || false,
      prescriptionUrl,
      additionalInfo: additionalInfo || '',
      contactPhone,
      alternatePhone: alternatePhone || '',
      trustScore,
      status: 'OPEN',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Request created successfully',
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'Failed to create request', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/requests - List all requests with filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    
    // Build filter query
    const filter: any = {};

    // Filter by blood group
    const bloodGroup = searchParams.get('bloodGroup');
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    // Filter by status
    const status = searchParams.get('status');
    if (status) {
      filter.status = status;
    }
    // NOTE: Removed default OPEN filter - let frontend decide what to show

    // Filter by urgency
    const urgency = searchParams.get('urgency');
    if (urgency) {
      filter.urgency = urgency;
    }

    // Filter by location
    const district = searchParams.get('district');
    if (district) {
      filter['location.district'] = district;
    }

    const thana = searchParams.get('thana');
    if (thana) {
      filter['location.thana'] = thana;
    }

    // Filter by seekerId (for My Requests)
    const seekerId = searchParams.get('seekerId');
    if (seekerId) {
      filter.seekerId = seekerId;
    }

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const sort: any = { [sortBy]: sortOrder };

    // Priority sorting: CRITICAL first, then by creation date
    if (sortBy === 'urgency') {
      sort.urgency = -1; // CRITICAL > HIGH > NORMAL
      sort.createdAt = -1;
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Fetch requests
    const requests = await Request.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Request.countDocuments(filter);

    return NextResponse.json({
      success: true,
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests', details: error.message },
      { status: 500 }
    );
  }
}

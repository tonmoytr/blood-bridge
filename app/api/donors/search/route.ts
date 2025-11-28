import connectDB from '@/lib/db/mongoose';
import { calculateDonorScore, getCompatibleDonors } from '@/lib/matching';
import { User } from '@/models';
import { BloodGroup } from '@/types/database';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/donors/search - Search for compatible donors
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Required: blood group needed
    const bloodGroup = searchParams.get('bloodGroup') as BloodGroup;
    if (!bloodGroup) {
      return NextResponse.json(
        { error: 'Blood group is required' },
        { status: 400 }
      );
    }

    // Location for proximity matching
    const division = searchParams.get('division');
    const district = searchParams.get('district');
    const thana = searchParams.get('thana');

    if (!division || !district || !thana) {
      return NextResponse.json(
        { error: 'Location (division, district, thana) is required' },
        { status: 400 }
      );
    }

    // Get compatible blood groups
    const compatibleBloodGroups = getCompatibleDonors(bloodGroup);

    // Build query
    const query: any = {
      bloodGroup: { $in: compatibleBloodGroups },
      status: 'ACTIVE', // Only active donors
    };

    // Fetch matching donors
    const donors = await User.find(query)
      .select('name phone bloodGroup location totalDonations badges')
      .lean();

    // Calculate match scores and sort
    const donorsWithScores = donors.map((donor) => ({
      ...donor,
      matchScore: calculateDonorScore(
        {
          bloodGroup: donor.bloodGroup,
          location: donor.location,
          totalDonations: donor.totalDonations,
        },
        {
          bloodGroup,
          location: { division, district, thana },
        }
      ),
    }));

    // Sort by match score (highest first)
    donorsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const paginatedDonors = donorsWithScores.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      donors: paginatedDonors,
      total: donorsWithScores.length,
      pagination: {
        page,
        limit,
        total: donorsWithScores.length,
        pages: Math.ceil(donorsWithScores.length / limit),
      },
    });
  } catch (error: any) {
    console.error('Error searching donors:', error);
    return NextResponse.json(
      { error: 'Failed to search donors', details: error.message },
      { status: 500 }
    );
  }
}

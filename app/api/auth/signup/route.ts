import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

import { hashPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { 
      name, 
      mobileNumber, 
      password,
      email, 
      bloodGroup, 
      division, 
      district, 
      thana, 
      dateOfBirth, 
      weight, 
      isDonor, 
      lastDonation 
    } = body;

    // Validate required fields
    if (!name || !mobileNumber || !password || !bloodGroup || !division || !district || !thana) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone: mobileNumber });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this mobile number already exists" },
        { status: 409 }
      );
    }

    // Calculate age if dateOfBirth is provided
    let age;
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const diffMs = Date.now() - dob.getTime();
      const ageDate = new Date(diffMs);
      age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create new user
    const newUser = await User.create({
      name,
      phone: mobileNumber,
      password: hashedPassword,
      email,
      bloodGroup,
      location: {
        division,
        district,
        thana,
      },
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      age,
      isAvailable: isDonor,
      lastDonationDate: lastDonation ? new Date(lastDonation) : undefined,
      status: isDonor ? 'ACTIVE' : 'SNOOZED',
    });

    return NextResponse.json(
      { 
        message: "User registered successfully", 
        user: newUser,
        userId: (newUser as any)._id 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}

import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

import { verifyPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Phone number and password are required" },
        { status: 400 }
      );
    }

    // Find user by phone and include password
    const user = await User.findOne({ phone }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: "Invalid phone number or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = verifyPassword(password, user.password!);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid phone number or password" },
        { status: 401 }
      );
    }

    // Remove password from user object before returning
    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json(
      { 
        message: "Sign in successful", 
        user: userObj,
        userId: user._id 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error signing in:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sign in" },
      { status: 500 }
    );
  }
}

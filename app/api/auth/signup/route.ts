import { NextRequest, NextResponse } from "next/server";
import { usersDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = usersDb.getByEmail(email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const userId = randomUUID();
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password: password, // Plain text for UI/UX demo
      name: name,
      phone: null,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=FF6B00&color=fff&size=200`,
    };

    usersDb.create(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "An error occurred during signup" },
      { status: 500 }
    );
  }
}

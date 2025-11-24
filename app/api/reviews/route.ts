import { NextRequest, NextResponse } from "next/server";
import { reviewsDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, name, rating, comment, avatar } = body;

    if (!restaurantId || !name || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const review = {
      name,
      rating,
      comment,
      time: "Just now",
      avatar: avatar || "👤",
      helpful: 0,
    };

    const result = reviewsDb.create(review, restaurantId);

    return NextResponse.json(
      { success: true, id: result.lastInsertRowid },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

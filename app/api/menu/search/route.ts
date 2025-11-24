import { NextRequest, NextResponse } from "next/server";
import { menuDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const menuItems = menuDb.search(query);

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error searching menu items:", error);
    return NextResponse.json(
      { error: "Failed to search menu items" },
      { status: 500 }
    );
  }
}

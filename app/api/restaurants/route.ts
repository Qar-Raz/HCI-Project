import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, restaurantDb, menuDb } from "@/lib/db";

// Initialize database on first request
initializeDatabase();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (query) {
      // Search restaurants
      const restaurants = restaurantDb.search(query);

      // Add menu items to each restaurant
      const restaurantsWithMenu = restaurants.map((restaurant: any) => ({
        ...restaurant,
        deliveryTime: restaurant.delivery_time,
        isClosed: restaurant.is_closed === 1,
        menu: menuDb.getByRestaurant(restaurant.id),
      }));

      return NextResponse.json(restaurantsWithMenu);
    }

    // Get all restaurants
    const restaurants = restaurantDb.getAll();

    // Add menu items to each restaurant
    const restaurantsWithMenu = restaurants.map((restaurant: any) => ({
      ...restaurant,
      deliveryTime: restaurant.delivery_time,
      isClosed: restaurant.is_closed === 1,
      menu: menuDb.getByRestaurant(restaurant.id),
    }));

    return NextResponse.json(restaurantsWithMenu);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = restaurantDb.create(body);

    return NextResponse.json(
      { success: true, id: result.lastInsertRowid },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { error: "Failed to create restaurant" },
      { status: 500 }
    );
  }
}

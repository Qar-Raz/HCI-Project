import { NextRequest, NextResponse } from "next/server";
import { ordersDb } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    console.log("GET /api/orders - Auth check:", { userId, hasUser: !!user });
    
    if (!userId) {
      return NextResponse.json([]);
    }

    const orders = ordersDb.getAll(userId);

    // Parse items JSON for each order
    const ordersWithParsedItems = orders.map((order: any) => ({
      ...order,
      items: JSON.parse(order.items),
    }));

    return NextResponse.json(ordersWithParsedItems);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('POST /api/orders - Request received');
  try {
    let userId = 'anonymous';
    
    try {
      const user = await currentUser();
      if (user?.id) {
        userId = user.id;
      }
    } catch (authError) {
      console.log('Auth check failed, using anonymous:', authError);
    }
    
    console.log("POST /api/orders - Using userId:", userId);

    const body = await request.json();
    console.log('POST /api/orders - Order data:', { 
      restaurantId: body.restaurantId, 
      itemCount: body.items?.length,
      total: body.total 
    });

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const order = {
      id: orderId,
      userId: userId,
      restaurantId: body.restaurantId,
      restaurantName: body.restaurantName,
      items: body.items,
      total: body.total,
      status: "pending",
    };

    const result = ordersDb.create(order);
    
    console.log('POST /api/orders - Order created successfully:', orderId);

    return NextResponse.json(
      { success: true, orderId, order },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}

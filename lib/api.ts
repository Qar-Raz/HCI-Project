// API utility functions for fetching data from SQLite backend
import { Restaurant, FoodItem } from "./types";

const API_BASE_URL = "/api";

// Restaurant APIs
export const restaurantApi = {
  /**
   * Get all restaurants
   */
  getAll: async (): Promise<Restaurant[]> => {
    const response = await fetch(`${API_BASE_URL}/restaurants`);
    if (!response.ok) {
      throw new Error("Failed to fetch restaurants");
    }
    return response.json();
  },

  /**
   * Get restaurant by slug
   */
  getBySlug: async (slug: string): Promise<Restaurant | null> => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch restaurant");
    }
    return response.json();
  },

  /**
   * Search restaurants by name or cuisine
   */
  search: async (query: string): Promise<Restaurant[]> => {
    const response = await fetch(
      `${API_BASE_URL}/restaurants?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to search restaurants");
    }
    return response.json();
  },

  /**
   * Create new restaurant (admin only)
   */
  create: async (
    restaurant: Partial<Restaurant>
  ): Promise<{ success: boolean; id: string }> => {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurant),
    });
    if (!response.ok) {
      throw new Error("Failed to create restaurant");
    }
    return response.json();
  },
};

// Menu APIs
export const menuApi = {
  /**
   * Search menu items across all restaurants
   */
  search: async (query: string): Promise<FoodItem[]> => {
    const response = await fetch(
      `${API_BASE_URL}/menu/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to search menu items");
    }
    return response.json();
  },
};

// Order APIs
export const orderApi = {
  /**
   * Get all orders
   */
  getAll: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return response.json();
  },

  /**
   * Create new order
   */
  create: async (order: {
    restaurantId: string;
    restaurantName: string;
    items: any[];
    total: number;
  }): Promise<{ success: boolean; orderId: string; order: any }> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      throw new Error("Failed to create order");
    }
    return response.json();
  },
};

// Review APIs
export const reviewApi = {
  /**
   * Create new review
   */
  create: async (review: {
    restaurantId: string;
    name: string;
    rating: number;
    comment: string;
    avatar?: string;
  }): Promise<{ success: boolean; id: number }> => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });
    if (!response.ok) {
      throw new Error("Failed to create review");
    }
    return response.json();
  },
};

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  console.error("API Error:", error);
  return {
    error: true,
    message: error.message || "An unexpected error occurred",
  };
};

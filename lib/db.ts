// Mock Database Configuration for Vercel Deployment
// Since the application uses localStorage for user data and static data for restaurants,
// we don't need a real server-side database. This file mocks the DB interface
// to prevent build errors with better-sqlite3 on Vercel.

import { Restaurant, FoodItem } from "./types";
import { restaurants as staticRestaurants } from "./data";

// Mock DB object
const db = {
  prepare: () => ({
    all: () => [],
    get: () => null,
    run: () => ({ changes: 0, lastInsertRowid: 0 }),
  }),
  exec: () => {},
  pragma: () => [],
};

// Initialize database schema (No-op)
export function initializeDatabase() {
  console.log("Mock database initialized");
}

// Restaurant operations
export const restaurantDb = {
  getAll: () => {
    // Return static data if needed, or empty array
    return staticRestaurants.map(r => ({
        ...r,
        delivery_time: r.deliveryTime,
        is_closed: r.isClosed ? 1 : 0
    }));
  },

  getBySlug: (slug: string) => {
    const r = staticRestaurants.find(r => r.slug === slug);
    if (!r) return null;
    return {
        ...r,
        delivery_time: r.deliveryTime,
        is_closed: r.isClosed ? 1 : 0
    };
  },

  getById: (id: string) => {
    const r = staticRestaurants.find(r => r.id === id);
    if (!r) return null;
    return {
        ...r,
        delivery_time: r.deliveryTime,
        is_closed: r.isClosed ? 1 : 0
    };
  },

  create: (restaurant: any) => ({ changes: 1 }),
  update: (id: string, restaurant: any) => ({ changes: 1 }),
  delete: (id: string) => ({ changes: 1 }),
  search: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return staticRestaurants.filter(r => 
        r.name.toLowerCase().includes(lowerQuery) || 
        r.cuisine.toLowerCase().includes(lowerQuery)
    ).map(r => ({
        ...r,
        delivery_time: r.deliveryTime,
        is_closed: r.isClosed ? 1 : 0
    }));
  },
};

// Menu items operations
export const menuDb = {
  getByRestaurant: (restaurantId: string) => {
    const r = staticRestaurants.find(r => r.id === restaurantId);
    return r ? r.menu : [];
  },

  getById: (id: string) => null,
  create: (item: any, restaurantId: string) => ({ changes: 1 }),
  update: (id: string, item: any) => ({ changes: 1 }),
  delete: (id: string) => ({ changes: 1 }),
  search: (query: string) => [],
};

// Reviews operations
export const reviewsDb = {
  getByRestaurant: (restaurantId: string) => [],
  create: (review: any, restaurantId: string) => ({ changes: 1 }),
  incrementHelpful: (id: number) => ({ changes: 1 }),
  delete: (id: number) => ({ changes: 1 }),
};

// Orders operations
export const ordersDb = {
  getAll: (userId?: string) => [],
  getById: (id: string) => null,
  create: (order: any) => ({ changes: 1 }),
  updateStatus: (id: string, status: string) => ({ changes: 1 }),
  delete: (id: string) => ({ changes: 1 }),
};

// User operations
export const usersDb = {
  getAll: () => [],
  getById: (id: string) => null,
  getByEmail: (email: string) => null,
  create: (user: any) => ({ changes: 1 }),
  update: (id: string, updates: any) => ({ changes: 1 }),
  delete: (id: string) => ({ changes: 1 }),
};

export default db;

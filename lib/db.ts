// SQLite Database Configuration
import Database from "better-sqlite3";
import path from "path";
import { Restaurant, FoodItem } from "./types";

// Initialize database
const dbPath = path.join(process.cwd(), "foodhub.db");

// Use a global variable to store the database connection in development
// to prevent multiple connections from being created during hot reloading
let db: any;

if (process.env.NODE_ENV === "production") {
  db = new Database(dbPath);
} else {
  if (!(global as any).db) {
    (global as any).db = new Database(dbPath);
  }
  db = (global as any).db;
}

// Enable WAL mode for better concurrent access
db.pragma("journal_mode = WAL");

// Auto-initialize database on load to ensure tables exist
try {
    initializeDatabase();
} catch (error) {
    console.error("Failed to initialize database:", error);
}

// Initialize database schema
export function initializeDatabase() {
  // Create restaurants table
  db.exec(`
        CREATE TABLE IF NOT EXISTS restaurants (
            id TEXT PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            rating REAL NOT NULL,
            reviews INTEGER NOT NULL,
            distance TEXT NOT NULL,
            delivery_time TEXT NOT NULL,
            image TEXT NOT NULL,
            discount INTEGER,
            cuisine TEXT NOT NULL,
            is_closed INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

  // Create menu_items table
  db.exec(`
        CREATE TABLE IF NOT EXISTS menu_items (
            id TEXT PRIMARY KEY,
            restaurant_id TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price INTEGER NOT NULL,
            image TEXT NOT NULL,
            category TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
        )
    `);

  // Create reviews table
  db.exec(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            restaurant_id TEXT NOT NULL,
            name TEXT NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            time TEXT NOT NULL,
            avatar TEXT NOT NULL,
            helpful INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
        )
    `);

  // Create orders table
  db.exec(`
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            restaurant_id TEXT NOT NULL,
            restaurant_name TEXT NOT NULL,
            items TEXT NOT NULL,
            total REAL NOT NULL,
            status TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
        )
    `);

  // Migration to add user_id to orders if it doesn't exist
  try {
    const tableInfo = db.pragma("table_info(orders)") as any[];
    const hasUserId = tableInfo.some((col) => col.name === "user_id");
    if (!hasUserId) {
      console.log("Migrating orders table: adding user_id column");
      db.exec("ALTER TABLE orders ADD COLUMN user_id TEXT DEFAULT 'anonymous'");
    }
  } catch (error) {
    console.error("Error migrating orders table:", error);
  }

  // Create users table
  db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT,
            avatar TEXT,
            clerk_id TEXT UNIQUE,
            accessibility_settings TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

  // Add clerk_id column if it doesn't exist (migration for existing db)
  try {
      const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
      
      const hasClerkId = tableInfo.some(col => col.name === 'clerk_id');
      if (!hasClerkId) {
          db.exec('ALTER TABLE users ADD COLUMN clerk_id TEXT');
          db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id)');
      }

      const hasAccessibilitySettings = tableInfo.some(col => col.name === 'accessibility_settings');
      if (!hasAccessibilitySettings) {
          db.exec('ALTER TABLE users ADD COLUMN accessibility_settings TEXT');
      }
  } catch (error) {
      console.error('Error migrating users table:', error);
  }

  // Create user_addresses table
  db.exec(`
        CREATE TABLE IF NOT EXISTS user_addresses (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            address TEXT NOT NULL,
            is_default INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(clerk_id) ON DELETE CASCADE
        )
    `);

  // Create user_favorites table
  db.exec(`
        CREATE TABLE IF NOT EXISTS user_favorites (
            user_id TEXT NOT NULL,
            restaurant_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, restaurant_id),
            FOREIGN KEY (user_id) REFERENCES users(clerk_id) ON DELETE CASCADE,
            FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
        )
    `);

  // Create indexes for better query performance
  db.exec(`
        CREATE INDEX IF NOT EXISTS idx_menu_restaurant ON menu_items(restaurant_id);
        CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id);
        CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
    `);

  console.log("✅ Database initialized successfully");
}

// Restaurant operations
export const restaurantDb = {
  getAll: () => {
    const stmt = db.prepare("SELECT * FROM restaurants ORDER BY rating DESC");
    return stmt.all();
  },

  getBySlug: (slug: string) => {
    const stmt = db.prepare("SELECT * FROM restaurants WHERE slug = ?");
    return stmt.get(slug);
  },

  getById: (id: string) => {
    const stmt = db.prepare("SELECT * FROM restaurants WHERE id = ?");
    return stmt.get(id);
  },

  create: (restaurant: any) => {
    const stmt = db.prepare(`
            INSERT INTO restaurants (id, slug, name, rating, reviews, distance, delivery_time, image, discount, cuisine, is_closed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
    return stmt.run(
      restaurant.id,
      restaurant.slug,
      restaurant.name,
      restaurant.rating,
      restaurant.reviews,
      restaurant.distance,
      restaurant.deliveryTime,
      restaurant.image,
      restaurant.discount || null,
      restaurant.cuisine,
      restaurant.isClosed ? 1 : 0
    );
  },

  update: (id: string, restaurant: any) => {
    const stmt = db.prepare(`
            UPDATE restaurants 
            SET name = ?, rating = ?, reviews = ?, distance = ?, delivery_time = ?, 
                image = ?, discount = ?, cuisine = ?, is_closed = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
    return stmt.run(
      restaurant.name,
      restaurant.rating,
      restaurant.reviews,
      restaurant.distance,
      restaurant.deliveryTime,
      restaurant.image,
      restaurant.discount || null,
      restaurant.cuisine,
      restaurant.isClosed ? 1 : 0,
      id
    );
  },

  delete: (id: string) => {
    const stmt = db.prepare("DELETE FROM restaurants WHERE id = ?");
    return stmt.run(id);
  },

  search: (query: string) => {
    const stmt = db.prepare(`
            SELECT * FROM restaurants 
            WHERE name LIKE ? OR cuisine LIKE ?
            ORDER BY rating DESC
        `);
    return stmt.all(`%${query}%`, `%${query}%`);
  },
};

// Menu items operations
export const menuDb = {
  getByRestaurant: (restaurantId: string) => {
    const stmt = db.prepare(
      "SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY category, name"
    );
    return stmt.all(restaurantId);
  },

  getById: (id: string) => {
    const stmt = db.prepare("SELECT * FROM menu_items WHERE id = ?");
    return stmt.get(id);
  },

  create: (item: any, restaurantId: string) => {
    const stmt = db.prepare(`
            INSERT INTO menu_items (id, restaurant_id, name, description, price, image, category)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
    return stmt.run(
      item.id,
      restaurantId,
      item.name,
      item.description,
      item.price,
      item.image,
      item.category
    );
  },

  update: (id: string, item: any) => {
    const stmt = db.prepare(`
            UPDATE menu_items 
            SET name = ?, description = ?, price = ?, image = ?, category = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
    return stmt.run(
      item.name,
      item.description,
      item.price,
      item.image,
      item.category,
      id
    );
  },

  delete: (id: string) => {
    const stmt = db.prepare("DELETE FROM menu_items WHERE id = ?");
    return stmt.run(id);
  },

  search: (query: string) => {
    const stmt = db.prepare(`
            SELECT mi.*, r.name as restaurant_name, r.slug as restaurant_slug 
            FROM menu_items mi
            JOIN restaurants r ON mi.restaurant_id = r.id
            WHERE mi.name LIKE ? OR mi.description LIKE ? OR mi.category LIKE ?
            ORDER BY r.rating DESC
        `);
    return stmt.all(`%${query}%`, `%${query}%`, `%${query}%`);
  },
};

// Reviews operations
export const reviewsDb = {
  getByRestaurant: (restaurantId: string) => {
    const stmt = db.prepare(
      "SELECT * FROM reviews WHERE restaurant_id = ? ORDER BY created_at DESC"
    );
    return stmt.all(restaurantId);
  },

  create: (review: any, restaurantId: string) => {
    const stmt = db.prepare(`
            INSERT INTO reviews (restaurant_id, name, rating, comment, time, avatar, helpful)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
    return stmt.run(
      restaurantId,
      review.name,
      review.rating,
      review.comment,
      review.time,
      review.avatar,
      review.helpful || 0
    );
  },

  incrementHelpful: (id: number) => {
    const stmt = db.prepare(
      "UPDATE reviews SET helpful = helpful + 1 WHERE id = ?"
    );
    return stmt.run(id);
  },

  delete: (id: number) => {
    const stmt = db.prepare("DELETE FROM reviews WHERE id = ?");
    return stmt.run(id);
  },
};

// Orders operations
export const ordersDb = {
  getAll: (userId?: string) => {
    if (userId) {
      const stmt = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
      return stmt.all(userId);
    }
    const stmt = db.prepare("SELECT * FROM orders ORDER BY created_at DESC");
    return stmt.all();
  },

  getById: (id: string) => {
    const stmt = db.prepare("SELECT * FROM orders WHERE id = ?");
    return stmt.get(id);
  },

  create: (order: any) => {
    const stmt = db.prepare(`
            INSERT INTO orders (id, user_id, restaurant_id, restaurant_name, items, total, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
    return stmt.run(
      order.id,
      order.userId || 'anonymous',
      order.restaurantId,
      order.restaurantName,
      JSON.stringify(order.items),
      order.total,
      order.status
    );
  },

  updateStatus: (id: string, status: string) => {
    const stmt = db.prepare(
      "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    );
    return stmt.run(status, id);
  },

  delete: (id: string) => {
    const stmt = db.prepare("DELETE FROM orders WHERE id = ?");
    return stmt.run(id);
  },
};

// User operations
export const usersDb = {
  getAll: () => {
    const stmt = db.prepare("SELECT * FROM users ORDER BY created_at DESC");
    return stmt.all();
  },

  getById: (id: string) => {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(id);
  },

  getByEmail: (email: string) => {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email);
  },

  create: (user: any) => {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, name, phone, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      user.id,
      user.email,
      user.password,
      user.name,
      user.phone || null,
      user.avatar || null
    );
  },

  update: (id: string, updates: any) => {
    const stmt = db.prepare(`
      UPDATE users 
      SET name = ?, phone = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    return stmt.run(updates.name, updates.phone, updates.avatar, id);
  },

  delete: (id: string) => {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    return stmt.run(id);
  },
};

export default db;

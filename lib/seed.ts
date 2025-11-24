// Database seeding script
import {
  initializeDatabase,
  restaurantDb,
  menuDb,
  reviewsDb,
  usersDb,
} from "./db";
import { restaurants } from "./data";
import { randomUUID } from "crypto";

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Initialize database schema
    initializeDatabase();

    // Check if data already exists
    const existingRestaurants = restaurantDb.getAll();
    if (existingRestaurants.length > 0) {
      console.log("⚠️  Database already seeded. Skipping...");
      return;
    }

    // Seed test user
    console.log("   Adding test user...");
    const testUser = {
      id: randomUUID(),
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      phone: "+1234567890",
      avatar:
        "https://ui-avatars.com/api/?name=Test+User&background=FF6B00&color=fff&size=200",
    };
    usersDb.create(testUser);
    console.log("   ✓ Test user created (test@example.com / password123)");

    // Seed restaurants and menu items
    for (const restaurant of restaurants) {
      console.log(`   Adding restaurant: ${restaurant.name}`);

      // Insert restaurant
      restaurantDb.create(restaurant);

      // Insert menu items
      for (const menuItem of restaurant.menu) {
        menuDb.create(menuItem, restaurant.id);
      }

      // Insert sample reviews
      const sampleReviews = [
        {
          name: "John D.",
          rating: 5,
          comment: "Amazing food and quick delivery!",
          time: "2 days ago",
          avatar: "👨",
          helpful: 12,
        },
        {
          name: "Sarah M.",
          rating: 5,
          comment: "Best restaurant in the area. Highly recommended!",
          time: "5 days ago",
          avatar: "👩",
          helpful: 8,
        },
        {
          name: "Mike R.",
          rating: 4,
          comment: "Good food, reasonable prices.",
          time: "1 week ago",
          avatar: "👨‍🦰",
          helpful: 5,
        },
        {
          name: "Emily W.",
          rating: 5,
          comment: "Fresh ingredients and excellent service!",
          time: "2 weeks ago",
          avatar: "👩‍🦰",
          helpful: 15,
        },
      ];

      for (const review of sampleReviews) {
        reviewsDb.create(review, restaurant.id);
      }
    }

    console.log("✅ Database seeded successfully!");
    console.log(`   - ${restaurants.length} restaurants added`);
    console.log(
      `   - ${restaurants.reduce(
        (acc, r) => acc + r.menu.length,
        0
      )} menu items added`
    );
    console.log(`   - ${restaurants.length * 4} reviews added`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

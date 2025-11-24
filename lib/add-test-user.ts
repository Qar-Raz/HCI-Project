// Add test user to database
import { usersDb, initializeDatabase } from "./db";
import { randomUUID } from "crypto";

async function addTestUser() {
  console.log("👤 Adding test user...");

  try {
    // Initialize database schema
    initializeDatabase();

    // Check if test user already exists
    const existingUser = usersDb.getByEmail("test@example.com");
    if (existingUser) {
      console.log("⚠️  Test user already exists. Email: test@example.com");
      console.log("   Use password: password123");
      return;
    }

    // Create test user
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
    console.log("✅ Test user created successfully!");
    console.log("   Email: test@example.com");
    console.log("   Password: password123");
  } catch (error) {
    console.error("❌ Error adding test user:", error);
  }
}

addTestUser();

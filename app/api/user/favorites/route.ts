import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'foodhub.db');
const db = new Database(dbPath);

export async function GET() {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ favorites: [] });
    }

    try {
        const favorites = db.prepare(`
            SELECT r.* 
            FROM restaurants r
            JOIN user_favorites uf ON r.id = uf.restaurant_id
            WHERE uf.user_id = ?
        `).all(userId);

        return NextResponse.json({ favorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { restaurantId } = await request.json();

        if (!restaurantId) {
            return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
        }

        // Check if already favorited
        const existing = db.prepare('SELECT * FROM user_favorites WHERE user_id = ? AND restaurant_id = ?').get(userId, restaurantId);

        if (existing) {
            // Remove favorite
            db.prepare('DELETE FROM user_favorites WHERE user_id = ? AND restaurant_id = ?').run(userId, restaurantId);
            return NextResponse.json({ favorited: false });
        } else {
            // Add favorite
            // Ensure user exists in users table (sync if needed)
            const userExists = db.prepare('SELECT clerk_id FROM users WHERE clerk_id = ?').get(userId);
            if (!userExists) {
                // Basic sync - in a real app, you'd want more user details here
                // Use userId in email to ensure uniqueness
                db.prepare('INSERT INTO users (id, clerk_id, email, name, password) VALUES (?, ?, ?, ?, ?)').run(userId, userId, `${userId}@temp.com`, 'Sync User', 'temp');
            }

            db.prepare('INSERT INTO user_favorites (user_id, restaurant_id) VALUES (?, ?)').run(userId, restaurantId);
            return NextResponse.json({ favorited: true });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

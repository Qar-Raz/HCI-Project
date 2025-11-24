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
        return NextResponse.json({ addresses: [] });
    }

    try {
        const addresses = db.prepare('SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC').all(userId);
        return NextResponse.json({ addresses });
    } catch (error) {
        console.error('Error fetching addresses:', error);
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
        const { type, address, isDefault } = await request.json();

        if (!address || !type) {
            return NextResponse.json({ error: 'Address and type are required' }, { status: 400 });
        }

        // Ensure user exists
        const userExists = db.prepare('SELECT clerk_id FROM users WHERE clerk_id = ?').get(userId);
        if (!userExists) {
             db.prepare('INSERT INTO users (id, clerk_id, email, name, password) VALUES (?, ?, ?, ?, ?)').run(userId, userId, `${userId}@temp.com`, 'Sync User', 'temp');
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            db.prepare('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?').run(userId);
        }

        const id = Date.now().toString(); // Simple ID generation
        db.prepare('INSERT INTO user_addresses (id, user_id, type, address, is_default) VALUES (?, ?, ?, ?, ?)').run(id, userId, type, address, isDefault ? 1 : 0);

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Error adding address:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

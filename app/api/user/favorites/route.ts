import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
// Database removed for Vercel deployment

export async function GET() {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ favorites: [] });
    }

    return NextResponse.json({ favorites: [] });
}

export async function POST(request: Request) {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ favorited: true });
}

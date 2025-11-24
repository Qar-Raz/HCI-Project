import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
// Database removed for Vercel deployment

export async function GET() {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ addresses: [] });
    }

    return NextResponse.json({ addresses: [] });
}

export async function POST(request: Request) {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true, id: Date.now().toString() });
}

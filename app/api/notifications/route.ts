import { NextRequest, NextResponse } from 'next/server';
import { createNudge } from '@/lib/engines';

export async function GET(request: NextRequest) {
  try {
    const streak = Number(request.nextUrl.searchParams.get('streak') ?? 0);
    const xp = Number(request.nextUrl.searchParams.get('xp') ?? 0);
    const skill = request.nextUrl.searchParams.get('skill') ?? undefined;
    return NextResponse.json({ ...createNudge({ streak, xp, skill }), scheduledAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: 'A reminder is unavailable right now.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reminder = createNudge({ streak: Number(body.streak ?? 0), xp: Number(body.xp ?? 0), skill: String(body.skill ?? 'STAR Method') });
    return NextResponse.json({ ...reminder, scheduledAt: new Date(Date.now() + 60_000).toISOString() });
  } catch {
    return NextResponse.json({ error: 'Could not prepare the reminder.' }, { status: 400 });
  }
}

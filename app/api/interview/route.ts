import { NextRequest, NextResponse } from 'next/server';
import { interviewTurn } from '@/lib/engines';
import { evaluateInterviewWithAI } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const answer = String(body.answer ?? '').slice(0, 10_000);
    if (!answer.trim()) return NextResponse.json({ error: 'Write or dictate an answer first.' }, { status: 400 });
    const input = {
      answer,
      role: String(body.role ?? ''),
      industry: String(body.industry ?? ''),
      difficulty: String(body.difficulty ?? ''),
      turn: Number.isFinite(Number(body.turn)) ? Number(body.turn) : 0,
      mode: String(body.mode ?? '')
    };
    const aiFeedback = await evaluateInterviewWithAI(input);
    return NextResponse.json(aiFeedback ?? interviewTurn(input), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Interview feedback could not be calculated.' }, { status: 400 });
  }
}

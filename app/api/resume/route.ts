import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume, buildResume } from '@/lib/engines';
import { analyzeResumeWithAI, buildResumeWithAI } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const action = body.action;
    if (action === 'analyze') {
      const resume = String(body.resume ?? '').slice(0, 30_000);
      const jobDescription = String(body.jobDescription ?? '').slice(0, 30_000);
      if (!resume.trim() || !jobDescription.trim()) {
        return NextResponse.json({ error: 'Resume and job description are required.' }, { status: 400 });
      }
      const aiResult = await analyzeResumeWithAI(resume, jobDescription);
      return NextResponse.json(aiResult ?? analyzeResume(resume, jobDescription), {
        headers: { 'Cache-Control': 'no-store' }
      });
    }
    if (action === 'build') {
      const raw = String(body.raw ?? '').slice(0, 30_000);
      if (!raw.trim()) return NextResponse.json({ error: 'Add your notes to build a resume.' }, { status: 400 });
      const aiResult = await buildResumeWithAI(raw);
      return NextResponse.json(aiResult ?? buildResume(raw), { headers: { 'Cache-Control': 'no-store' } });
    }
    return NextResponse.json({ error: 'Choose the analyze or build action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Could not process the resume request. Please retry.' }, { status: 400 });
  }
}

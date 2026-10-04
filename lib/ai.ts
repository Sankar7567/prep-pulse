import { renderResume, type InterviewFeedback, type InterviewInput, type ResumeAnalysis, type ResumeDraft } from '@/lib/engines';

function configuredProvider(): 'gemini' | 'openai' | null {
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return null;
}

function parseJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(cleaned) as unknown;
}

async function generateJson(systemPrompt: string, userPrompt: string): Promise<unknown | null> {
  const provider = configuredProvider();
  if (!provider) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);
  try {
    if (provider === 'gemini') {
      const key = process.env.GEMINI_API_KEY!;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(process.env.GEMINI_MODEL || 'gemini-2.5-flash')}:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.25 }
        })
      });
      if (!response.ok) return null;
      const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      const text = payload.candidates?.[0]?.content?.parts?.map(part => part.text ?? '').join('');
      return text ? parseJson(text) : null;
    }
    const key = process.env.OPENAI_API_KEY!;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini', temperature: 0.25, response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }]
      })
    });
    if (!response.ok) return null;
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const text = payload.choices?.[0]?.message?.content;
    return text ? parseJson(text) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function stringArray(value: unknown, maximum = 20): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').map(item => item.trim()).filter(Boolean).slice(0, maximum) : [];
}
function finiteScore(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : fallback;
}
function objectValue(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export async function analyzeResumeWithAI(resume: string, jobDescription: string): Promise<ResumeAnalysis | null> {
  const result = await generateJson(
    'You are an evidence-grounded ATS resume coach. Do not invent user credentials. Compare only supplied text. Return valid JSON with score (0-100), matched (string[]), missing (string[]), flags (string[]), fixes (string[]). Keep fixes specific and truthful.',
    JSON.stringify({ task: 'Assess resume to job description alignment and parsing quality.', resume, jobDescription })
  );
  const value = objectValue(result);
  if (!value || typeof value.score !== 'number') return null;
  return {
    score: finiteScore(value.score), matched: stringArray(value.matched), missing: stringArray(value.missing, 14),
    flags: stringArray(value.flags, 12), fixes: stringArray(value.fixes, 8),
    counts: { resume: resume.trim().split(/\s+/).filter(Boolean).length, job: jobDescription.trim().split(/\s+/).filter(Boolean).length }
  };
}

export async function buildResumeWithAI(raw: string): Promise<{ draft: ResumeDraft; html: string } | null> {
  const result = await generateJson(
    'You are a careful resume editor. Reorganize only facts present in the user notes. Do not add employers, dates, results, or qualifications. Return JSON with draft: {name,headline,email,phone,location,summary,skills:string[],experience:string[],education:string[]}. Keep bullet points concise and preserve factual claims.',
    JSON.stringify({ task: 'Structure these candidate notes into a concise, ATS-compatible resume profile.', notes: raw })
  );
  const wrapper = objectValue(result);
  const source = objectValue(wrapper?.draft) ?? wrapper;
  if (!source || typeof source.name !== 'string') return null;
  const draft: ResumeDraft = {
    name: String(source.name).slice(0, 100), headline: String(source.headline ?? 'Professional Profile').slice(0, 120),
    email: String(source.email ?? '').slice(0, 160), phone: String(source.phone ?? '').slice(0, 60),
    location: String(source.location ?? '').slice(0, 100), summary: String(source.summary ?? '').slice(0, 1000),
    skills: stringArray(source.skills, 20), experience: stringArray(source.experience, 12), education: stringArray(source.education, 8)
  };
  return { draft, html: renderResume(draft) };
}

export async function evaluateInterviewWithAI(input: InterviewInput): Promise<InterviewFeedback | null> {
  const result = await generateJson(
    'You are a constructive interview coach. Evaluate only the candidate answer and target role. Do not infer personality or fabricate facts. Scores are integers 0-100. Return JSON: score, relevance, delivery, pacing, keywords, critique:string[] (2-4 concise actionable notes), nextQuestion:string (one suitable next question).',
    JSON.stringify({ role: input.role, industry: input.industry, difficulty: input.difficulty, priorTurn: input.turn, answer: input.answer })
  );
  const value = objectValue(result);
  if (!value || typeof value.score !== 'number' || typeof value.nextQuestion !== 'string') return null;
  const critique = stringArray(value.critique, 4);
  return {
    score: finiteScore(value.score), relevance: finiteScore(value.relevance), delivery: finiteScore(value.delivery),
    pacing: finiteScore(value.pacing), keywords: finiteScore(value.keywords),
    critique: critique.length ? critique : ['Consider adding a concrete example and measurable result.'],
    nextQuestion: value.nextQuestion.slice(0, 400), xp: Math.max(8, Math.round(finiteScore(value.score) / 5))
  };
}

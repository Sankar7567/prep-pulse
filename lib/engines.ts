export type ResumeAnalysis = {
  score: number;
  matched: string[];
  missing: string[];
  flags: string[];
  fixes: string[];
  counts: { resume: number; job: number };
};

export type ResumeDraft = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: string[];
  education: string[];
};

export type InterviewInput = {
  answer: string;
  role?: string;
  industry?: string;
  difficulty?: string;
  turn?: number;
  mode?: string;
};

export type InterviewFeedback = {
  score: number;
  relevance: number;
  delivery: number;
  pacing: number;
  keywords: number;
  critique: string[];
  nextQuestion: string;
  xp: number;
};

const STOP_WORDS = new Set((
  'a an the and or but for nor so yet at by from in into of on to with as is are was were be been being have has had do does did will would could should may might can this that these those it its we our you your their they them he she his her i me my us about across after against all also any both each few more most other some such than too very s t d ll ve re m not no if then when where who what which while how experience skills responsibilities requirements preferred qualifications'
).split(/\s+/));
const TOKEN_CACHE_LIMIT = 128;
const tokenCache = new Map<string, readonly string[]>();

function tokenize(text: string): readonly string[] {
  const cached = tokenCache.get(text);
  if (cached) {
    tokenCache.delete(text);
    tokenCache.set(text, cached);
    return cached;
  }
  const tokens = (text.toLowerCase().match(/[a-z][a-z+#.-]{1,}/g) ?? [])
    .map(word => word.replace(/^[.+-]+|[.+-]+$/g, ''))
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
  tokenCache.set(text, tokens);
  if (tokenCache.size > TOKEN_CACHE_LIMIT) {
    const oldestKey = tokenCache.keys().next().value;
    if (oldestKey !== undefined) tokenCache.delete(oldestKey);
  }
  return tokens;
}

function frequency(tokens: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const word of tokens) counts.set(word, (counts.get(word) ?? 0) + 1);
  return counts;
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

export function analyzeResume(resume: string, jobDescription: string): ResumeAnalysis {
  const resumeTokens = tokenize(resume);
  const jobTokens = tokenize(jobDescription);
  const resumeTerms = frequency(resumeTokens);
  const jobTerms = frequency(jobTokens);
  const rankedTerms = [...jobTerms.entries()]
    .sort(([wordA, countA], [wordB, countB]) => countB - countA || wordA.localeCompare(wordB))
    .map(([word]) => word);
  const roleTerms = rankedTerms.slice(0, 40);
  const roleTermSet = new Set(roleTerms);
  const matched = roleTerms.filter(word => resumeTerms.has(word));
  const missing = rankedTerms.filter(word => !resumeTerms.has(word)).slice(0, 14);
  const score = Math.round(roleTerms.length ? (matched.length / roleTerms.length) * 100 : 0);
  const flags: string[] = [];
  if (resume.trim().length < 120) flags.push('Resume text is very short; add complete experience and education sections.');
  if (!/@/.test(resume)) flags.push('Contact email was not detected.');
  if (!/\b(experience|employment|work history)\b/i.test(resume)) flags.push('No experience section heading detected.');
  if (!/\b(education|university|college|degree)\b/i.test(resume)) flags.push('No education section heading detected.');
  if (!/\b(\d+%|\$\s?\d|\d+\s+(users|clients|projects|hours|people|requests|teams))\b/i.test(resume)) flags.push('Add measurable outcomes (numbers, scale, or percentages).');
  const fixes = [
    ...missing.slice(0, 4).map(word => `Add “${word}” only where it truthfully describes your experience.`),
    'Rewrite responsibilities as action + method + measurable result.',
    'Use clear section headings and keep dates consistent.'
  ];
  // The set is intentionally used to keep matching independent of the source list length.
  const matchedRoleTerms = [...resumeTerms.keys()].filter(word => roleTermSet.has(word));
  return {
    score,
    matched: matchedRoleTerms.slice(0, 20),
    missing,
    flags,
    fixes,
    counts: { resume: resumeTokens.length, job: jobTokens.length }
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] as string));
}

function linesFrom(raw: string): string[] {
  return raw.split(/\r?\n|[•▪]/).map(line => line.trim().replace(/^[-*\d.)\s]+/, '')).filter(line => line.length > 2);
}

export function renderResume(draft: ResumeDraft): string {
  const list = (items: string[]) => items.length
    ? `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '<p class="empty">Add this section from your notes.</p>';
  return `<article class="resume"><header><h1>${escapeHtml(draft.name)}</h1><p>${escapeHtml([draft.email, draft.phone, draft.location].filter(Boolean).join(' · '))}</p></header><h2>${escapeHtml(draft.headline)}</h2><p>${escapeHtml(draft.summary)}</p><h2>Core Skills</h2>${list(draft.skills)}<h2>Experience &amp; Achievements</h2>${list(draft.experience)}<h2>Education</h2>${list(draft.education)}</article>`;
}

export function buildResume(raw: string): { draft: ResumeDraft; html: string } {
  const lines = linesFrom(raw);
  const name = lines[0]?.slice(0, 70) || 'Your Name';
  const email = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
  const phone = raw.match(/(?:\+?\d[\d ().-]{7,}\d)/)?.[0] || '';
  const location = lines.find(line => /\b(remote|,\s*[A-Z]{2}|city|based in)\b/i.test(line)) || '';
  const skillLine = lines.find(line => /^(skills|technologies|tools)\s*:/i.test(line));
  const skills = skillLine
    ? skillLine.replace(/^[^:]+:/, '').split(/[,|;]/).map(item => item.trim()).filter(Boolean)
    : unique(tokenize(raw)).slice(0, 12);
  const sectionHeading = /^(education|experience|skills|summary|profile)\s*:?$/i;
  const experience = lines.filter(line => line !== name && line !== skillLine && !sectionHeading.test(line) && !line.includes('@') && line !== phone).slice(0, 8);
  const education = lines.filter(line => /\b(university|college|bachelor|master|ph\.d|degree|diploma|education)\b/i.test(line)).slice(0, 4);
  const summary = experience.slice(0, 2).join(' ') || 'Motivated professional with a record of learning quickly, collaborating effectively, and delivering thoughtful results.';
  const draft: ResumeDraft = { name, headline: 'Professional Profile', email, phone, location, summary, skills, experience, education };
  return { draft, html: renderResume(draft) };
}

const QUESTION_BANK: Record<'behavioral' | 'technical' | 'system-design' | 'product', string[]> = {
  behavioral: [
    'Tell me about a time you solved a difficult problem with limited information.',
    'Describe a disagreement with a teammate and how you moved the work forward.',
    'Tell me about a project that did not go as planned. What did you learn?',
    'Give an example of when you took initiative beyond your assigned responsibilities.',
    'Tell me about feedback that changed how you work.',
    'Describe a time you had to deliver under a tight deadline.',
    'How have you handled competing priorities from different stakeholders?',
    'What accomplishment are you most proud of, and what was your contribution?',
    'Tell me about a time you helped a teammate succeed.',
    'Describe a decision you made that you would approach differently today.'
  ],
  technical: [
    'How would you investigate a production issue affecting a subset of users?',
    'Walk me through a technical trade-off you made and its consequences.',
    'How would you test a service that depends on an unreliable third-party API?',
    'Explain how you would improve performance in a React application.',
    'How would you approach debugging a memory leak in a long-running process?',
    'Describe how you would design a resilient API for a high-traffic feature.',
    'How do you decide which parts of a codebase need automated tests?',
    'What steps would you take to safely roll out a risky change?',
    'How would you handle a database query that becomes slow as data grows?',
    'Explain a complex technical concept to a non-technical stakeholder.'
  ],
  'system-design': [
    'Design a notification system that supports millions of users and delivery channels.',
    'Design a URL shortener. Discuss data model, scale, and abuse prevention.',
    'How would you design a real-time collaborative document editor?',
    'Design a video upload and processing pipeline with reliable retries.',
    'How would you build a rate limiter for a distributed API gateway?',
    'Design a search autocomplete service and explain the latency trade-offs.',
    'How would you design a multi-tenant analytics platform?',
    'Design a feed service that balances freshness, ranking, and high read volume.',
    'How would you keep a payment workflow idempotent and auditable?',
    'Design a file-storage service with versioning and regional availability.'
  ],
  product: [
    'How would you prioritize competing customer requests and stakeholder goals?',
    'Describe a decision you made using data while balancing user needs.',
    'How would you measure whether a new feature is successful?',
    'Tell me about a time you changed direction after learning from users.',
    'How do you explain a roadmap trade-off to an executive audience?'
  ]
};

export function getInterviewQuestion(input: Pick<InterviewInput, 'role' | 'mode' | 'turn'> = {}): string {
  const role = `${input.role ?? ''} ${input.mode ?? ''}`.toLowerCase();
  const category: keyof typeof QUESTION_BANK = /system|architect|distributed|scale/i.test(role)
    ? 'system-design'
    : /engineer|developer|technical|software/i.test(role)
      ? 'technical'
      : /product|design|marketing/i.test(role)
        ? 'product'
        : 'behavioral';
  const questions = QUESTION_BANK[category];
  return questions[Math.abs(Math.floor(input.turn ?? 0)) % questions.length];
}

export function interviewTurn(input: InterviewInput): InterviewFeedback {
  const answer = input.answer.trim();
  const words = answer.split(/\s+/).filter(Boolean);
  const answerTokens = tokenize(answer);
  const hasEvidence = /\b(because|result|increased|reduced|improved|led|built|delivered|learned|measured|%|\d+)\b/i.test(answer);
  const hasStar = /\b(situation|task|action|result|first|then|finally)\b/i.test(answer);
  const relevance = Math.min(100, 38 + Math.min(32, answerTokens.length * 1.6) + (hasEvidence ? 18 : 0) + (hasStar ? 12 : 0));
  const pacing = Math.max(35, Math.min(100, 100 - Math.abs(words.length - 115) * 0.48));
  const delivery = Math.min(100, 48 + (hasEvidence ? 18 : 0) + (hasStar ? 16 : 0) + (words.length > 45 ? 12 : 0));
  const keywords = Math.min(100, 35 + unique(answerTokens).length * 2.8);
  const score = Math.round((relevance + pacing + delivery + keywords) / 4);
  const critique: string[] = [];
  if (words.length < 45) critique.push('Add context and a specific example; aim for 60–120 words.');
  if (!hasStar) critique.push('Try a clear Situation → Task → Action → Result structure.');
  if (!hasEvidence) critique.push('Include an outcome or metric to make your impact concrete.');
  if (words.length > 180) critique.push('Tighten the answer: lead with the action and keep only relevant detail.');
  if (!critique.length) critique.push('Strong structure. Make the result memorable with one crisp metric or lesson.');
  return {
    score, relevance: Math.round(relevance), delivery: Math.round(delivery), pacing: Math.round(pacing),
    keywords: Math.round(keywords), critique,
    nextQuestion: getInterviewQuestion({ role: input.role, mode: input.mode, turn: (input.turn ?? 0) + 1 }),
    xp: Math.max(8, Math.round(score / 5))
  };
}

export function createNudge(input: { streak?: number; xp?: number; skill?: string; hour?: number } = {}) {
  const hour = input.hour ?? new Date().getHours();
  const skill = input.skill || 'STAR Method';
  if ((input.streak ?? 0) >= 3) return { title: `🔥 Protect your ${input.streak}-day streak`, body: `Spend 2 minutes on ${skill} and keep your momentum.`, urgency: 'high' as const };
  if (hour >= 17) return { title: '🌙 A small win before you log off', body: `One quick ${skill} practice earns XP and builds interview confidence.`, urgency: 'normal' as const };
  return { title: '🎯 Your next career step is ready', body: `Practice ${skill} for two minutes. Your future self says thanks.`, urgency: 'normal' as const };
}

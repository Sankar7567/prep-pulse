'use client';

import { useState } from 'react';
import { MessageSquareText, Mic, Play, Send, Sparkles } from 'lucide-react';
import { PageHeading } from '@/components/ui/PageHeading';
import { postWithFallback } from '@/lib/client';
import { getInterviewQuestion, interviewTurn, type InterviewFeedback } from '@/lib/engines';
import type { UserProgress } from '@/lib/types';
import { FeedbackPanel } from './FeedbackPanel';
import { SpeechInput } from './SpeechInput';

export function InterviewCoachTab({ progress, onToast, recordActivity }: { progress: UserProgress; onToast: (message: string) => void; recordActivity: (xp?: number, courseId?: string, interview?: boolean) => void }) {
  const [role, setRole] = useState('Frontend Engineer');
  const [industry, setIndustry] = useState('Technology');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [busy, setBusy] = useState(false);
  const [turn, setTurn] = useState(0);

  const start = () => {
    setQuestion(getInterviewQuestion({ role, turn: 0 }));
    setFeedback(null);
    setAnswer('');
    setTurn(0);
    onToast('Your practice interview is ready. Take a breath and think out loud.');
  };

  const submit = async () => {
    if (!answer.trim()) { onToast('Add your answer before asking for feedback.'); return; }
    setBusy(true);
    try {
      const body = { answer, role, industry, difficulty, turn, mode: /system|architect/i.test(role) ? 'system-design' : '' };
      const result = await postWithFallback<InterviewFeedback>('/api/interview', body, () => interviewTurn(body));
      setFeedback(result);
      setQuestion(result.nextQuestion);
      setAnswer('');
      setTurn(current => current + 1);
      recordActivity(result.xp, undefined, true);
    } catch { onToast('Feedback could not be generated. Try once more.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="page-content">
      <PageHeading eyebrow="PRACTICE WITH PURPOSE" title="Mock Interview Coach" subtitle="Build confidence one thoughtful answer at a time." action={<span className="secure-tag"><Mic size={18} aria-hidden="true" /> Speech-ready</span>} />
      <div className="interview-layout">
        <section className="panel interview-chat" aria-label="Interview practice">
          <div className="interview-head"><div className="coach-avatar"><Sparkles size={21} aria-hidden="true" /></div><div><strong>Pulse Coach</strong><small><i aria-hidden="true" /> AI practice partner · patient by design</small></div><span className="turn-pill">{question ? `QUESTION ${turn + 1}` : 'READY'}</span></div>
          <div className="interview-config">
            <label>Target role<select value={role} onChange={event => setRole(event.target.value)}><option>Frontend Engineer</option><option>Product Manager</option><option>Data Analyst</option><option>UX Designer</option><option>Software Architect</option><option>Behavioral Interview</option></select></label>
            <label>Industry<select value={industry} onChange={event => setIndustry(event.target.value)}><option>Technology</option><option>Healthcare</option><option>Finance</option><option>Education</option><option>Retail</option></select></label>
            <label>Difficulty<select value={difficulty} onChange={event => setDifficulty(event.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
          </div>
          <div className="chat-scroll" aria-live="polite">
            <div className="coach-message"><span className="mini-coach"><Sparkles size={17} aria-hidden="true" /></span><p>{question || 'Welcome! Choose a role, then start a practice session. I’ll ask a question and give you clear, kind feedback.'}</p></div>
            {feedback && <div className="user-message"><strong>{feedback.score}%</strong><span>Answer reviewed · {feedback.xp} XP earned</span></div>}
            <p className="coach-hint"><Sparkles size={16} aria-hidden="true" /> Think out loud. There are no trick questions in practice.</p>
          </div>
          <div className="answer-box">
            <SpeechInput value={answer} onChange={setAnswer} />
            <div className="answer-actions"><span>Answer as yourself; the coach never expects a perfect script.</span>{question ? <button className="btn btn-primary" type="button" onClick={submit} disabled={busy}>{busy ? <span className="spinner" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}{busy ? 'Reviewing…' : 'Get feedback'}</button> : <button className="btn btn-primary" type="button" onClick={start}><Play size={18} fill="currentColor" aria-hidden="true" /> Start session</button>}</div>
          </div>
        </section>
        <aside className="interview-aside"><FeedbackPanel feedback={feedback} /><section className="panel session-card"><div><span className="tiny-eyebrow">YOUR PRACTICE</span><h2>{progress.interviews} sessions completed</h2><p>Every answer is a rep in the right direction.</p></div><div className="session-icon"><MessageSquareText size={22} aria-hidden="true" /></div></section></aside>
      </div>
    </div>
  );
}

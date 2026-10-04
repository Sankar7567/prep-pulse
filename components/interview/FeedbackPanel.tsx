import { Activity, Radar, Sparkles } from 'lucide-react';
import type { InterviewFeedback } from '@/lib/engines';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function FeedbackPanel({ feedback }: { feedback: InterviewFeedback | null }) {
  const metrics: Array<[string, number]> = feedback ? [
    ['Content relevance', feedback.relevance], ['Delivery structure', feedback.delivery],
    ['Answer pacing', feedback.pacing], ['Role keywords', feedback.keywords]
  ] : [];
  return (
    <section className="panel feedback-panel" aria-labelledby="feedback-title" aria-live="polite">
      <div className="panel-head"><div><h2 id="feedback-title">Live feedback</h2><p>Small improvements, clearly explained</p></div><span className="feedback-pulse"><Activity size={19} aria-hidden="true" /></span></div>
      {feedback ? (
        <>
          <div className="overall-score"><strong>{feedback.score}</strong><span>/100</span><small>ANSWER SCORE</small></div>
          <div className="feedback-metrics">{metrics.map(([label, score]) => <div className="metric-row" key={label}><div><span>{label}</span><strong>{score}%</strong></div><ProgressBar value={score} label={`${label} score`} /></div>)}</div>
          <div className="critique-box"><strong><Sparkles size={17} aria-hidden="true" /> Coach’s notes</strong>{feedback.critique.map(note => <p key={note}>{note}</p>)}</div>
        </>
      ) : (
        <div className="feedback-empty"><div className="feedback-radar"><Radar size={36} aria-hidden="true" /></div><strong>Your feedback, at a glance</strong><p>After your first answer, you’ll see a score breakdown across relevance, delivery, pacing, and keywords.</p></div>
      )}
    </section>
  );
}

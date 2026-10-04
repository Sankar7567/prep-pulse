'use client';

import { useState } from 'react';
import { Activity, ArrowRight, Check, CheckCircle2, CircleHelp, Radar, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { analyzeResume, type ResumeAnalysis } from '@/lib/engines';
import { DEMO_JOB_DESCRIPTION, DEMO_RESUME } from '@/lib/types';
import { postWithFallback } from '@/lib/client';

export function AtsOptimizer({ onToast, recordActivity }: { onToast: (message: string) => void; recordActivity: (xp?: number) => void }) {
  const [resume, setResume] = useState(DEMO_RESUME);
  const [jobDescription, setJobDescription] = useState(DEMO_JOB_DESCRIPTION);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [busy, setBusy] = useState(false);

  const analyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) { onToast('Add both your resume and a target job description.'); return; }
    setBusy(true);
    try {
      const result = await postWithFallback<ResumeAnalysis>('/api/resume', { action: 'analyze', resume, jobDescription }, () => analyzeResume(resume, jobDescription));
      setAnalysis(result);
      recordActivity(5);
      onToast('Resume match analyzed. Review the suggested edits before applying.');
    } catch {
      onToast('Resume analysis could not be completed. Please try again.');
    } finally { setBusy(false); }
  };

  return (
    <div className="resume-layout">
      <section className="panel form-panel" aria-labelledby="ats-form-title">
        <div className="panel-head"><div><h2 id="ats-form-title">Match your resume to a role</h2><p>Compare skills and flag common parsing issues.</p></div><span className="demo-tag">EDITABLE SAMPLE</span></div>
        <label className="field-label" htmlFor="resume-text">Resume text</label>
        <textarea id="resume-text" className="text-area resume-text" value={resume} onChange={event => setResume(event.target.value)} placeholder="Paste your resume text here…" maxLength={30_000} />
        <div className="field-row"><label className="field-label" htmlFor="job-text">Target job description</label><button className="text-link" type="button" onClick={() => { setResume(DEMO_RESUME); setJobDescription(DEMO_JOB_DESCRIPTION); }}>Load sample</button></div>
        <textarea id="job-text" className="text-area job-text" value={jobDescription} onChange={event => setJobDescription(event.target.value)} placeholder="Paste the job description…" maxLength={30_000} />
        <button className="btn btn-primary wide-btn" type="button" onClick={analyze} disabled={busy}>{busy ? <span className="spinner" aria-hidden="true" /> : <Radar size={19} aria-hidden="true" />}{busy ? 'Analyzing…' : 'Analyze match'} <ArrowRight size={18} aria-hidden="true" /></button>
        <p className="privacy-note"><ShieldCheck size={16} aria-hidden="true" /> If a server AI key is configured, text is sent to that provider. Otherwise analysis runs with the local fallback engine.</p>
      </section>
      <section className="panel results-panel" aria-labelledby="ats-results-title" aria-live="polite">
        <div className="panel-head"><div><h2 id="ats-results-title">Match report</h2><p>Your experience, mapped to the opportunity.</p></div><span className="report-mark"><Activity size={20} aria-hidden="true" /></span></div>
        {analysis ? (
          <>
            <div className="score-line"><div className="score-circle"><strong>{analysis.score}%</strong><small>MATCH</small></div><div><h3>{analysis.score >= 75 ? 'Strong foundation' : analysis.score >= 50 ? 'Good start — sharpen the fit' : 'Room to strengthen your story'}</h3><p>{analysis.matched.length} matching role signals found in your resume.</p></div></div>
            <div className="report-section"><h3><CheckCircle2 size={19} aria-hidden="true" /> Matched keywords <span>{analysis.matched.length}</span></h3><div className="chips">{analysis.matched.length ? analysis.matched.slice(0, 12).map(keyword => <span className="chip matched" key={keyword}>{keyword}</span>) : <span className="muted">No keyword overlap detected yet.</span>}</div></div>
            <div className="report-section"><h3><Target size={19} aria-hidden="true" /> Opportunities to add <span>{analysis.missing.length}</span></h3><div className="chips">{analysis.missing.slice(0, 10).map(keyword => <span className="chip missing" key={keyword}>{keyword}</span>)}</div></div>
            <div className="report-section"><h3><CircleHelp size={19} aria-hidden="true" /> Parsing checks</h3>{analysis.flags.length ? analysis.flags.map(flag => <p className="flag-row" key={flag}><span aria-hidden="true">!</span>{flag}</p>) : <p className="success-row"><Check size={18} aria-hidden="true" /> Clear structure detected. Add measurable outcomes for extra impact.</p>}</div>
            <div className="report-section fixes"><h3><Sparkles size={19} aria-hidden="true" /> Your next edits</h3>{analysis.fixes.slice(0, 4).map((fix, index) => <p key={`${index}-${fix}`}><span>{index + 1}</span>{fix}</p>)}</div>
          </>
        ) : (
          <div className="empty-report"><div><Radar size={36} aria-hidden="true" /></div><h3>Your tailored report will appear here</h3><p>Run the analyzer to see semantic overlap, missing role keywords, and resume health checks.</p><span>Start with the sample content, then make it yours.</span></div>
        )}
      </section>
    </div>
  );
}

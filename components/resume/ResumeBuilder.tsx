'use client';

import { useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { buildResume } from '@/lib/engines';
import { postWithFallback } from '@/lib/client';
import { ResumePreview } from './ResumePreview';

const SAMPLE_NOTES = 'Alex Morgan\nalex.morgan@email.com\nSeattle, WA\nFrontend Engineer with 4 years building accessible products.\nEXPERIENCE\nBuilt a React dashboard for 12,000 users, reducing support tickets by 24%.\nLed an accessibility initiative and increased keyboard navigation coverage to 96%.\nEDUCATION\nB.S. Computer Science, University of Washington\nSKILLS: React, TypeScript, JavaScript, testing, accessibility';

export function ResumeBuilder({ onToast, recordActivity }: { onToast: (message: string) => void; recordActivity: (xp?: number) => void }) {
  const [raw, setRaw] = useState(SAMPLE_NOTES);
  const [html, setHtml] = useState('');
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    if (!raw.trim()) { onToast('Add a few notes about your experience first.'); return; }
    setBusy(true);
    try {
      const result = await postWithFallback<{ html: string }>('/api/resume', { action: 'build', raw }, () => buildResume(raw));
      setHtml(result.html);
      recordActivity(8);
      onToast('Your ATS-friendly resume draft is ready. Check every detail before applying.');
    } catch { onToast('Could not build the resume. Please retry.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="builder-layout">
      <section className="panel form-panel" aria-labelledby="builder-title">
        <div className="panel-head"><div><h2 id="builder-title">Turn your notes into a resume</h2><p>Use one idea per line; include skills, education, and outcomes.</p></div><span className="demo-tag">EDITABLE SAMPLE</span></div>
        <label className="field-label" htmlFor="raw-notes">Your experience notes</label>
        <textarea id="raw-notes" className="text-area notes-area" value={raw} onChange={event => setRaw(event.target.value)} placeholder="Name, email, experience, skills, education…" maxLength={30_000} />
        <div className="builder-tips"><Sparkles size={19} aria-hidden="true" /><span>Specific results, numbers, tools, and dates make the strongest resume bullets.</span></div>
        <button className="btn btn-primary wide-btn" type="button" onClick={generate} disabled={busy}>{busy ? <span className="spinner" aria-hidden="true" /> : <Sparkles size={19} aria-hidden="true" />}{busy ? 'Building…' : 'Generate resume draft'} <ArrowRight size={18} aria-hidden="true" /></button>
        <p className="privacy-note"><ShieldCheck size={17} aria-hidden="true" /> A server AI key sends notes to that provider; without one, the local engine creates your draft.</p>
      </section>
      <ResumePreview html={html} />
    </div>
  );
}

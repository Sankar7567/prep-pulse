'use client';

import { useState } from 'react';
import { BriefcaseBusiness, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHeading } from '@/components/ui/PageHeading';
import { AtsOptimizer } from './AtsOptimizer';
import { ResumeBuilder } from './ResumeBuilder';

export function ResumeStudioTab({ onToast, recordActivity }: { onToast: (message: string) => void; recordActivity: (xp?: number) => void }) {
  const [mode, setMode] = useState<'analyze' | 'build'>('analyze');
  return (
    <div className="page-content">
      <PageHeading eyebrow="CAREER TOOLKIT" title="Resume Studio" subtitle="Make your experience impossible to overlook." action={<span className="secure-tag"><ShieldCheck size={17} aria-hidden="true" /> Privacy-aware workflow</span>} />
      <div className="mode-tabs" role="tablist" aria-label="Resume studio tools">
        <button type="button" role="tab" aria-selected={mode === 'analyze'} className={mode === 'analyze' ? 'selected' : ''} onClick={() => setMode('analyze')}><BriefcaseBusiness size={18} aria-hidden="true" /> ATS optimizer</button>
        <button type="button" role="tab" aria-selected={mode === 'build'} className={mode === 'build' ? 'selected' : ''} onClick={() => setMode('build')}><Sparkles size={18} aria-hidden="true" /> Resume builder</button>
      </div>
      {mode === 'analyze' ? <AtsOptimizer onToast={onToast} recordActivity={recordActivity} /> : <ResumeBuilder onToast={onToast} recordActivity={recordActivity} />}
    </div>
  );
}

'use client';

import { useCallback } from 'react';
import { ArrowDownToLine } from 'lucide-react';

export function ResumePreview({ html }: { html: string }) {
  const print = useCallback(() => {
    document.body.classList.add('printing-resume');
    const cleanup = () => document.body.classList.remove('printing-resume');
    window.addEventListener('afterprint', cleanup, { once: true });
    window.print();
    window.setTimeout(cleanup, 1500);
  }, []);

  return (
    <section className="panel resume-preview-panel" aria-labelledby="resume-preview-title">
      <div className="panel-head"><div><h2 id="resume-preview-title">Live resume preview</h2><p>Clean, ATS-readable and ready to export.</p></div>
        {html && <button className="icon-button export-button" type="button" onClick={print} aria-label="Print or save your resume as PDF"><ArrowDownToLine size={20} aria-hidden="true" /></button>}
      </div>
      {html ? <div className="resume-print-trigger resume-preview" dangerouslySetInnerHTML={{ __html: html }} /> : (
        <div className="resume-placeholder"><div className="resume-paper" aria-hidden="true"><span /><span /><span className="short" /><hr /><span /><span /><span className="short" /></div><strong>Your polished draft will appear here</strong><p>Add your notes and generate a resume to preview and print.</p></div>
      )}
    </section>
  );
}

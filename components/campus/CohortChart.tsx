import { Activity } from 'lucide-react';

export function CohortChart({ period }: { period: string }) {
  return (
    <section className="panel engagement-panel" aria-labelledby="engagement-title">
      <div className="panel-head"><div><h2 id="engagement-title">Engagement pulse</h2><p>Active learner trend · {period.toLowerCase()}</p></div><span className="report-mark"><Activity size={20} aria-hidden="true" /></span></div>
      <div className="engagement-total"><strong>64%</strong><span>average daily active</span><em>↑ 8.4%</em></div>
      <div className="chart-area">
        <div className="chart-y" aria-hidden="true"><span>80%</span><span>60%</span><span>40%</span><span>20%</span></div>
        <div className="line-chart">
          <div className="gridline g1" /><div className="gridline g2" /><div className="gridline g3" /><div className="gridline g4" />
          <svg viewBox="0 0 360 148" preserveAspectRatio="none" role="img" aria-label={`Illustrative learner engagement trends for ${period}`}>
            <defs><linearGradient id="cohort-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#635bff" stopOpacity=".22" /><stop offset="1" stopColor="#635bff" stopOpacity="0" /></linearGradient></defs>
            <path d="M0 115 C25 105 25 93 52 98 S86 91 103 80 S130 89 151 73 S177 82 199 57 S225 69 246 49 S274 61 293 38 S326 49 360 19 L360 148 L0 148 Z" fill="url(#cohort-fill)" />
            <path d="M0 115 C25 105 25 93 52 98 S86 91 103 80 S130 89 151 73 S177 82 199 57 S225 69 246 49 S274 61 293 38 S326 49 360 19" fill="none" stroke="#635bff" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          </svg>
          <div className="chart-x" aria-hidden="true"><span>Sep 05</span><span>Sep 12</span><span>Sep 19</span><span>Sep 26</span><span>Oct 04</span></div>
        </div>
      </div>
      <div className="engagement-legend"><i aria-hidden="true" /> Daily active learners <span>Illustrative cohort trend</span></div>
    </section>
  );
}

import { ArrowRight } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

const SKILLS = [
  { name: 'Communication', value: 86, color: 'violet' },
  { name: 'Technical skills', value: 74, color: 'blue' },
  { name: 'Problem solving', value: 81, color: 'green' },
  { name: 'Interview confidence', value: 62, color: 'orange' }
];

export function ReadinessWidget({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="panel readiness-panel" aria-labelledby="readiness-title">
      <div className="panel-head">
        <div><h2 id="readiness-title">Your readiness snapshot</h2><p>Skills aligned to your target role</p></div>
        <button className="text-link" type="button" onClick={onExplore}>View skill map <ArrowRight size={16} aria-hidden="true" /></button>
      </div>
      <div className="readiness-body">
        <div className="readiness-chart">
          <svg viewBox="0 0 160 160" role="img" aria-label="78 percent career ready">
            <circle cx="80" cy="80" r="62" fill="none" stroke="#eef0f5" strokeWidth="12" />
            <circle cx="80" cy="80" r="62" fill="none" stroke="#635bff" strokeWidth="12" strokeLinecap="round" strokeDasharray="389.6" strokeDashoffset="85.7" transform="rotate(-90 80 80)" />
            <text x="80" y="76" textAnchor="middle" className="chart-number">78%</text>
            <text x="80" y="100" textAnchor="middle" className="chart-label">READY</text>
          </svg>
        </div>
        <div className="skill-bars">
          {SKILLS.map(skill => (
            <div className="skill-bar-row" key={skill.name}>
              <div className="skill-bar-label"><span>{skill.name}</span><strong>{skill.value}%</strong></div>
              <ProgressBar value={skill.value} label={`${skill.name} proficiency`} color={skill.color} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

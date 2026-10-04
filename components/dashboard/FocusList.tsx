import { Bell, ChevronRight } from 'lucide-react';

const TASKS = [
  { number: '01', title: 'Polish your opening story', meta: 'STAR Method · 4 min', tab: 'learn' as const },
  { number: '02', title: 'Practice a technical question', meta: 'Mock interview · 5 min', tab: 'interview' as const },
  { number: '03', title: 'Tune your resume keywords', meta: 'Resume Studio · 3 min', tab: 'resume' as const }
];

export function FocusList({ onNavigate, onNudge }: { onNavigate: (tab: 'resume' | 'interview' | 'learn') => void; onNudge: () => void }) {
  return (
    <section className="panel today-panel" aria-labelledby="focus-heading">
      <div className="panel-head"><div><h2 id="focus-heading">Today’s focus</h2><p>Three small wins, one big leap</p></div><span className="date-chip">TODAY</span></div>
      <div className="focus-list">
        {TASKS.map(task => (
          <button className="focus-item" key={task.number} type="button" onClick={() => onNavigate(task.tab)}>
            <span className="focus-number">{task.number}</span><span className="focus-copy"><strong>{task.title}</strong><small>{task.meta}</small></span><ChevronRight size={18} aria-hidden="true" />
          </button>
        ))}
      </div>
      <button className="nudge-link" type="button" onClick={onNudge}><Bell size={17} aria-hidden="true" /> Remind me later</button>
    </section>
  );
}

import { ArrowRight, Check, Zap } from 'lucide-react';
import type { Course } from '@/lib/types';

export function ModuleCard({ course, index, complete, onOpen }: { course: Course; index: number; complete: boolean; onOpen: () => void }) {
  return (
    <article className={`learning-card panel ${complete ? 'is-complete' : ''}`}>
      <div className="learning-card-top"><span className={`course-icon ${course.color}`} aria-hidden="true">{course.icon}</span><span className={complete ? 'complete-pill' : 'duration-pill'}>{complete ? <><Check size={16} aria-hidden="true" /> COMPLETED</> : `${course.duration} · MODULE ${index + 1}`}</span></div>
      <span className="course-label">{course.label}</span><h3>{course.title}</h3><p>{course.description}</p>
      <div className="module-reward"><span><Zap size={16} aria-hidden="true" /> +35 XP</span><span>{complete ? 'Knowledge unlocked' : 'Concept · Scenario · Quiz'}</span></div>
      <button className={`btn ${complete ? 'btn-outline' : 'btn-dark'} course-start`} type="button" onClick={onOpen}>{complete ? 'Review module' : 'Start module'} <ArrowRight size={18} aria-hidden="true" /></button>
    </article>
  );
}

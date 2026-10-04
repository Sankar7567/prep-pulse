'use client';

import { useState } from 'react';
import { Award, BookOpen, Zap } from 'lucide-react';
import { COURSES, type Course, type UserProgress } from '@/lib/types';
import { PageHeading } from '@/components/ui/PageHeading';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ModuleCard } from './ModuleCard';
import { QuizModal } from './QuizModal';

export function LearningPathTab({ progress, recordActivity, onToast }: { progress: UserProgress; recordActivity: (xp?: number, courseId?: string) => void; onToast: (message: string) => void }) {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const completedCount = progress.completed.filter(id => COURSES.some(course => course.id === id)).length;
  const progressPercent = Math.round(completedCount / COURSES.length * 100);
  const finishModule = () => {
    if (activeCourse && !progress.completed.includes(activeCourse.id)) {
      recordActivity(35, activeCourse.id);
      onToast('Module complete! 35 XP added to your progress.');
    }
    setActiveCourse(null);
  };

  return (
    <div className="page-content">
      <PageHeading eyebrow="YOUR PERSONAL LEARNING PATH" title="Small lessons. Big confidence." subtitle="Build the skills hiring teams notice, one bite at a time." action={<div className="xp-pill"><Zap size={18} fill="currentColor" aria-hidden="true" />{progress.xp} XP</div>} />
      <section className="learning-banner panel" aria-label="Career readiness progress"><div className="learning-icon"><BookOpen size={26} aria-hidden="true" /></div><div className="learning-banner-copy"><span className="tiny-eyebrow">CAREER READINESS PATH</span><h2>Interview-ready, at your pace.</h2><p>Three focused modules to strengthen your job-search toolkit.</p></div><div className="learning-progress"><div className="progress-copy"><strong>{progressPercent}%</strong><span>{completedCount} of {COURSES.length} complete</span></div><ProgressBar value={progressPercent} label="Learning path completion" /></div></section>
      <div className="learning-section-title"><div><h2>Your modules</h2><p>Tap any module to learn, practice, and earn XP.</p></div><span className="modules-count">{COURSES.length - completedCount} LEFT TO COMPLETE</span></div>
      <div className="learning-courses">{COURSES.map((course, index) => <ModuleCard key={course.id} course={course} index={index} complete={progress.completed.includes(course.id)} onOpen={() => setActiveCourse(course)} />)}</div>
      <aside className="learning-note"><Award size={20} aria-hidden="true" /><span><strong>Learning sticks when it’s applied.</strong> Try one answer in Mock Interview Coach after a module.</span></aside>
      {activeCourse && <QuizModal course={activeCourse} completed={progress.completed.includes(activeCourse.id)} onClose={() => setActiveCourse(null)} onComplete={finishModule} onToast={onToast} />}
    </div>
  );
}

'use client';

import { Activity, ArrowRight, Flame, Sparkles, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import { COURSES, type TabId, type UserProgress } from '@/lib/types';
import { PageHeading } from '@/components/ui/PageHeading';
import { StatCard } from './StatCard';
import { ReadinessWidget } from './ReadinessWidget';
import { FocusList } from './FocusList';

export function OverviewTab({ progress, onNavigate, onNudge }: { progress: UserProgress; onNavigate: (tab: TabId) => void; onNudge: () => void }) {
  const date = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  return (
    <div className="page-content">
      <PageHeading eyebrow={date.toUpperCase()} title="Your next move starts here, Alex." subtitle="A little progress every day adds up. Here’s your career pulse." action={<button className="btn btn-primary" type="button" onClick={() => onNavigate('learn')}><Sparkles size={18} aria-hidden="true" /> Continue learning</button>} />
      <section className="welcome-banner" aria-label="Weekly momentum">
        <div className="welcome-copy"><span className="banner-label"><Sparkles size={16} aria-hidden="true" /> YOUR WEEKLY MOMENTUM</span><h2>You’re building real career momentum.</h2><p>Two focused sessions this week puts you ahead of 64% of learners. Keep your streak alive with one quick practice.</p><button className="btn btn-light" type="button" onClick={() => onNavigate('interview')}>Start a 5-min practice <ArrowRight size={18} aria-hidden="true" /></button></div>
        <div className="banner-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="banner-spark spark-a">✦</span><span className="banner-spark spark-b">✧</span><div className="banner-figure"><TrendingUp size={48} /></div><span className="float-tag">+{progress.xp % 100 || 20} XP</span></div>
      </section>
      <div className="stats-grid">
        <StatCard icon={<Flame size={20} />} label="Current streak" value={`${progress.streak} days`} note="Your best: 7 days" color="orange" />
        <StatCard icon={<Zap size={20} />} label="Total XP earned" value={String(progress.xp)} note="Level 4 · 80 XP to level 5" color="purple" />
        <StatCard icon={<Target size={20} />} label="Career readiness" value="78%" note="↑ 8% this month" color="green" />
        <StatCard icon={<Trophy size={20} />} label="Modules completed" value={`${progress.completed.length} / 3`} note="Next badge: Skill Seeker" color="blue" />
      </div>
      <div className="home-grid">
        <ReadinessWidget onExplore={() => onNavigate('learn')} />
        <FocusList onNavigate={onNavigate} onNudge={onNudge} />
      </div>
      <div className="section-title"><div><h2>Pick up where you left off</h2><p>Curated for your career path</p></div><button className="text-link" type="button" onClick={() => onNavigate('learn')}>Explore all <ArrowRight size={16} aria-hidden="true" /></button></div>
      <div className="course-preview-grid">
        {COURSES.slice(0, 2).map((course, index) => (
          <button className="course-preview panel" key={course.id} type="button" onClick={() => onNavigate('learn')}>
            <span className={`course-icon ${course.color}`} aria-hidden="true">{course.icon}</span>
            <span className="course-preview-copy"><span className="course-label">{course.label} · {course.duration}</span><strong>{course.title}</strong><span>{course.description}</span></span>
            <ArrowRight className="course-arrow" size={20} aria-hidden="true" /><span className="preview-progress"><i style={{ width: index === 0 ? '54%' : '21%' }} /></span>
          </button>
        ))}
      </div>
      <div className="overview-footnote"><Activity size={16} aria-hidden="true" /> Your learning progress is saved on this device.</div>
    </div>
  );
}

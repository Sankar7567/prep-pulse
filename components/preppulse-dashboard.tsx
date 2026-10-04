'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Bell, BookOpen, BriefcaseBusiness, ChevronRight, Flame, GraduationCap, LayoutDashboard, Menu, MessageSquareText, X, Zap } from 'lucide-react';
import { CampusPortalTab } from '@/components/campus/CampusPortalTab';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { InterviewCoachTab } from '@/components/interview/InterviewCoachTab';
import { LearningPathTab } from '@/components/learning/LearningPathTab';
import { ResumeStudioTab } from '@/components/resume/ResumeStudioTab';
import { Toast } from '@/components/ui/Toast';
import { useUserProgress } from '@/hooks/useUserProgress';
import { createNudge } from '@/lib/engines';
import type { TabId } from '@/lib/types';

const NAV_ITEMS: Array<{ id: TabId; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'home', label: 'Overview', icon: LayoutDashboard },
  { id: 'resume', label: 'Resume Studio', icon: BriefcaseBusiness },
  { id: 'interview', label: 'Mock Interview', icon: MessageSquareText },
  { id: 'learn', label: 'Learning path', icon: BookOpen },
  { id: 'campus', label: 'University portal', icon: GraduationCap }
];

export default function PrepPulseDashboard() {
  const [tab, setTab] = useState<TabId>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const { progress, recordActivity } = useUserProgress();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = (next: TabId) => { setTab(next); setMobileMenuOpen(false); };

  const sendNudge = async () => {
    const reminder = createNudge({ streak: progress.streak, xp: progress.xp });
    try {
      if (Capacitor.isNativePlatform()) {
        const permission = await LocalNotifications.checkPermissions();
        const result = permission.display === 'granted' ? permission : await LocalNotifications.requestPermissions();
        if (result.display === 'granted') {
          await LocalNotifications.schedule({ notifications: [{ id: Date.now() % 2_000_000_000, title: reminder.title, body: reminder.body, schedule: { at: new Date(Date.now() + 1500) } }] });
          setToast('A local practice reminder is scheduled.');
          return;
        }
      } else if ('Notification' in window) {
        const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
        if (permission === 'granted') { new Notification(reminder.title, { body: reminder.body }); setToast('Your practice nudge is ready.'); return; }
      }
      setToast(`${reminder.title} — ${reminder.body}`);
    } catch {
      setToast(`${reminder.title} — ${reminder.body}`);
    }
  };

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`} aria-label="Main navigation">
        <div className="brand"><span className="brand-mark"><Zap size={21} fill="currentColor" aria-hidden="true" /></span><span>PrepPulse<span className="brand-ai"> AI</span></span><button className="mobile-close" type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={22} /></button></div>
        <p className="workspace-label">WORKSPACE</p>
        <nav className="side-nav" aria-label="Workspace">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={`nav-item ${tab === id ? 'active' : ''}`} aria-current={tab === id ? 'page' : undefined} onClick={() => navigate(id)}><Icon size={20} aria-hidden="true" /><span>{label}</span>{id === 'campus' && <span className="nav-pill">B2B</span>}</button>)}
        </nav>
        <div className="sidebar-spacer" />
        <div className="streak-card"><span className="streak-icon"><Flame size={20} fill="currentColor" aria-hidden="true" /></span><span><strong>{progress.streak} day streak</strong><small>Keep your momentum</small></span><span className="streak-count" aria-hidden="true">🔥</span></div>
        <div className="profile-row"><span className="avatar" aria-hidden="true">AM</span><span><strong>Alex Morgan</strong><small>Career Explorer · Lvl 4</small></span><ChevronRight size={18} className="profile-more" aria-hidden="true" /></div>
      </aside>
      {mobileMenuOpen && <button className="mobile-scrim" type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" />}
      <section className="main-area">
        <header className="topbar"><button className="menu-button" type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation"><Menu size={22} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={16} aria-hidden="true" /><strong>{NAV_ITEMS.find(item => item.id === tab)?.label}</strong></div><div className="top-actions"><button className="streak-top" type="button" onClick={() => navigate('learn')}><Flame size={19} fill="currentColor" aria-hidden="true" /> {progress.streak} <span>day streak</span></button><button className="icon-button notification-button" type="button" onClick={sendNudge} aria-label="Schedule a practice reminder"><Bell size={20} aria-hidden="true" /></button><span className="avatar avatar-small" aria-label="Signed in as Alex Morgan">AM</span></div></header>
        {tab === 'home' && <OverviewTab progress={progress} onNavigate={navigate} onNudge={sendNudge} />}
        {tab === 'resume' && <ResumeStudioTab onToast={setToast} recordActivity={recordActivity} />}
        {tab === 'interview' && <InterviewCoachTab progress={progress} recordActivity={recordActivity} onToast={setToast} />}
        {tab === 'learn' && <LearningPathTab progress={progress} recordActivity={recordActivity} onToast={setToast} />}
        {tab === 'campus' && <CampusPortalTab />}
        <footer className="footer">Made for your next big move <span aria-hidden="true">·</span> PrepPulse AI <span className="footer-dot" aria-hidden="true">●</span> Your progress stays on this device</footer>
      </section>
      <Toast message={toast} onDismiss={() => setToast('')} />
    </main>
  );
}

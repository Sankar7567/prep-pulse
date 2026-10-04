'use client';

import { useState } from 'react';
import { Activity, ArrowDownToLine, Award, GraduationCap, ShieldCheck, Sparkles, Target, TrendingUp } from 'lucide-react';
import { PageHeading } from '@/components/ui/PageHeading';
import { StatCard } from '@/components/dashboard/StatCard';
import { CohortChart } from './CohortChart';

const DEPARTMENTS = [
  { name: 'Computer Science', readiness: 84, placement: 72, trend: '+12%' },
  { name: 'Business', readiness: 71, placement: 64, trend: '+8%' },
  { name: 'Design & Media', readiness: 78, placement: 69, trend: '+9%' },
  { name: 'Engineering', readiness: 76, placement: 67, trend: '+11%' }
];

export function CampusPortalTab() {
  const [period, setPeriod] = useState('Last 30 days');
  return (
    <div className="page-content">
      <PageHeading eyebrow="INSTITUTIONAL INSIGHTS" title="Campus readiness, in focus." subtitle="A clear view of cohort progress and where support can make a difference." action={<button className="btn btn-outline period-button" type="button" onClick={() => setPeriod(current => current === 'Last 30 days' ? 'Last 7 days' : 'Last 30 days')} aria-label={`Change analytics time period. Current: ${period}`}>{period}</button>} />
      <section className="campus-banner"><div><span className="banner-label"><GraduationCap size={18} aria-hidden="true" /> UNIVERSITY PARTNER PORTAL</span><h2>Turn student potential into placement outcomes.</h2><p>Sample institutional dashboard. Cohort trends are illustrative and not connected to student records.</p></div><div className="campus-banner-icon" aria-hidden="true"><GraduationCap size={48} /></div></section>
      <div className="campus-kpis">
        <StatCard icon={<Target size={20} />} label="Average readiness" value="78%" note="↑ 6 pts from previous period" color="purple" />
        <StatCard icon={<TrendingUp size={20} />} label="Placement probability" value="72%" note="Based on readiness signals" color="green" />
        <StatCard icon={<Activity size={20} />} label="Daily active learners" value="64%" note="+8% engagement this month" color="blue" />
        <StatCard icon={<Award size={20} />} label="Students on track" value="1,284" note="Across 4 departments" color="orange" />
      </div>
      <div className="campus-grid">
        <section className="panel department-panel" aria-labelledby="department-title"><div className="panel-head"><div><h2 id="department-title">Department readiness</h2><p>Skills and placement signals by cohort</p></div><span className="date-chip">SAMPLE DATA</span></div>
          <div className="dept-table" role="table" aria-label="Department readiness and placement probability"><div className="dept-table-head" role="row"><span role="columnheader">Department</span><span role="columnheader">Readiness</span><span role="columnheader">Placement</span><span role="columnheader">Trend</span></div>
            {DEPARTMENTS.map((department, index) => <div className="dept-row" role="row" key={department.name}><span className="dept-name" role="cell"><i className={`dept-dot dept-dot-${index}`} aria-hidden="true" />{department.name}</span><span role="cell"><strong>{department.readiness}%</strong><i className="table-bar" aria-hidden="true"><i style={{ width: `${department.readiness}%` }} /></i></span><span role="cell">{department.placement}%</span><span className="positive-trend" role="cell">↗ {department.trend}</span></div>)}
          </div>
          <p className="campus-footnote"><ShieldCheck size={17} aria-hidden="true" /> Aggregated cohort view — no individual student data shown.</p>
        </section>
        <CohortChart period={period} />
      </div>
      <aside className="campus-recommendation"><span><Sparkles size={21} aria-hidden="true" /></span><div><strong>Opportunity to support: interview confidence</strong><p>Readiness is 16 points lower than communication skills across the sample cohort. Consider a guided mock-interview week.</p></div><button className="text-link" type="button" onClick={() => window.print()}>Print view <ArrowDownToLine size={17} aria-hidden="true" /></button></aside>
    </div>
  );
}

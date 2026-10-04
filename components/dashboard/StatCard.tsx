import type { ReactNode } from 'react';

export function StatCard({ icon, label, value, note, color = 'purple' }: { icon: ReactNode; label: string; value: string; note: string; color?: string }) {
  return (
    <article className="stat-card panel">
      <span className={`stat-icon ${color}`} aria-hidden="true">{icon}</span>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </article>
  );
}

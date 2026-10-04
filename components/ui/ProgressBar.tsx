import type { CSSProperties } from 'react';

export function ProgressBar({ value, label, color = 'violet', className = '' }: { value: number; label: string; color?: string; className?: string }) {
  const boundedValue = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={`progress-component ${className}`}>
      <div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={boundedValue}>
        <span className={`progress-fill ${color}`} style={{ '--progress': `${boundedValue}%` } as CSSProperties} />
      </div>
    </div>
  );
}

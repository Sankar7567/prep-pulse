'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PROGRESS, type UserProgress } from '@/lib/types';

const STORAGE_KEY = 'preppulse-progress';

function loadProgress(): UserProgress {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(value) as Partial<UserProgress>;
    return {
      xp: Number.isFinite(parsed.xp) ? Number(parsed.xp) : DEFAULT_PROGRESS.xp,
      streak: Number.isFinite(parsed.streak) ? Number(parsed.streak) : DEFAULT_PROGRESS.streak,
      lastActive: typeof parsed.lastActive === 'string' ? parsed.lastActive : '',
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((item): item is string => typeof item === 'string') : [],
      interviews: Number.isFinite(parsed.interviews) ? Number(parsed.interviews) : 0
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // The application remains usable when browser storage is full or disabled.
    }
  }, [hydrated, progress]);

  const recordActivity = useCallback((xp = 0, courseId?: string, interview = false) => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

    setProgress(current => {
      let streak = current.streak;
      if (current.lastActive !== today) {
        streak = current.lastActive === yesterday ? current.streak + 1 : 1;
      }
      const completed = courseId && !current.completed.includes(courseId)
        ? [...current.completed, courseId]
        : current.completed;
      return {
        ...current,
        xp: Math.max(0, current.xp + xp),
        streak,
        lastActive: today,
        completed,
        interviews: current.interviews + (interview ? 1 : 0)
      };
    });
  }, []);

  return { progress, recordActivity, hydrated };
}

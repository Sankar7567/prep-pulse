'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="toast" role="status" aria-live="polite">
          <CheckCircle2 size={20} aria-hidden="true" />
          <span>{message}</span>
          <button type="button" onClick={onDismiss} aria-label="Dismiss notification"><X size={18} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

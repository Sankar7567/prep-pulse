'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { Course } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';

export function QuizModal({ course, completed, onClose, onComplete, onToast }: { course: Course; completed: boolean; onClose: () => void; onComplete: () => void; onToast: (message: string) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const checkAnswer = () => {
    if (selected === null) { onToast('Choose an answer before continuing.'); return; }
    setAnswered(true);
    if (selected === course.correct) onToast('That’s right — you earned 35 XP!');
    else onToast('Good try. Review the concept, choose another answer, and check again.');
  };
  const advance = () => {
    if (selected === course.correct) onComplete();
    else { setAnswered(false); setSelected(null); }
  };

  return (
    <Modal title={course.title} onClose={onClose} className="course-modal">
      <div className={`course-icon ${course.color}`} aria-hidden="true">{course.icon}</div>
      <span className="course-label">{course.label} · {course.duration}</span><h2>{course.title}</h2>
      <section className="concept-box" aria-labelledby="concept-heading"><span className="tiny-eyebrow" id="concept-heading">THE QUICK TAKE</span><p>{course.concept}</p></section>
      <section className="quiz-box" aria-labelledby="quiz-heading"><span className="tiny-eyebrow">QUICK CHECK</span><h3 id="quiz-heading">{course.question}</h3>
        <fieldset className="quiz-options" aria-labelledby="quiz-heading">
          {course.options.map((option, index) => {
            const correct = answered && index === course.correct;
            const incorrect = answered && selected === index && index !== course.correct;
            return <label key={option} className={`quiz-option ${selected === index ? 'chosen' : ''} ${correct ? 'correct' : ''} ${incorrect ? 'incorrect' : ''}`}>
              <input type="radio" name={`quiz-${course.id}`} value={index} checked={selected === index} onChange={() => { setSelected(index); setAnswered(false); }} />
              <span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><span>{option}</span>{correct && <Check size={18} aria-label="Correct answer" />}
            </label>;
          })}
        </fieldset>
        {!answered ? <button className="btn btn-primary wide-btn" type="button" onClick={checkAnswer}>Check my answer <ArrowRight size={18} aria-hidden="true" /></button> : selected === course.correct ? <button className="btn btn-primary wide-btn" type="button" onClick={onComplete}>{completed ? 'Close review' : 'Complete module · +35 XP'} <ArrowRight size={18} aria-hidden="true" /></button> : <button className="btn btn-outline wide-btn" type="button" onClick={advance}>Try another answer <ArrowRight size={18} aria-hidden="true" /></button>}
      </section>
    </Modal>
  );
}

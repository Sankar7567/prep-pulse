'use client';

import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export function SpeechInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const speech = useSpeechRecognition(transcript => onChange(`${value.trim()}${value.trim() ? ' ' : ''}${transcript}`));
  return (
    <div className="speech-input">
      <textarea value={value} onChange={event => onChange(event.target.value)} placeholder="Structure your thoughts here… Situation, action, result…" aria-label="Your interview answer" maxLength={10_000} />
      <div className="speech-actions">
        <button className={`icon-button mic-button ${speech.listening ? 'recording' : ''}`} type="button" onClick={speech.toggle} aria-pressed={speech.listening} aria-label={speech.listening ? 'Stop dictation' : 'Start dictation'}>
          {speech.listening ? <MicOff size={20} aria-hidden="true" /> : <Mic size={20} aria-hidden="true" />}
        </button>
        <span>{speech.listening ? 'Listening… tap the microphone to stop.' : 'Be specific. A real example beats a perfect script.'}</span>
      </div>
      {speech.error && <p className="speech-status" role="status">{speech.error}</p>}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type Recognition = {
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

export function useSpeechRecognition(onTranscript: (transcript: string) => void) {
  const recognitionRef = useRef<Recognition | null>(null);
  const transcriptCallback = useRef(onTranscript);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { transcriptCallback.current = onTranscript; }, [onTranscript]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      recognitionRef.current = null;
      try { recognition.abort(); } catch { /* Nothing else is needed if the browser already stopped. */ }
      setListening(false);
    }
  }, []);

  const start = useCallback(() => {
    setError('');
    if (recognitionRef.current) {
      stop();
      return;
    }
    const speechWindow = window as SpeechWindow;
    const Constructor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Constructor) {
      setSupported(false);
      setError('Voice input is not supported here. Type your answer instead.');
      return;
    }
    try {
      const recognition = new Constructor();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.onstart = () => setListening(true);
      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
      };
      recognition.onerror = () => {
        setListening(false);
        setError('Microphone input stopped. Check permission or continue typing.');
        recognitionRef.current = null;
      };
      recognition.onresult = event => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) transcriptCallback.current(transcript);
      };
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setListening(false);
      setError('Could not start the microphone. You can type your answer instead.');
    }
  }, [stop]);

  useEffect(() => () => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      try { recognition.abort(); } catch { /* The browser may already have stopped the session. */ }
    }
  }, []);

  return { listening, supported, error, toggle: start, stop };
}

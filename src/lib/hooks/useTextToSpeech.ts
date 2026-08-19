// Krishi Mitra — Text-to-Speech Hook
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Language } from '@/lib/types';

// Maps our language codes to BCP-47 speech synthesis voices
const langVoiceMap: Record<Language, string> = {
  hi: 'hi-IN',
  pa: 'pa-IN',
  te: 'te-IN',
  en: 'en-IN',
};

export interface TTSControls {
  speak: (text: string, lang?: Language) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  rate: number;
  setRate: (rate: number) => void;
}

/**
 * Cleans markdown/emoji formatting from text before speaking.
 * Removes **, *, #, emoji, URLs, and source annotations.
 */
function cleanTextForSpeech(text: string): string {
  return text
    // Remove markdown bold/italic
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    // Remove markdown headers
    .replace(/^#+\s*/gm, '')
    // Remove bullet markers
    .replace(/^[-•]\s*/gm, '')
    // Remove numbered list markers like "1. "
    .replace(/^\d+\.\s*/gm, '')
    // Remove emoji (common Unicode ranges)
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[↑↓→←]/g, '')
    // Remove source annotations like "📊 Source: ..."
    .replace(/Source:.*$/gm, '')
    // Remove URLs
    .replace(/https?:\/\/\S+/g, '')
    // Collapse multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim
    .trim();
}

export function useTextToSpeech(defaultLang: Language = 'hi'): TTSControls {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(0.9); // Slightly slower for clarity
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, lang?: Language) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voiceLang = langVoiceMap[lang || defaultLang];
    utterance.lang = voiceLang;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang === voiceLang)
      || voices.find(v => v.lang.startsWith(voiceLang.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [defaultLang, rate]);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  return { speak, stop, pause, resume, isSpeaking, isPaused, rate, setRate };
}

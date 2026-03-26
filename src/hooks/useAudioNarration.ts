/**
 * Audio Narration Hook for Morabaraba
 * Uses Web Speech API for multilingual voice announcements
 */

import { useCallback, useEffect, useRef } from 'react';
import { AUDIO_NARRATIONS } from './translations';

interface UseAudioNarrationOptions {
  enabled: boolean;
  language: 'EN' | 'ZU' | 'SO';
  volume?: number;
  rate?: number;
  pitch?: number;
}

export const useAudioNarration = ({
  enabled,
  language,
  volume = 1,
  rate = 0.9,
  pitch = 1
}: UseAudioNarrationOptions) => {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Load voices
      const loadVoices = () => {
        voicesRef.current = synthRef.current?.getVoices() || [];
      };
      
      loadVoices();
      if (synthRef.current?.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const getVoiceForLanguage = useCallback((lang: string): SpeechVoice | undefined => {
    const voiceMap: Record<string, string[]> = {
      en: ['en-ZA', 'en-US', 'en-GB', 'en'],
      zu: ['zu-ZA', 'zu'],
      so: ['so-SO', 'so']
    };
    
    const preferredCodes = voiceMap[lang] || voiceMap['en'];
    
    // Try to find preferred voice
    for (const code of preferredCodes) {
      const voice = voicesRef.current.find(v => v.lang.startsWith(code));
      if (voice) return voice;
    }
    
    // Fallback to any available voice
    return voicesRef.current[0];
  }, []);

  const speak = useCallback((text: string) => {
    if (!enabled || !synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Set voice based on language
    const langCode = language === 'EN' ? 'en' : language === 'ZU' ? 'zu' : 'so';
    const voice = getVoiceForLanguage(langCode);
    if (voice) utterance.voice = voice;
    
    synthRef.current.speak(utterance);
  }, [enabled, language, volume, rate, pitch, getVoiceForLanguage]);

  const speakNarration = useCallback((key: keyof typeof AUDIO_NARRATIONS) => {
    const langMap: Record<string, 'en' | 'zu' | 'so'> = {
      EN: 'en',
      ZU: 'zu',
      SO: 'so'
    };
    
    const lang = langMap[language];
    const text = AUDIO_NARRATIONS[key]?.[lang] || AUDIO_NARRATIONS[key]?.['en'];
    
    if (text) {
      speak(text);
    }
  }, [language, speak]);

  const cancel = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  return {
    speak,
    speakNarration,
    cancel,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
    voices: voicesRef.current
  };
};

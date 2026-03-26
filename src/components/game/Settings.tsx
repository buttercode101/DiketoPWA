/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React from 'react';
import { useGameStore, Language, Theme } from '@/src/store/useGameStore';
import { Button } from '@/src/components/ui/Button';
import { Volume2, VolumeX, Globe, Palette, X, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '@/src/lib/audio-engine';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { 
    soundEnabled, 
    setSoundEnabled, 
    language, 
    setLanguage, 
    theme, 
    setTheme 
  } = useGameStore();

  if (!isOpen) return null;

  const handleSoundToggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioEngine.setEnabled(next);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#fdf8f6] rounded-3xl border-8 border-[#d2bab0] shadow-2xl max-w-md w-full p-8 space-y-8"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-display font-bold text-[#5b433b] flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-[#f27696]" />
            SETTINGS
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#eaddd7] rounded-full transition-colors">
            <X className="w-6 h-6 text-[#5b433b]" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-[#eaddd7]">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="text-[#f27696]" /> : <VolumeX className="text-[#a18072]" />}
              <span className="font-bold text-[#5b433b]">Sound Effects</span>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${soundEnabled ? 'bg-[#f27696]' : 'bg-[#eaddd7]'}`}
            >
              <motion.div
                animate={{ x: soundEnabled ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#5b433b] font-bold">
              <Globe className="w-5 h-5" />
              <span>Language</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['EN', 'ZU', 'SO'] as Language[]).map((lang) => (
                <Button
                  key={lang}
                  variant={language === lang ? 'default' : 'outline'}
                  onClick={() => setLanguage(lang)}
                  className={`h-12 font-bold ${language === lang ? 'bg-[#f27696] text-white' : 'border-2 border-[#eaddd7] text-[#846358]'}`}
                >
                  {lang === 'EN' ? 'English' : lang === 'ZU' ? 'isiZulu' : 'Sesotho'}
                </Button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#5b433b] font-bold">
              <Palette className="w-5 h-5" />
              <span>Visual Theme</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['EARTH', 'HIGH_CONTRAST'] as Theme[]).map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? 'default' : 'outline'}
                  onClick={() => setTheme(t)}
                  className={`h-12 font-bold ${theme === t ? 'bg-[#f27696] text-white' : 'border-2 border-[#eaddd7] text-[#846358]'}`}
                >
                  {t === 'EARTH' ? 'Earth Tones' : 'High Contrast'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={onClose}
          className="w-full bg-[#5b433b] hover:bg-[#30221e] text-white py-6 text-xl font-bold rounded-2xl shadow-lg"
        >
          SAVE & CLOSE
        </Button>
      </motion.div>
    </div>
  );
};

"use client";

import React from 'react';
import { useGameStore } from '@/src/store/useGameStore';
import { motion } from 'framer-motion';
import { Settings, RotateCw, ZoomIn, Volume2, VolumeX, Smartphone } from 'lucide-react';

export const GameSettings: React.FC = () => {
  const { 
    theme, setTheme, 
    textSize, setTextSize,
    soundEnabled, setSoundEnabled,
    hapticEnabled, setHapticEnabled,
    boardRotation, setBoardRotation,
    boardZoom, setBoardZoom
  } = useGameStore();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-[#eaddd7] hover:bg-[#f27696] text-[#5b433b] hover:text-white rounded-full shadow-lg transition-all"
        aria-label="Game settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute right-0 top-14 w-72 bg-[#eaddd7] rounded-2xl shadow-2xl border-2 border-[#846358] p-4 z-50"
        >
          <h3 className="font-bold text-lg text-[#5b433b] mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            SETTINGS
          </h3>

          {/* Theme Selection */}
          <div className="mb-4">
            <label className="text-sm font-bold text-[#5b433b] mb-2 block">THEME</label>
            <div className="flex gap-2">
              {(['EARTH', 'HIGH_CONTRAST', 'COLORBLIND'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    theme === t
                      ? 'bg-[#f27696] text-white'
                      : 'bg-[#846358]/20 text-[#5b433b] hover:bg-[#846358]/30'
                  }`}
                >
                  {t === 'EARTH' ? '🌍 Earth' : t === 'HIGH_CONTRAST' ? '⚡ High' : '🎨 CB'}
                </button>
              ))}
            </div>
          </div>

          {/* Text Size */}
          <div className="mb-4">
            <label className="text-sm font-bold text-[#5b433b] mb-2 block">TEXT SIZE</label>
            <div className="flex gap-2">
              {(['NORMAL', 'LARGE', 'EXTRA_LARGE'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    textSize === size
                      ? 'bg-[#f27696] text-white'
                      : 'bg-[#846358]/20 text-[#5b433b] hover:bg-[#846358]/30'
                  }`}
                >
                  {size === 'NORMAL' ? 'A' : size === 'LARGE' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-full flex items-center justify-between py-3 px-4 bg-[#846358]/20 rounded-lg hover:bg-[#846358]/30 transition-all"
            >
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#5b433b]" />
                ) : (
                  <VolumeX className="w-5 h-5 text-[#5b433b]" />
                )}
                <span className="text-sm font-bold text-[#5b433b]">Sound Effects</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all ${soundEnabled ? 'bg-[#4CAF50]' : 'bg-[#846358]'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'} translate-y-0.5`} />
              </div>
            </button>
          </div>

          {/* Haptic Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setHapticEnabled(!hapticEnabled)}
              className="w-full flex items-center justify-between py-3 px-4 bg-[#846358]/20 rounded-lg hover:bg-[#846358]/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#5b433b]" />
                <span className="text-sm font-bold text-[#5b433b]">Haptic Feedback</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all ${hapticEnabled ? 'bg-[#4CAF50]' : 'bg-[#846358]'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${hapticEnabled ? 'translate-x-6' : 'translate-x-0.5'} translate-y-0.5`} />
              </div>
            </button>
          </div>

          {/* Board Rotation */}
          <div className="mb-4 pt-4 border-t border-[#846358]/30">
            <label className="text-sm font-bold text-[#5b433b] mb-2 block">BOARD ROTATION</label>
            <div className="flex gap-2">
              <button
                onClick={() => setBoardRotation(0)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  boardRotation === 0
                    ? 'bg-[#f27696] text-white'
                    : 'bg-[#846358]/20 text-[#5b433b] hover:bg-[#846358]/30'
                }`}
              >
                0°
              </button>
              <button
                onClick={() => setBoardRotation(180)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  boardRotation === 180
                    ? 'bg-[#f27696] text-white'
                    : 'bg-[#846358]/20 text-[#5b433b] hover:bg-[#846358]/30'
                }`}
              >
                180°
              </button>
            </div>
          </div>

          {/* Board Zoom */}
          <div className="mb-4">
            <label className="text-sm font-bold text-[#5b433b] mb-2 block">BOARD ZOOM</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBoardZoom(Math.max(0.8, boardZoom - 0.1))}
                className="p-2 bg-[#846358]/20 rounded-lg hover:bg-[#846358]/30 transition-all"
              >
                <span className="text-lg font-bold text-[#5b433b]">−</span>
              </button>
              <div className="flex-1 text-center">
                <span className="text-sm font-bold text-[#5b433b]">{Math.round(boardZoom * 100)}%</span>
              </div>
              <button
                onClick={() => setBoardZoom(Math.min(1.5, boardZoom + 0.1))}
                className="p-2 bg-[#846358]/20 rounded-lg hover:bg-[#846358]/30 transition-all"
              >
                <span className="text-lg font-bold text-[#5b433b]">+</span>
              </button>
            </div>
            <button
              onClick={() => setBoardZoom(1)}
              className="w-full mt-2 py-1 text-xs text-[#5b433b] hover:text-[#f27696] transition-colors"
            >
              Reset Zoom
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

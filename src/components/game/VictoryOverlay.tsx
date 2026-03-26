/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Share2, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { useGameStore } from '@/src/store/useGameStore';
import { audioEngine } from '@/src/lib/audio-engine';

export const VictoryOverlay: React.FC = () => {
  const { winner, phase, resetGame, setGameMode } = useGameStore();

  useEffect(() => {
    if (phase === 'GAME_OVER') {
      if (winner) {
        audioEngine.play('win');
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
      }
    }
  }, [phase, winner]);

  if (phase !== 'GAME_OVER') return null;

  const handleShare = async () => {
    const text = winner 
      ? `I just won a game of Morabaraba! 🐄🇿🇦 Can you beat the herd? Play now at ${window.location.origin}`
      : `I just played a strategic draw in Morabaraba! 🐄🇿🇦 A true test of minds. Play now at ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Morabaraba Result',
          text: text,
          url: window.location.origin,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          className="bg-[#fdf8f6] rounded-3xl border-8 border-[#f27696] shadow-2xl max-w-md w-full p-8 text-center space-y-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
            </motion.div>
            <div className="absolute -top-2 -right-2 bg-[#f27696] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              !
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-[#5b433b]">
              {!winner ? "IT'S A DRAW!" : `PLAYER ${winner} WINS!`}
            </h2>
            <p className="text-[#846358] text-lg italic">
              "Ubuntu: I am because we are."
            </p>
            <p className="text-sm text-[#a18072] leading-relaxed">
              {!winner 
                ? "Both herds stand strong. A true display of strategic balance."
                : `The herd has been mastered. A legendary victory in the spirit of Mapungubwe.`}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button 
              onClick={resetGame}
              className="bg-[#f27696] hover:bg-[#e94a74] text-white py-6 text-xl font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-6 h-6" />
              REMATCH
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline"
                onClick={handleShare}
                className="border-2 border-[#d2bab0] text-[#5b433b] py-4 rounded-xl flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                SHARE
              </Button>
              <Button 
                variant="outline"
                onClick={() => setGameMode(null)}
                className="border-2 border-[#d2bab0] text-[#5b433b] py-4 rounded-xl flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                MENU
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

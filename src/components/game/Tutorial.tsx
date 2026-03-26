/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React from 'react';
import { useGameStore } from '@/src/store/useGameStore';
import { Button } from '@/src/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Morabaraba",
    content: "Morabaraba is a traditional South African board game. Each player starts with 12 cows.",
    image: "https://picsum.photos/seed/morabaraba1/400/200"
  },
  {
    title: "Phase 1: Placing",
    content: "Players take turns placing their 12 cows on the 24 intersection points. Try to form a 'mill' (3 cows in a line).",
    image: "https://picsum.photos/seed/morabaraba2/400/200"
  },
  {
    title: "Forming a Mill",
    content: "When you form a mill, you can 'shoot' (remove) one of your opponent's cows from the board.",
    image: "https://picsum.photos/seed/morabaraba3/400/200"
  },
  {
    title: "Phase 2: Moving",
    content: "Once all cows are placed, players move their cows to adjacent points to form new mills.",
    image: "https://picsum.photos/seed/morabaraba4/400/200"
  },
  {
    title: "Phase 3: Flying",
    content: "When a player has only 3 cows left, they can 'fly' to any empty point on the board.",
    image: "https://picsum.photos/seed/morabaraba5/400/200"
  },
  {
    title: "Winning the Game",
    content: "You win by reducing your opponent to 2 cows or by blocking all their moves.",
    image: "https://picsum.photos/seed/morabaraba6/400/200"
  }
];

export const Tutorial: React.FC = () => {
  const { tutorialStep, nextTutorialStep, setGameMode } = useGameStore();
  const currentStep = TUTORIAL_STEPS[tutorialStep] || TUTORIAL_STEPS[0];

  const handleNext = () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      nextTutorialStep();
    } else {
      setGameMode('SINGLE_PLAYER');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#fdf8f6] rounded-3xl border-8 border-[#d2bab0] shadow-2xl max-w-lg w-full overflow-hidden"
      >
        <div className="relative h-48 bg-[#eaddd7]">
          <img 
            src={currentStep.image} 
            alt={currentStep.title}
            className="w-full h-full object-cover opacity-80"
          />
          <button 
            onClick={() => setGameMode('SINGLE_PLAYER')}
            className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-[#5b433b]" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#f27696] tracking-widest uppercase">
              Step {tutorialStep + 1} of {TUTORIAL_STEPS.length}
            </span>
            <div className="flex gap-1">
              {TUTORIAL_STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-colors ${i === tutorialStep ? 'bg-[#f27696]' : 'bg-[#eaddd7]'}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-display font-bold text-[#5b433b]">
              {currentStep.title}
            </h3>
            <p className="text-[#846358] leading-relaxed">
              {currentStep.content}
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleNext}
              className="bg-[#f27696] hover:bg-[#e94a74] text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-lg group"
            >
              {tutorialStep === TUTORIAL_STEPS.length - 1 ? "Let's Play!" : "Next Step"}
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

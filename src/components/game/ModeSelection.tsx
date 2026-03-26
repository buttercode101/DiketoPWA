/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React from 'react';
import { useGameStore, GameMode, Difficulty } from '@/src/store/useGameStore';
import { Button } from '@/src/components/ui/Button';
import { User, Users, GraduationCap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const ModeSelection: React.FC = () => {
  const { setGameMode, setDifficulty, setAiPlayer, difficulty, aiPlayer } = useGameStore();

  const handleStartSinglePlayer = (diff: Difficulty, player: 1 | 2) => {
    setDifficulty(diff);
    setAiPlayer(player === 1 ? 2 : 1);
    setGameMode('SINGLE_PLAYER');
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-[#f2e8e5] rounded-3xl border-8 border-[#d2bab0] shadow-2xl max-w-2xl w-full">
      <h2 className="text-4xl font-display font-bold text-[#5b433b] text-center">
        CHOOSE YOUR PATH
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Single Player Card */}
        <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl border-4 border-[#eaddd7] hover:border-[#f27696] transition-all group">
          <div className="flex items-center gap-3 text-[#5b433b]">
            <Cpu className="w-8 h-8" />
            <h3 className="text-xl font-bold">VS AI Opponent</h3>
          </div>
          <p className="text-sm text-[#846358]">Challenge our advanced minimax engine. Choose your color and skill level.</p>
          
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex gap-2">
              {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded border-2 transition-all ${
                    difficulty === d ? 'bg-[#f27696] text-white border-[#f27696]' : 'bg-transparent text-[#846358] border-[#eaddd7]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => handleStartSinglePlayer(difficulty, 1)}
                className="flex-1 bg-[#30221e] hover:bg-[#5b433b] text-white"
              >
                Play as Dark
              </Button>
              <Button 
                onClick={() => handleStartSinglePlayer(difficulty, 2)}
                className="flex-1 bg-[#fdf8f6] hover:bg-[#eaddd7] text-[#5b433b] border-2 border-[#eaddd7]"
              >
                Play as Light
              </Button>
            </div>
          </div>
        </div>

        {/* Hotseat Card */}
        <button 
          onClick={() => setGameMode('HOTSEAT')}
          className="flex flex-col gap-4 p-6 bg-white rounded-2xl border-4 border-[#eaddd7] hover:border-[#f27696] transition-all text-left group"
        >
          <div className="flex items-center gap-3 text-[#5b433b]">
            <Users className="w-8 h-8" />
            <h3 className="text-xl font-bold">Local 2-Player</h3>
          </div>
          <p className="text-sm text-[#846358]">Play with a friend on the same device. Traditional hot-seat experience.</p>
          <div className="mt-auto pt-4">
            <span className="text-[#f27696] font-bold group-hover:underline">Start Match →</span>
          </div>
        </button>

        {/* Tutorial Card */}
        <button 
          onClick={() => setGameMode('TUTORIAL')}
          className="flex flex-col gap-4 p-6 bg-white rounded-2xl border-4 border-[#eaddd7] hover:border-[#f27696] transition-all text-left group md:col-span-2"
        >
          <div className="flex items-center gap-3 text-[#5b433b]">
            <GraduationCap className="w-8 h-8" />
            <h3 className="text-xl font-bold">Learn the Rules</h3>
          </div>
          <p className="text-sm text-[#846358]">New to Morabaraba? Let us walk you through the basics of placing, moving, and flying.</p>
          <div className="mt-auto pt-2">
            <span className="text-[#f27696] font-bold group-hover:underline">Start Tutorial →</span>
          </div>
        </button>
      </div>
    </div>
  );
};

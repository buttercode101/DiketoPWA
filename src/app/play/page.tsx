"use client";

import React from 'react';
import { GameBoard } from '@/src/components/game/GameBoard';
import { GameControls } from '@/src/components/game/GameControls';
import { ModeSelection } from '@/src/components/game/ModeSelection';
import { Tutorial } from '@/src/components/game/Tutorial';
import { MoveHistory } from '@/src/components/game/MoveHistory';
import { GameSettings } from '@/src/components/game/GameSettings';
import { useGameStore } from '@/src/store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Cpu, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/Button';

export default function GamePage() {
  const { phase, winner, gameMode, isThinking, setGameMode } = useGameStore();

  if (!gameMode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        <ModeSelection />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {gameMode === 'TUTORIAL' && <Tutorial />}
      
      <header className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-[#bfa094] hover:text-[#fdf8f6]"
            onClick={() => setGameMode(null as any)}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-display font-bold text-[#e94a74] tracking-tight">
            MORABARABA
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 px-4 py-2 bg-[#f27696] text-white rounded-full text-xs font-bold shadow-lg"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                AI IS THINKING...
              </motion.div>
            )}
          </AnimatePresence>
          <GameSettings />
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 w-full game-container">
        <div className="flex-1 flex justify-center w-full relative">
          <GameBoard />
          
          {/* AI Thinking Overlay on Board */}
          <AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-black/10 backdrop-blur-[1px] rounded-3xl flex items-center justify-center pointer-events-none"
              >
                <div className="bg-white/90 p-4 rounded-2xl shadow-xl flex items-center gap-3 border-2 border-[#f27696]">
                  <Cpu className="w-6 h-6 text-[#f27696] animate-pulse" />
                  <span className="text-[#5b433b] font-bold">AI Strategizing...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="w-full lg:w-auto flex flex-col items-center gap-6 controls-container">
          <GameControls />
          
          {/* Move History - Desktop only */}
          <div className="hidden lg:block">
            <MoveHistory />
          </div>
          
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-6 bg-[#e94a74] text-white rounded-xl shadow-2xl text-center w-full"
              >
                <h2 className="text-3xl font-bold mb-2">VICTORY!</h2>
                <p className="text-lg opacity-90">Player {winner} has mastered the herd.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4 bg-[#5b433b]/20 rounded-lg border border-[#846358]/30 text-sm text-[#bfa094] max-w-[400px]">
            <p className="font-bold text-[#fdf8f6] mb-1">PRO TIP:</p>
            {phase === 'PLACING' && "Focus on placing your cows in positions that can form multiple mills later."}
            {phase === 'MOVING' && "Try to block your opponent's movement while keeping your cows mobile."}
            {phase === 'FLYING' && "Your cows can now fly to any open spot! Use this to surprise your opponent."}
            {phase === 'SHOOTING' && "You formed a mill! Choose an opponent's cow to shoot (remove from the board)."}
          </div>
        </div>
      </main>
    </div>
  );
}

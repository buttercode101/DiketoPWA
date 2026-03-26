"use client";

import React from 'react';
import { useGameStore } from '@/src/store/useGameStore';
import { motion } from 'framer-motion';
import { ScrollText, RotateCcw } from 'lucide-react';

export const MoveHistory: React.FC = () => {
  const { history, resetGame } = useGameStore();

  const getMoveDescription = (move: any, index: number) => {
    const player = move.player === 1 ? 'P1' : 'P2';
    const turnNum = Math.floor(index / 2) + 1;
    
    switch (move.type) {
      case 'PLACE':
        return `${player} placed at ${move.to}`;
      case 'MOVE':
        return `${player} moved ${move.from} → ${move.to}`;
      case 'SHOOT':
        return `${player} captured at ${move.to} 🎯`;
      default:
        return 'Unknown move';
    }
  };

  return (
    <div className="bg-[#eaddd7] rounded-xl shadow-xl border-2 border-[#846358] p-4 w-full max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[#5b433b]">
          <ScrollText className="w-5 h-5" />
          <h3 className="font-bold text-lg">MOVE HISTORY</h3>
        </div>
        <button
          onClick={resetGame}
          className="p-2 hover:bg-[#846358]/20 rounded-full transition-colors"
          aria-label="Reset game"
        >
          <RotateCcw className="w-4 h-4 text-[#5b433b]" />
        </button>
      </div>
      
      <div className="max-h-64 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-[#846358] scrollbar-track-[#eaddd7]">
        {history.length === 0 ? (
          <p className="text-[#846358] text-sm text-center py-4">
            No moves yet. Game is ready to start!
          </p>
        ) : (
          history.map((move, index) => (
            <motion.div
              key={`${move.timestamp}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`text-sm py-1.5 px-3 rounded-lg ${
                move.player === 1 
                  ? 'bg-[#30221e]/10 text-[#30221e]' 
                  : 'bg-[#fdf8f6]/50 text-[#5b433b]'
              }`}
            >
              <span className="font-mono text-xs opacity-60 mr-2">
                {Math.floor(index / 2) + 1}.
              </span>
              {getMoveDescription(move, index)}
            </motion.div>
          ))
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-[#846358]/30 text-xs text-[#846358] flex justify-between">
        <span>Total moves: {history.length}</span>
        <span>Phase: {history.length < 24 ? 'Placing' : history.length < 50 ? 'Moving' : 'Endgame'}</span>
      </div>
    </div>
  );
};

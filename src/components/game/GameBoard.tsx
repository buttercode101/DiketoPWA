/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useMemo } from 'react';
import { useGameStore } from '@/src/store/useGameStore';
import { POINT_COORDINATES, POINT_IDS, ADJACENCY_MAP } from '@/src/lib/game-engine/board-utils';
import { PointId } from '@/src/lib/game-engine/types';
import { CowPiece } from './CowPiece';
import { BoardPoint } from './BoardPoint';
import { motion, AnimatePresence } from 'framer-motion';

export const GameBoard: React.FC = () => {
  const { 
    board, 
    phase, 
    selectedPointId, 
    dispatch, 
    setSelectedPointId, 
    currentPlayer, 
    lastMillPoints 
  } = useGameStore();

  const validMoves = useMemo(() => {
    if (!selectedPointId) return [];
    if (phase === 'FLYING') {
      return POINT_IDS.filter(id => board[id] === null);
    }
    if (phase === 'MOVING') {
      return ADJACENCY_MAP[selectedPointId].filter(id => board[id] === null);
    }
    return [];
  }, [selectedPointId, phase, board]);

  const handlePointClick = (id: PointId) => {
    if (phase === 'PLACING') {
      dispatch({ type: 'PLACE', player: currentPlayer, to: id });
    } else if (phase === 'MOVING' || phase === 'FLYING') {
      if (board[id] === currentPlayer) {
        setSelectedPointId(id);
      } else if (selectedPointId && board[id] === null) {
        dispatch({ type: 'MOVE', player: currentPlayer, from: selectedPointId, to: id });
        setSelectedPointId(null);
      }
    } else if (phase === 'SHOOTING') {
      dispatch({ type: 'SHOOT', player: currentPlayer, to: id });
    }
  };

  return (
    <div className="relative w-full max-w-[600px] aspect-square bg-[#eaddd7] rounded-3xl shadow-2xl p-4 sm:p-8 border-8 border-[#846358] overflow-hidden">
      {/* Board Texture Overlay - Subtle Wood Grain Reference */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
      
      <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-sm">
        {/* Board Lines Group */}
        <g stroke="#5b433b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Outer Square */}
          <rect x="50" y="50" width="900" height="900" />
          {/* Middle Square */}
          <rect x="200" y="200" width="600" height="600" />
          {/* Inner Square */}
          <rect x="350" y="350" width="300" height="300" />
          
          {/* Cross Lines (Midpoints) */}
          <line x1="500" y1="50" x2="500" y2="350" />
          <line x1="500" y1="650" x2="500" y2="950" />
          <line x1="50" y1="500" x2="350" y2="500" />
          <line x1="650" y1="500" x2="950" y2="500" />
          
          {/* Diagonal Lines (Corners) */}
          <line x1="50" y1="50" x2="350" y2="350" />
          <line x1="950" y1="50" x2="650" y2="350" />
          <line x1="50" y1="950" x2="350" y2="650" />
          <line x1="950" y1="950" x2="650" y2="650" />
        </g>

        {/* Points Layer */}
        {POINT_IDS.map((id) => {
          const { x, y } = POINT_COORDINATES[id];
          return (
            <BoardPoint
              key={id}
              id={id}
              x={x}
              y={y}
              onClick={handlePointClick}
              isValidMove={validMoves.includes(id)}
              isSelected={selectedPointId === id}
              isOccupied={board[id] !== null}
            />
          );
        })}

        {/* Pieces Layer */}
        <AnimatePresence>
          {POINT_IDS.map((id) => {
            const occupant = board[id];
            if (!occupant) return null;
            const { x, y } = POINT_COORDINATES[id];
            return (
              <CowPiece
                key={`${id}-${occupant}`}
                player={occupant}
                x={x}
                y={y}
                isLastMill={lastMillPoints?.includes(id)}
                isSelected={selectedPointId === id}
              />
            );
          })}
        </AnimatePresence>
      </svg>
      
      {/* Flying Mode Indicator Overlay */}
      {phase === 'FLYING' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 bg-[#f27696] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse pointer-events-none"
        >
          FLYING MODE
        </motion.div>
      )}
    </div>
  );
};

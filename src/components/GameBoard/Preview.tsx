"use client";

import React, { useState } from 'react';
import { INITIAL_STATE, processAction } from '@/src/lib/game-engine/game-logic';
import { POINT_COORDINATES, POINT_IDS } from '@/src/lib/game-engine/board-utils';
import { GameState, PointId, Player } from '@/src/lib/game-engine/types';
import { Button } from '@/src/components/ui/Button';
import { motion } from 'framer-motion';

export const GamePreview: React.FC = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [selectedPoint, setSelectedPoint] = useState<PointId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePointClick = (id: PointId) => {
    setError(null);
    const player = state.currentPlayer;

    if (state.phase === 'PLACING') {
      const result = processAction(state, { type: 'PLACE', player, to: id, timestamp: Date.now() });
      if (result.isValid && result.newState) setState(result.newState);
      else setError(result.error || 'Invalid move');
    } else if (state.phase === 'MOVING' || state.phase === 'FLYING') {
      if (state.board[id] === player) {
        setSelectedPoint(id);
      } else if (selectedPoint && state.board[id] === null) {
        const result = processAction(state, { type: 'MOVE', player, from: selectedPoint, to: id, timestamp: Date.now() });
        if (result.isValid && result.newState) {
          setState(result.newState);
          setSelectedPoint(null);
        } else setError(result.error || 'Invalid move');
      }
    } else if (state.phase === 'SHOOTING') {
      const result = processAction(state, { type: 'SHOOT', player, to: id, timestamp: Date.now() });
      if (result.isValid && result.newState) setState(result.newState);
      else setError(result.error || 'Invalid move');
    }
  };

  const reset = () => {
    setState(INITIAL_STATE);
    setSelectedPoint(null);
    setError(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start p-8 bg-[#30221e] min-h-screen text-[#fdf8f6]">
      <div className="flex-1 flex flex-col items-center gap-4">
        <h2 className="text-3xl font-display font-bold text-[#e94a74]">ENGINE PREVIEW</h2>
        
        <div className="relative w-full max-w-[600px] aspect-square bg-[#eaddd7] rounded-xl shadow-2xl p-4 border-4 border-[#846358]">
          <svg viewBox="0 0 1000 1000" className="w-full h-full">
            {/* Board Lines */}
            <rect x="50" y="50" width="900" height="900" fill="none" stroke="#5b433b" strokeWidth="4" />
            <rect x="200" y="200" width="600" height="600" fill="none" stroke="#5b433b" strokeWidth="4" />
            <rect x="350" y="350" width="300" height="300" fill="none" stroke="#5b433b" strokeWidth="4" />
            
            <line x1="500" y1="50" x2="500" y2="350" stroke="#5b433b" strokeWidth="4" />
            <line x1="500" y1="650" x2="500" y2="950" stroke="#5b433b" strokeWidth="4" />
            <line x1="50" y1="500" x2="350" y2="500" stroke="#5b433b" strokeWidth="4" />
            <line x1="650" y1="500" x2="950" y2="500" stroke="#5b433b" strokeWidth="4" />
            
            <line x1="50" y1="50" x2="350" y2="350" stroke="#5b433b" strokeWidth="4" />
            <line x1="950" y1="50" x2="650" y2="350" stroke="#5b433b" strokeWidth="4" />
            <line x1="50" y1="950" x2="350" y2="650" stroke="#5b433b" strokeWidth="4" />
            <line x1="950" y1="950" x2="650" y2="650" stroke="#5b433b" strokeWidth="4" />

            {/* Points */}
            {POINT_IDS.map((id) => {
              const { x, y } = POINT_COORDINATES[id];
              const occupant = state.board[id];
              const isSelected = selectedPoint === id;
              const isLastMill = state.lastMillPoints?.includes(id);

              return (
                <g key={id} onClick={() => handlePointClick(id)} className="cursor-pointer group">
                  <circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill={isSelected ? "#f27696" : isLastMill ? "#e94a74" : "#5b433b"}
                    className="group-hover:fill-[#a18072] transition-colors"
                  />
                  <text x={x} y={y - 20} textAnchor="middle" fontSize="12" fill="#5b433b" className="font-bold">
                    {id}
                  </text>
                  {occupant && (
                    <motion.circle
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      cx={x}
                      cy={y}
                      r="30"
                      fill={occupant === 1 ? "#30221e" : "#fdf8f6"}
                      stroke="#5b433b"
                      strokeWidth="3"
                      className="drop-shadow-md"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-4 bg-[#5b433b]/30 p-6 rounded-xl border border-[#846358]">
        <h3 className="text-xl font-bold text-[#e94a74] border-b border-[#846358] pb-2">GAME STATE</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Current Player:</span>
            <span className="font-bold text-[#fdf8f6]">Player {state.currentPlayer}</span>
          </div>
          <div className="flex justify-between">
            <span>Phase:</span>
            <span className="font-bold text-[#f27696]">{state.phase}</span>
          </div>
          <div className="flex justify-between">
            <span>Winner:</span>
            <span className="font-bold text-green-400">{state.winner ? `Player ${state.winner}` : 'None'}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs">
          <p className="font-bold text-[#bfa094] uppercase">Inventory</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-[#30221e] rounded">
              <p className="text-[#bfa094]">P1 Cows</p>
              <p>Place: {state.cowsToPlace[1]}</p>
              <p>Board: {state.cowsOnBoard[1]}</p>
              <p>Lost: {state.cowsLost[1]}</p>
            </div>
            <div className="p-2 bg-[#30221e] rounded">
              <p className="text-[#bfa094]">P2 Cows</p>
              <p>Place: {state.cowsToPlace[2]}</p>
              <p>Board: {state.cowsOnBoard[2]}</p>
              <p>Lost: {state.cowsLost[2]}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold text-[#bfa094] uppercase mb-2">Rules Enforced</p>
          <ul className="text-[10px] space-y-1 text-[#bfa094] list-disc pl-4">
            <li>24 points (A1-A8, R1-R8, E1-E8)</li>
            <li>MSSA Shooting Rules (Mill protection)</li>
            <li>Flying phase at 3 cows</li>
            <li>Draw after 20 moves without capture</li>
            <li>No immediate re-mill (GAR)</li>
          </ul>
        </div>

        <Button onClick={reset} variant="outline" className="mt-4 border-[#846358] text-[#fdf8f6]">
          Reset Engine
        </Button>
      </div>
    </div>
  );
};

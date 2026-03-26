"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { useGameStore } from '@/src/store/useGameStore';
import { POINT_COORDINATES, POINT_IDS, ADJACENCY_MAP } from '@/src/lib/game-engine/board-utils';
import { PointId } from '@/src/lib/game-engine/types';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticFeedback } from '@/src/lib/haptics';

// Mobile-optimized touch target size (48px minimum per Material Design)
const TOUCH_TARGET_RADIUS = 28; // Increased from 20 to 28 for 56px diameter
const COW_RADIUS = 32; // Slightly reduced from 35 for better spacing

interface TouchFeedback {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

export const Board: React.FC = React.memo(() => {
  const { board, phase, selectedPointId, dispatch, setSelectedPointId, currentPlayer, boardRotation, boardZoom } = useGameStore();
  const [touchFeedbacks, setTouchFeedbacks] = useState<TouchFeedback[]>([]);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handlePointClick = useCallback((id: PointId) => {
    const now = Date.now();
    
    // Prevent double-tap within 200ms
    if (now - lastTouchTime < 200) return;
    setLastTouchTime(now);

    // Add touch feedback
    const coords = POINT_COORDINATES[id];
    const feedbackId = `${id}-${now}`;
    setTouchFeedbacks(prev => [...prev, { id: feedbackId, x: coords.x, y: coords.y, timestamp: now }]);
    
    // Remove feedback after animation
    setTimeout(() => {
      setTouchFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
    }, 600);

    // Haptic feedback based on action type
    if (phase === 'SHOOTING') {
      hapticFeedback.capture();
    } else if (board[id] !== null) {
      hapticFeedback.select();
    } else {
      hapticFeedback.move();
    }

    // Game logic
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
  }, [phase, selectedPointId, board, currentPlayer, dispatch, setSelectedPointId, lastTouchTime]);

  // Get legal moves for highlighting
  const getLegalMoves = useCallback(() => {
    if (phase !== 'MOVING' && phase !== 'FLYING') return [];
    if (!selectedPointId) return [];
    
    const legalMoves: PointId[] = [];
    
    if (phase === 'FLYING') {
      // Can fly to any empty point
      POINT_IDS.forEach(id => {
        if (board[id] === null) legalMoves.push(id);
      });
    } else {
      // Can only move to adjacent points
      const adjacent = ADJACENCY_MAP[selectedPointId];
      adjacent.forEach(id => {
        if (board[id] === null) legalMoves.push(id);
      });
    }
    
    return legalMoves;
  }, [phase, selectedPointId, board]);

  const legalMoves = getLegalMoves();

  return (
    <div 
      className="relative w-full max-w-[600px] aspect-square bg-[#eaddd7] rounded-xl shadow-2xl p-4 md:p-8 border-8 border-[#846358] touch-none overflow-hidden"
      role="application"
      aria-label="Morabaraba game board"
      style={{
        // Traditional African pattern background
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(132, 99, 88, 0.1) 0%, transparent 60%),
          repeating-linear-gradient(45deg, rgba(132, 99, 88, 0.05) 0px, rgba(132, 99, 88, 0.05) 2px, transparent 2px, transparent 8px)
        `
      }}
    >
      <svg 
        viewBox="0 0 1000 1000" 
        className="w-full h-full transition-transform duration-300 ease-out"
        style={{ 
          touchAction: 'none',
          transform: `rotate(${boardRotation}deg) scale(${boardZoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: 'center center'
        }}
      >
        {/* Decorative corner patterns - Traditional African motif */}
        <g className="opacity-30">
          {/* Top-left corner */}
          <path d="M 30 50 L 30 30 L 50 30" fill="none" stroke="#5b433b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="40" cy="40" r="3" fill="#5b433b" />
          
          {/* Top-right corner */}
          <path d="M 950 30 L 970 30 L 970 50" fill="none" stroke="#5b433b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="960" cy="40" r="3" fill="#5b433b" />
          
          {/* Bottom-left corner */}
          <path d="M 30 950 L 30 970 L 50 970" fill="none" stroke="#5b433b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="40" cy="960" r="3" fill="#5b433b" />
          
          {/* Bottom-right corner */}
          <path d="M 950 970 L 970 970 L 970 950" fill="none" stroke="#5b433b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="960" cy="960" r="3" fill="#5b433b" />
        </g>

        {/* Board Lines - Enhanced visibility with traditional styling */}
        <rect x="50" y="50" width="900" height="900" fill="none" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />
        <rect x="200" y="200" width="600" height="600" fill="none" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />
        <rect x="350" y="350" width="300" height="300" fill="none" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />

        <line x1="500" y1="50" x2="500" y2="350" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />
        <line x1="500" y1="650" x2="500" y2="950" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />
        <line x1="50" y1="500" x2="350" y2="500" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />
        <line x1="650" y1="500" x2="950" y2="500" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />

        <line x1="50" y1="50" x2="350" y2="350" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />
        <line x1="950" y1="50" x2="650" y2="350" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />
        <line x1="50" y1="950" x2="350" y2="650" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />
        <line x1="950" y1="950" x2="650" y2="650" stroke="#5b433b" strokeWidth="10" strokeLinecap="round" />

        {/* Touch Feedback Ripples */}
        <AnimatePresence>
          {touchFeedbacks.map((feedback) => (
            <motion.circle
              key={feedback.id}
              cx={feedback.x}
              cy={feedback.y}
              r="0"
              fill="none"
              stroke="#f27696"
              strokeWidth="4"
              initial={{ opacity: 1, r: 0 }}
              animate={{ opacity: 0, r: 60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Legal Move Highlights */}
        {legalMoves.map((pointId) => {
          const { x, y } = POINT_COORDINATES[pointId];
          return (
            <circle
              key={`legal-${pointId}`}
              cx={x}
              cy={y}
              r="15"
              fill="#4CAF50"
              opacity="0.5"
              className="animate-pulse"
            />
          );
        })}

        {/* Points - Enhanced touch targets */}
        {POINT_IDS.map((id) => {
          const { x, y } = POINT_COORDINATES[id];
          const occupant = board[id];
          const isSelected = selectedPointId === id;
          const isSelectable = (phase === 'MOVING' || phase === 'FLYING') && occupant === currentPlayer;
          const isEmpty = occupant === null;
          const isShootTarget = phase === 'SHOOTING' && occupant !== null && occupant !== currentPlayer;

          return (
            <g 
              key={id} 
              onClick={() => handlePointClick(id)} 
              className="cursor-pointer"
              role="button"
              aria-label={`${id}: ${occupant ? (occupant === 1 ? 'Player 1 cow' : 'Player 2 cow') : 'Empty point'}`}
              aria-pressed={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePointClick(id);
                }
              }}
            >
              {/* Enhanced touch target - invisible larger circle */}
              <circle
                cx={x}
                cy={y}
                r={TOUCH_TARGET_RADIUS}
                fill="transparent"
                className="hover:opacity-50 hover:fill-[#f27696]/20 transition-opacity"
              />
              
              {/* Base point marker */}
              <circle
                cx={x}
                cy={y}
                r="14"
                fill={isSelected ? "#f27696" : "#5b433b"}
                className="transition-colors"
              />

              {/* Selection ring */}
              {isSelected && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="20"
                  fill="none"
                  stroke="#f27696"
                  strokeWidth="3"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="animate-pulse"
                />
              )}

              {/* Cow piece */}
              {occupant && (
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  cx={x}
                  cy={y}
                  r={COW_RADIUS}
                  fill={occupant === 1 ? "#30221e" : "#fdf8f6"}
                  stroke="#5b433b"
                  strokeWidth="4"
                  className={`drop-shadow-lg ${isShootTarget ? 'animate-pulse cursor-pointer' : ''}`}
                  style={{
                    filter: isShootTarget 
                      ? 'drop-shadow(0 0 8px rgba(229, 57, 53, 0.8))' 
                      : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}
                />
              )}

              {/* Shootable indicator */}
              {isShootTarget && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r={COW_RADIUS + 8}
                  fill="none"
                  stroke="#E53935"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Mobile-optimized phase indicator overlay */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#5b433b]/90 text-[#fdf8f6] text-xs md:text-sm font-bold rounded-full shadow-lg pointer-events-none whitespace-nowrap">
        {phase === 'PLACING' && '📍 PLACE YOUR COW'}
        {phase === 'MOVING' && '🔄 MOVE TO ADJACENT SPOT'}
        {phase === 'FLYING' && '✈️ FLY TO ANY SPOT'}
        {phase === 'SHOOTING' && '🎯 REMOVE OPPONENT COW'}
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/src/lib/game-engine/types';

interface CowPieceProps {
  player: Player;
  x: number;
  y: number;
  isLastMill?: boolean;
  isSelected?: boolean;
}

export const CowPiece: React.FC<CowPieceProps> = ({ player, x, y, isLastMill, isSelected }) => {
  const isPlayer1 = player === 1;
  
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: 0,
        y: 0,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="pointer-events-none"
    >
      {/* Shadow */}
      <circle cx={x} cy={y + 5} r="35" fill="rgba(0,0,0,0.3)" />
      
      {/* Main Body - Bead/Wood Texture Style */}
      <circle
        cx={x}
        cy={y}
        r="35"
        fill={isPlayer1 ? "#30221e" : "#fdf8f6"}
        stroke={isSelected ? "#f27696" : "#5b433b"}
        strokeWidth={isSelected ? "6" : "3"}
        className={isLastMill ? "animate-pulse" : ""}
      />
      
      {/* Inner Pattern - Cultural Beadwork Reference */}
      <circle
        cx={x}
        cy={y}
        r="25"
        fill="none"
        stroke={isPlayer1 ? "#5b433b" : "#eaddd7"}
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      
      {/* Center Detail */}
      <circle
        cx={x}
        cy={y}
        r="8"
        fill={isPlayer1 ? "#e94a74" : "#bfa094"}
        opacity="0.8"
      />
      
      {/* Highlight/Sheen */}
      <ellipse
        cx={x - 10}
        cy={y - 10}
        rx="8"
        ry="4"
        fill="white"
        opacity={isPlayer1 ? "0.1" : "0.4"}
        transform={`rotate(-45, ${x - 10}, ${y - 10})`}
      />
    </motion.g>
  );
};

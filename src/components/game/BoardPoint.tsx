/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { PointId } from '@/src/lib/game-engine/types';

interface BoardPointProps {
  id: PointId;
  x: number;
  y: number;
  onClick: (id: PointId) => void;
  isValidMove?: boolean;
  isSelected?: boolean;
  isOccupied?: boolean;
}

export const BoardPoint: React.FC<BoardPointProps> = ({ id, x, y, onClick, isValidMove, isSelected, isOccupied }) => {
  return (
    <g 
      onClick={() => onClick(id)} 
      className="cursor-pointer group"
    >
      {/* Invisible Large Hit Area for Touch-First Controls */}
      <circle
        cx={x}
        cy={y}
        r="60"
        fill="transparent"
        className="pointer-events-all"
      />
      
      {/* Visual Point */}
      <circle
        cx={x}
        cy={y}
        r="15"
        fill={isSelected ? "#f27696" : "#5b433b"}
        className="group-hover:fill-[#a18072] transition-colors"
      />
      
      {/* Valid Move Highlight - Glow Effect */}
      {isValidMove && (
        <motion.circle
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0.6 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          cx={x}
          cy={y}
          r="40"
          fill="none"
          stroke="#f27696"
          strokeWidth="4"
          strokeDasharray="8 8"
        />
      )}
      
      {/* Hover Ring */}
      <circle
        cx={x}
        cy={y}
        r="25"
        fill="none"
        stroke="#5b433b"
        strokeWidth="2"
        className="opacity-0 group-hover:opacity-40 transition-opacity"
      />
      
      {/* Point Label - Subtle for Debug/Reference */}
      <text 
        x={x} 
        y={y - 25} 
        textAnchor="middle" 
        fontSize="12" 
        fill="#5b433b" 
        className="font-bold opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none"
      >
        {id}
      </text>
    </g>
  );
};

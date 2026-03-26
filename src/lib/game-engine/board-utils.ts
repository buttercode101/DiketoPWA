/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PointId } from "./types";

export const POINT_IDS: PointId[] = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8',
  'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'
];

/**
 * Adjacency map for the 24 points on a Morabaraba board.
 * Each point is connected to its neighbors on the same square,
 * and to the corresponding point on the adjacent square(s).
 */
export const ADJACENCY_MAP: Record<PointId, PointId[]> = {
  'A1': ['A2', 'A8', 'R1'],
  'A2': ['A1', 'A3', 'R2'],
  'A3': ['A2', 'A4', 'R3'],
  'A4': ['A3', 'A5', 'R4'],
  'A5': ['A4', 'A6', 'R5'],
  'A6': ['A5', 'A7', 'R6'],
  'A7': ['A6', 'A8', 'R7'],
  'A8': ['A7', 'A1', 'R8'],

  'R1': ['R2', 'R8', 'A1', 'E1'],
  'R2': ['R1', 'R3', 'A2', 'E2'],
  'R3': ['R2', 'R4', 'A3', 'E3'],
  'R4': ['R3', 'R5', 'A4', 'E4'],
  'R5': ['R4', 'R6', 'A5', 'E5'],
  'R6': ['R5', 'R7', 'A6', 'E6'],
  'R7': ['R6', 'R8', 'A7', 'E7'],
  'R8': ['R7', 'R1', 'A8', 'E8'],

  'E1': ['E2', 'E8', 'R1'],
  'E2': ['E1', 'E3', 'R2'],
  'E3': ['E2', 'E4', 'R3'],
  'E4': ['E3', 'E5', 'R4'],
  'E5': ['E4', 'E6', 'R5'],
  'E6': ['E5', 'E7', 'R6'],
  'E7': ['E6', 'E8', 'R7'],
  'E8': ['E7', 'E1', 'R8'],
};

/**
 * All possible mills (lines of 3) on a Morabaraba board.
 */
export const MILLS: PointId[][] = [
  // Outer Square
  ['A1', 'A2', 'A3'], ['A3', 'A4', 'A5'], ['A5', 'A6', 'A7'], ['A7', 'A8', 'A1'],
  // Middle Square
  ['R1', 'R2', 'R3'], ['R3', 'R4', 'R5'], ['R5', 'R6', 'R7'], ['R7', 'R8', 'R1'],
  // Inner Square
  ['E1', 'E2', 'E3'], ['E3', 'E4', 'E5'], ['E5', 'E6', 'E7'], ['E7', 'E8', 'E1'],
  // Crosses (Midpoints)
  ['A2', 'R2', 'E2'], ['A4', 'R4', 'E4'], ['A6', 'R6', 'E6'], ['A8', 'R8', 'E8'],
  // Diagonals (Corners)
  ['A1', 'R1', 'E1'], ['A3', 'R3', 'E3'], ['A5', 'R5', 'E5'], ['A7', 'R7', 'E7'],
];

/**
 * Helper to get all mills that a specific point belongs to.
 */
export const getMillsForPoint = (pointId: PointId): PointId[][] => {
  return MILLS.filter(mill => mill.includes(pointId));
};

/**
 * Coordinate mapping for visual rendering (SVG).
 * Based on a 1000x1000 grid.
 */
export const POINT_COORDINATES: Record<PointId, { x: number; y: number }> = {
  'A1': { x: 50, y: 50 }, 'A2': { x: 500, y: 50 }, 'A3': { x: 950, y: 50 },
  'A8': { x: 50, y: 500 }, 'A4': { x: 950, y: 500 },
  'A7': { x: 50, y: 950 }, 'A6': { x: 500, y: 950 }, 'A5': { x: 950, y: 950 },

  'R1': { x: 200, y: 200 }, 'R2': { x: 500, y: 200 }, 'R3': { x: 800, y: 200 },
  'R8': { x: 200, y: 500 }, 'R4': { x: 800, y: 500 },
  'R7': { x: 200, y: 800 }, 'R6': { x: 500, y: 800 }, 'R5': { x: 800, y: 800 },

  'E1': { x: 350, y: 350 }, 'E2': { x: 500, y: 350 }, 'E3': { x: 650, y: 350 },
  'E8': { x: 350, y: 500 }, 'E4': { x: 650, y: 500 },
  'E7': { x: 350, y: 650 }, 'E6': { x: 500, y: 650 }, 'E5': { x: 650, y: 650 },
};

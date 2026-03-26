/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Player = 1 | 2;

export type GamePhase = 'PLACING' | 'MOVING' | 'FLYING' | 'SHOOTING' | 'GAME_OVER';

export type PointId = 
  | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8'
  | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8'
  | 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6' | 'E7' | 'E8';

export interface BoardState {
  [key: string]: Player | null;
}

export interface Mill {
  points: [PointId, PointId, PointId];
}

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  phase: GamePhase;
  cowsToPlace: { [key in Player]: number };
  cowsOnBoard: { [key in Player]: number };
  cowsLost: { [key in Player]: number };
  history: GameAction[];
  lastMillPoints: PointId[] | null;
  winner: Player | null;
  moveCountWithoutCapture: number; // For draw condition
  lastFormedMills: { [key in Player]: string[] }; // To prevent immediate re-formation of same mill
}

export type GameActionType = 'PLACE' | 'MOVE' | 'SHOOT' | 'RESET';

export interface GameAction {
  type: GameActionType;
  player: Player;
  from?: PointId;
  to?: PointId;
  timestamp: number;
}

export interface MoveResult {
  isValid: boolean;
  error?: string;
  newState?: GameState;
}

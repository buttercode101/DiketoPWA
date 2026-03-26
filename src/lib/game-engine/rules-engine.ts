/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ADJACENCY_MAP, MILLS, POINT_IDS } from "./board-utils";
import { BoardState, GameState, Player, PointId } from "./types";

/**
 * Checks if a point is part of any mill for a given player.
 */
export const isPointInMill = (board: BoardState, pointId: PointId, player: Player): boolean => {
  return MILLS.some(mill => 
    mill.includes(pointId) && mill.every(p => board[p] === player)
  );
};

/**
 * Returns all mills that a point is currently part of for a given player.
 */
export const getMillsForPoint = (board: BoardState, pointId: PointId, player: Player): PointId[][] => {
  return MILLS.filter(mill => 
    mill.includes(pointId) && mill.every(p => board[p] === player)
  );
};

/**
 * Checks if an opponent's cow can be shot.
 * Official Rule: You cannot shoot a cow in a mill unless all opponent cows are in mills.
 */
export const canShootPoint = (state: GameState, pointId: PointId): boolean => {
  const opponent = state.currentPlayer === 1 ? 2 : 1;
  if (state.board[pointId] !== opponent) return false;

  const opponentCows = POINT_IDS.filter(id => state.board[id] === opponent);
  const cowsInMills = opponentCows.filter(id => isPointInMill(state.board, id, opponent));

  // If all opponent cows are in mills, any can be shot.
  if (cowsInMills.length === opponentCows.length) return true;

  // Otherwise, only cows NOT in mills can be shot.
  return !isPointInMill(state.board, pointId, opponent);
};

/**
 * Gets all legal moves for the current player based on the game phase.
 */
export const getLegalMoves = (state: GameState): { from?: PointId; to: PointId }[] => {
  const player = state.currentPlayer;
  const moves: { from?: PointId; to: PointId }[] = [];

  if (state.phase === 'PLACING') {
    POINT_IDS.forEach(id => {
      if (state.board[id] === null) moves.push({ to: id });
    });
  } else if (state.phase === 'MOVING' || state.phase === 'FLYING') {
    const playerCows = POINT_IDS.filter(id => state.board[id] === player);
    playerCows.forEach(from => {
      if (state.phase === 'FLYING') {
        POINT_IDS.forEach(to => {
          if (state.board[to] === null) moves.push({ from, to });
        });
      } else {
        ADJACENCY_MAP[from].forEach(to => {
          if (state.board[to] === null) moves.push({ from, to });
        });
      }
    });
  }

  return moves;
};

/**
 * Checks if the game has ended and returns the winner if any.
 */
export const checkWinCondition = (state: GameState): Player | 'DRAW' | null => {
  const opponent = state.currentPlayer === 1 ? 2 : 1;
  const opponentCowsOnBoard = state.cowsOnBoard[opponent];
  const opponentCowsToPlace = state.cowsToPlace[opponent];

  // Draw condition: both have 3 cows and no capture in 10 moves
  if (state.cowsOnBoard[1] === 3 && state.cowsOnBoard[2] === 3 && state.moveCountWithoutCapture >= 20) {
    return 'DRAW';
  }

  // A player loses if they have fewer than 3 cows on the board after the placing phase.
  if (opponentCowsToPlace === 0 && opponentCowsOnBoard < 3) {
    return state.currentPlayer;
  }

  // A player loses if they have no legal moves.
  const legalMoves = getLegalMoves({ ...state, currentPlayer: opponent });
  if (legalMoves.length === 0 && opponentCowsToPlace === 0) {
    return state.currentPlayer;
  }

  return null;
};

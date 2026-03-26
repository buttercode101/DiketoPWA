/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameState, GameAction, Player, PointId } from "./types";
import { getLegalMoves, checkWinCondition, isPointInMill } from "./rules-engine";
import { processAction } from "./game-logic";
import { POINT_IDS } from "./board-utils";

/**
 * Heuristic evaluation function for Morabaraba.
 * Positive values favor Player 1, negative favor Player 2.
 */
export const evaluateBoard = (state: GameState): number => {
  if (state.winner === 1) return 100000;
  if (state.winner === 2) return -100000;

  let score = 0;

  // 1. Piece count (Material) - Very important
  const materialScore = (state.cowsOnBoard[1] - state.cowsOnBoard[2]) * 1000;
  const placementScore = (state.cowsToPlace[1] - state.cowsToPlace[2]) * 500;
  score += materialScore + placementScore;

  // 2. Mills - High priority
  const p1Mills = POINT_IDS.filter(id => state.board[id] === 1 && isPointInMill(state.board, id, 1)).length / 3;
  const p2Mills = POINT_IDS.filter(id => state.board[id] === 2 && isPointInMill(state.board, id, 2)).length / 3;
  score += (p1Mills - p2Mills) * 2000;

  // 3. Mobility - Important for not getting blocked
  const p1Moves = getLegalMoves({ ...state, currentPlayer: 1 }).length;
  const p2Moves = getLegalMoves({ ...state, currentPlayer: 2 }).length;
  score += (p1Moves - p2Moves) * 50;

  // 4. Double Mills (Mora) - Extremely strong position
  // A point that belongs to two mills
  const countDoubleMills = (player: Player) => {
    let doubleMills = 0;
    POINT_IDS.forEach(id => {
      if (state.board[id] === player) {
        const mills = getMillsForPoint(id);
        let activeMills = 0;
        mills.forEach(mill => {
          if (mill.every(p => state.board[p] === player)) activeMills++;
        });
        if (activeMills > 1) doubleMills++;
      }
    });
    return doubleMills;
  };
  score += (countDoubleMills(1) - countDoubleMills(2)) * 3000;

  // 5. Blocked Pieces
  const countBlocked = (player: Player) => {
    let blocked = 0;
    POINT_IDS.forEach(id => {
      if (state.board[id] === player) {
        const neighbors = ADJACENCY_MAP[id];
        if (neighbors.every(n => state.board[n] !== null)) blocked++;
      }
    });
    return blocked;
  };
  score -= (countBlocked(1) - countBlocked(2)) * 200;

  return score;
};

// Helper for evaluateBoard
import { getMillsForPoint, ADJACENCY_MAP } from "./board-utils";

/**
 * Minimax with Alpha-Beta Pruning and Iterative Deepening.
 */
export const minimax = (
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): { score: number; action?: GameAction } => {
  if (depth === 0 || state.phase === 'GAME_OVER') {
    return { score: evaluateBoard(state) };
  }

  const legalMoves = getLegalMoves(state);

  // IMPROVED: Move ordering for better alpha-beta pruning
  legalMoves.sort((a, b) => {
    const statePhase = state.phase;
    
    // Priority 1: Shooting moves (highest impact)
    if (statePhase === 'SHOOTING') {
      // Prefer shooting pieces not in mill
      const aInMill = a.to && isPointInMill(state.board, a.to, state.currentPlayer === 1 ? 2 : 1);
      const bInMill = b.to && isPointInMill(state.board, b.to, state.currentPlayer === 1 ? 2 : 1);
      if (aInMill && !bInMill) return 1;
      if (!aInMill && bInMill) return -1;
      return 0;
    }
    
    // Priority 2: Moves that form mills
    if (statePhase === 'PLACING' || statePhase === 'MOVING' || statePhase === 'FLYING') {
      const testState = { ...state };
      if (a.to) {
        testState.board[a.to] = state.currentPlayer;
        const aFormsMill = getMillsForPoint(testState.board, a.to!, state.currentPlayer).length > 0;
        if (aFormsMill) return -1;
      }
      if (b.to) {
        testState.board[b.to] = state.currentPlayer;
        const bFormsMill = getMillsForPoint(testState.board, b.to!, state.currentPlayer).length > 0;
        if (bFormsMill) return 1;
      }
    }
    
    // Priority 3: Center control (heuristic)
    const centerPoints = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'];
    const aIsCenter = a.to && centerPoints.includes(a.to);
    const bIsCenter = b.to && centerPoints.includes(b.to);
    if (aIsCenter && !bIsCenter) return -1;
    if (!aIsCenter && bIsCenter) return 1;
    
    return 0;
  });

  let bestAction: GameAction | undefined;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      const action: GameAction = {
        type: state.phase === 'SHOOTING' ? 'SHOOT' : (state.phase === 'PLACING' ? 'PLACE' : 'MOVE'),
        player: state.currentPlayer,
        from: move.from,
        to: move.to,
        timestamp: Date.now()
      };

      const result = processAction(state, action);
      if (result.isValid && result.newState) {
        const evalResult = minimax(result.newState, depth - 1, alpha, beta, false);
        if (evalResult.score > maxEval) {
          maxEval = evalResult.score;
          bestAction = action;
        }
        alpha = Math.max(alpha, evalResult.score);
        if (beta <= alpha) break; // Beta cutoff
      }
    }
    return { score: maxEval, action: bestAction };
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      const action: GameAction = {
        type: state.phase === 'SHOOTING' ? 'SHOOT' : (state.phase === 'PLACING' ? 'PLACE' : 'MOVE'),
        player: state.currentPlayer,
        from: move.from,
        to: move.to,
        timestamp: Date.now()
      };

      const result = processAction(state, action);
      if (result.isValid && result.newState) {
        const evalResult = minimax(result.newState, depth - 1, alpha, beta, true);
        if (evalResult.score < minEval) {
          minEval = evalResult.score;
          bestAction = action;
        }
        beta = Math.min(beta, evalResult.score);
        if (beta <= alpha) break; // Alpha cutoff
      }
    }
    return { score: minEval, action: bestAction };
  }
};

export const getBestMove = (state: GameState, difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'): GameAction | null => {
  const depthMap = {
    'EASY': 2,
    'MEDIUM': 3,
    'HARD': 4,
    'EXPERT': 5
  };
  
  const depth = depthMap[difficulty];
  const isMaximizing = state.currentPlayer === 1;
  const result = minimax(state, depth, -Infinity, Infinity, isMaximizing);
  
  return result.action || null;
};

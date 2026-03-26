/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ADJACENCY_MAP, POINT_IDS } from "./board-utils";
import { canShootPoint, checkWinCondition, getMillsForPoint } from "./rules-engine";
import { BoardState, GameAction, GameState, MoveResult, Player, PointId } from "./types";

/**
 * Initial game state for Morabaraba.
 */
export const INITIAL_STATE: GameState = {
  board: POINT_IDS.reduce((acc, id) => ({ ...acc, [id]: null }), {}),
  currentPlayer: 1,
  phase: 'PLACING',
  cowsToPlace: { 1: 12, 2: 12 },
  cowsOnBoard: { 1: 0, 2: 0 },
  cowsLost: { 1: 0, 2: 0 },
  history: [],
  lastMillPoints: null,
  winner: null,
  moveCountWithoutCapture: 0,
  lastFormedMills: { 1: [], 2: [] },
};

/**
 * Processes a game action and returns the new state or an error.
 */
export const processAction = (state: GameState, action: GameAction): MoveResult => {
  if (state.winner) return { isValid: false, error: 'Game is already over' };
  if (action.player !== state.currentPlayer) return { isValid: false, error: 'Not your turn' };

  const newState = { ...state, history: [...state.history, action] };

  switch (action.type) {
    case 'PLACE':
      return handlePlace(newState, action.to!);
    case 'MOVE':
      return handleMove(newState, action.from!, action.to!);
    case 'SHOOT':
      return handleShoot(newState, action.to!);
    default:
      return { isValid: false, error: 'Invalid action type' };
  }
};

const handlePlace = (state: GameState, to: PointId): MoveResult => {
  if (state.phase !== 'PLACING') return { isValid: false, error: 'Not in placing phase' };
  if (state.board[to] !== null) return { isValid: false, error: 'Point is already occupied' };

  const player = state.currentPlayer;
  state.board[to] = player;
  state.cowsToPlace[player]--;
  state.cowsOnBoard[player]++;

  const mills = getMillsForPoint(state.board, to, player);
  if (mills.length > 0) {
    state.phase = 'SHOOTING';
    state.lastMillPoints = mills[0]; // For visual highlighting
    return { isValid: true, newState: state };
  }

  return finalizeTurn(state);
};

const handleMove = (state: GameState, from: PointId, to: PointId): MoveResult => {
  if (state.phase !== 'MOVING' && state.phase !== 'FLYING') {
    return { isValid: false, error: 'Not in moving or flying phase' };
  }
  if (state.board[from] !== state.currentPlayer) {
    return { isValid: false, error: 'Not your cow' };
  }
  if (state.board[to] !== null) {
    return { isValid: false, error: 'Point is already occupied' };
  }

  if (state.phase === 'MOVING') {
    if (!ADJACENCY_MAP[from].includes(to)) {
      return { isValid: false, error: 'Points are not adjacent' };
    }
  }

  state.board[from] = null;
  state.board[to] = state.currentPlayer;
  state.moveCountWithoutCapture++;

  const mills = getMillsForPoint(state.board, to, state.currentPlayer);
  
  // GAR Rule: No immediate re-formation of the same mill
  const newMills = mills.filter(m => !state.lastFormedMills[state.currentPlayer].includes(m.join(',')));

  if (newMills.length > 0) {
    state.phase = 'SHOOTING';
    state.lastMillPoints = newMills[0];
    state.lastFormedMills[state.currentPlayer] = newMills.map(m => m.join(','));
    return { isValid: true, newState: state };
  }

  state.lastFormedMills[state.currentPlayer] = [];
  return finalizeTurn(state);
};

const handleShoot = (state: GameState, to: PointId): MoveResult => {
  if (state.phase !== 'SHOOTING') return { isValid: false, error: 'Not in shooting phase' };
  if (!canShootPoint(state, to)) return { isValid: false, error: 'Cannot shoot this cow' };

  const opponent = state.currentPlayer === 1 ? 2 : 1;
  state.board[to] = null;
  state.cowsOnBoard[opponent]--;
  state.cowsLost[opponent]++;
  state.moveCountWithoutCapture = 0; // Reset draw counter on capture

  return finalizeTurn(state);
};

const finalizeTurn = (state: GameState): MoveResult => {
  const player = state.currentPlayer;
  const opponent = player === 1 ? 2 : 1;

  // MSSA GAR Rule: 50-move draw rule
  // If 50 consecutive moves have been made without a capture, the game is a draw
  if (state.moveCountWithoutCapture >= 50) {
    state.phase = 'GAME_OVER';
    state.winner = null; // Draw
    return { isValid: true, newState: state };
  }

  // Switch player
  state.currentPlayer = opponent;
  state.lastMillPoints = null;

  // Update phase for next player
  if (state.cowsToPlace[opponent] > 0) {
    state.phase = 'PLACING';
  } else if (state.cowsOnBoard[opponent] === 3) {
    state.phase = 'FLYING';
  } else {
    state.phase = 'MOVING';
  }

  // Check win condition
  const win = checkWinCondition(state);
  if (win) {
    if (win === 'DRAW') {
      state.phase = 'GAME_OVER';
      state.winner = null; // Draw
    } else {
      state.phase = 'GAME_OVER';
      state.winner = win;
    }
  }

  return { isValid: true, newState: state };
};

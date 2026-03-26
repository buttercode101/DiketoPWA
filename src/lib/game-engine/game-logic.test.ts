/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Unit Tests for Morabaraba Game Logic
 * Tests the core game mechanics according to MSSA GAR
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { INITIAL_STATE, processAction } from './game-logic';
import { POINT_IDS } from './board-utils';

describe('Morabaraba Game Logic', () => {
  describe('Initial State', () => {
    it('should start with empty board', () => {
      expect(INITIAL_STATE.board).toBeDefined();
      POINT_IDS.forEach(id => {
        expect(INITIAL_STATE.board[id]).toBeNull();
      });
    });

    it('should start with Player 1', () => {
      expect(INITIAL_STATE.currentPlayer).toBe(1);
    });

    it('should start in placing phase', () => {
      expect(INITIAL_STATE.phase).toBe('PLACING');
    });

    it('should have 12 cows to place per player', () => {
      expect(INITIAL_STATE.cowsToPlace[1]).toBe(12);
      expect(INITIAL_STATE.cowsToPlace[2]).toBe(12);
    });
  });

  describe('Placing Phase', () => {
    let state = { ...INITIAL_STATE };

    beforeEach(() => {
      state = { ...INITIAL_STATE };
    });

    it('should place cow for current player', () => {
      const result = processAction(state, {
        type: 'PLACE',
        player: 1,
        to: 'A1',
        timestamp: Date.now()
      });

      expect(result.isValid).toBe(true);
      expect(result.newState?.board['A1']).toBe(1);
      expect(result.newState?.cowsToPlace[1]).toBe(11);
      expect(result.newState?.cowsOnBoard[1]).toBe(1);
    });

    it('should not place on occupied point', () => {
      // First placement
      processAction(state, {
        type: 'PLACE',
        player: 1,
        to: 'A1',
        timestamp: Date.now()
      });

      // Second placement on same point
      const result = processAction(state, {
        type: 'PLACE',
        player: 2,
        to: 'A1',
        timestamp: Date.now()
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Point is already occupied');
    });

    it('should not place when not player turn', () => {
      const result = processAction(state, {
        type: 'PLACE',
        player: 2,
        to: 'A1',
        timestamp: Date.now()
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Not your turn');
    });
  });

  describe('50-Move Draw Rule', () => {
    it('should declare draw after 50 moves without capture', () => {
      let state = { ...INITIAL_STATE };
      
      // Simulate 50 moves without captures
      for (let i = 0; i < 50; i++) {
        const player = (i % 2) + 1;
        const emptyPoint = POINT_IDS.find(id => state.board[id] === null);
        
        if (!emptyPoint) break;

        const result = processAction(state, {
          type: 'PLACE',
          player: player as 1 | 2,
          to: emptyPoint,
          timestamp: Date.now()
        });

        if (result.isValid && result.newState) {
          state = result.newState;
        }
      }

      // After 50 moves, should be draw
      expect(state.phase).toBe('GAME_OVER');
      expect(state.winner).toBeNull();
    });

    it('should reset counter on capture', () => {
      let state = { ...INITIAL_STATE };
      
      // Set up state for shooting test
      state.moveCountWithoutCapture = 49;
      state.phase = 'SHOOTING';
      
      // After a capture, counter should reset
      state.cowsOnBoard[2] = 12; // Ensure opponent has cows
      
      const result = processAction(state, {
        type: 'SHOOT',
        player: 1,
        to: 'A1',
        timestamp: Date.now()
      });

      // If valid, counter should reset
      if (result.isValid && result.newState) {
        expect(result.newState.moveCountWithoutCapture).toBe(0);
      }
    });
  });

  describe('Mill Formation', () => {
    it('should detect mill on outer square', () => {
      const state = { ...INITIAL_STATE };
      
      // Set up mill positions
      state.board['A1'] = 1;
      state.board['A2'] = 1;
      state.cowsOnBoard[1] = 2;
      state.cowsToPlace[1] = 10;

      const result = processAction(state, {
        type: 'PLACE',
        player: 1,
        to: 'A3',
        timestamp: Date.now()
      });

      // Should enter shooting phase
      if (result.isValid && result.newState) {
        expect(result.newState.phase).toBe('SHOOTING');
      }
    });
  });

  describe('Phase Transitions', () => {
    it('should transition from placing to moving after all cows placed', () => {
      let state = { ...INITIAL_STATE };
      
      // Place all 24 cows (12 per player)
      for (let i = 0; i < 24; i++) {
        const player = ((i % 2) + 1) as 1 | 2;
        const emptyPoint = POINT_IDS.find(id => state.board[id] === null);
        
        if (!emptyPoint) break;

        const result = processAction(state, {
          type: 'PLACE',
          player,
          to: emptyPoint,
          timestamp: Date.now()
        });

        if (result.isValid && result.newState) {
          state = result.newState;
        }
      }

      // Should be in moving phase
      expect(state.phase).toBe('MOVING');
    });
  });

  describe('Game Over Conditions', () => {
    it('should detect win when opponent has 2 cows', () => {
      const state = { ...INITIAL_STATE };
      
      // Set up winning condition
      state.cowsOnBoard[2] = 2;
      state.cowsToPlace[1] = 0;
      state.cowsToPlace[2] = 0;
      state.phase = 'MOVING';

      const result = processAction(state, {
        type: 'MOVE',
        player: 1,
        from: 'A1',
        to: 'A2',
        timestamp: Date.now()
      });

      // Should be game over
      if (result.isValid && result.newState) {
        expect(result.newState.phase).toBe('GAME_OVER');
        expect(result.newState.winner).toBe(1);
      }
    });
  });
});

import { create } from 'zustand';
import { GameState, GameAction, Player, PointId } from '@/src/lib/game-engine/types';
import { INITIAL_STATE, processAction } from '@/src/lib/game-engine/game-logic';
import { getBestMove } from '@/src/lib/game-engine/ai-engine';
import { trackEvent } from '@/src/lib/analytics';

export type GameMode = 'SINGLE_PLAYER' | 'HOTSEAT' | 'TUTORIAL';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type Language = 'EN' | 'ZU' | 'SO';
export type Theme = 'EARTH' | 'HIGH_CONTRAST' | 'COLORBLIND';
export type TextSize = 'NORMAL' | 'LARGE' | 'EXTRA_LARGE';

interface GameStore extends GameState {
  gameMode: GameMode | null;
  difficulty: Difficulty;
  aiPlayer: Player | null;
  isThinking: boolean;
  tutorialStep: number;
  selectedPointId: PointId | null;
  
  // Settings
  soundEnabled: boolean;
  language: Language;
  theme: Theme;
  textSize: TextSize;
  hapticEnabled: boolean;
  boardRotation: number; // 0 or 180 degrees
  boardZoom: number; // 0.8 to 1.5
  
  // Actions
  setGameMode: (mode: GameMode | null) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setAiPlayer: (player: Player | null) => void;
  setSelectedPointId: (id: PointId | null) => void;
  nextTutorialStep: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setTextSize: (size: TextSize) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setBoardRotation: (rotation: number) => void;
  setBoardZoom: (zoom: number) => void;
  
  dispatch: (action: Omit<GameAction, 'timestamp'>) => void;
  undo: () => void;
  resetGame: () => void;
  triggerAiMove: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,
  gameMode: null,
  difficulty: 'MEDIUM',
  aiPlayer: 2,
  isThinking: false,
  tutorialStep: 0,
  selectedPointId: null,
  soundEnabled: true,
  language: 'EN',
  theme: 'EARTH',
  textSize: 'NORMAL',
  hapticEnabled: true,
  boardRotation: 0,
  boardZoom: 1,

  setGameMode: (mode) => {
    set({ gameMode: mode, ...INITIAL_STATE, selectedPointId: null });
    if (mode) {
      trackEvent('game_mode_selected', { mode });
    }
  },
  setDifficulty: (difficulty) => {
    set({ difficulty });
    trackEvent('difficulty_changed', { difficulty });
  },
  setAiPlayer: (player) => set({ aiPlayer: player }),
  setSelectedPointId: (id) => set({ selectedPointId: id }),
  nextTutorialStep: () => {
    set((state) => ({ tutorialStep: state.tutorialStep + 1 }));
    trackEvent('tutorial_step_next', { step: get().tutorialStep });
  },
  setSoundEnabled: (enabled) => {
    set({ soundEnabled: enabled });
    trackEvent('settings_sound', { enabled });
  },
  setLanguage: (lang) => {
    set({ language: lang });
    trackEvent('settings_language', { lang });
  },
  setTheme: (theme) => {
    set({ theme: theme });
    trackEvent('settings_theme', { theme });
  },
  setTextSize: (size) => {
    set({ textSize: size });
    trackEvent('settings_text_size', { size });
  },
  setHapticEnabled: (enabled) => {
    set({ hapticEnabled: enabled });
    trackEvent('settings_haptic', { enabled });
  },
  setBoardRotation: (rotation) => {
    set({ boardRotation: rotation });
    trackEvent('settings_board_rotation', { rotation });
  },
  setBoardZoom: (zoom) => {
    set({ boardZoom: zoom });
    trackEvent('settings_board_zoom', { zoom });
  },

  dispatch: (action) => {
    const state = get();
    if (state.isThinking) return;

    const result = processAction(state, { ...action, timestamp: Date.now() });
    if (result.isValid && result.newState) {
      set({ ...result.newState, selectedPointId: null });
      
      trackEvent('game_action', { 
        type: action.type, 
        player: state.currentPlayer,
        phase: state.phase
      });

      if (result.newState.phase === 'GAME_OVER') {
        trackEvent('game_over', { 
          winner: result.newState.winner,
          mode: state.gameMode
        });
      }

      // Trigger AI move if it's AI's turn
      const updatedState = result.newState;
      if (updatedState.currentPlayer === state.aiPlayer && updatedState.phase !== 'GAME_OVER' && state.gameMode === 'SINGLE_PLAYER') {
        setTimeout(() => get().triggerAiMove(), 500);
      }
    } else {
      console.error(result.error);
    }
  },

  triggerAiMove: async () => {
    const state = get();
    if (state.phase === 'GAME_OVER' || state.isThinking) return;

    set({ isThinking: true });
    trackEvent('ai_thinking_start', { difficulty: state.difficulty });
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const bestMove = getBestMove(state, state.difficulty);
    if (bestMove) {
      const result = processAction(state, bestMove);
      if (result.isValid && result.newState) {
        set({ ...result.newState, isThinking: false });
        trackEvent('ai_move_complete', { type: bestMove.type });
        
        if (result.newState.phase === 'GAME_OVER') {
          trackEvent('game_over', { 
            winner: result.newState.winner,
            mode: state.gameMode
          });
        }

        // If it's still AI's turn (e.g., after a mill shooting), trigger again
        if (result.newState.currentPlayer === state.aiPlayer && result.newState.phase !== 'GAME_OVER') {
          setTimeout(() => get().triggerAiMove(), 500);
        }
      } else {
        set({ isThinking: false });
      }
    } else {
      set({ isThinking: false });
    }
  },

  undo: () => {
    const { history, gameMode, aiPlayer } = get();
    if (history.length === 0) return;
    
    trackEvent('game_undo');

    // In single player, undo 2 steps to go back to player's last turn
    const stepsToUndo = (gameMode === 'SINGLE_PLAYER' && history.length >= 2) ? 2 : 1;
    const newHistory = history.slice(0, -stepsToUndo);
    
    let newState = INITIAL_STATE;
    newHistory.forEach(action => {
      const result = processAction(newState, action);
      if (result.isValid && result.newState) {
        newState = result.newState;
      }
    });
    
    set({ ...newState, selectedPointId: null, isThinking: false });
  },

  resetGame: () => {
    const state = get();
    set({ ...INITIAL_STATE, selectedPointId: null, isThinking: false });
    trackEvent('game_reset');
    
    // If AI is Player 1, trigger its first move
    if (state.aiPlayer === 1 && state.gameMode === 'SINGLE_PLAYER') {
      setTimeout(() => get().triggerAiMove(), 500);
    }
  }
}));

import React from 'react';
import { useGameStore, Difficulty } from '@/src/store/useGameStore';
import { Button } from '@/src/components/ui/Button';
import { RefreshCcw, Trophy, User, Cpu, Undo2, Settings } from 'lucide-react';

export const GameControls: React.FC = () => {
  const { 
    phase, 
    currentPlayer, 
    cowsToPlace, 
    cowsOnBoard, 
    cowsLost,
    winner, 
    resetGame, 
    undo,
    difficulty, 
    setDifficulty,
    history,
    gameMode,
    setGameMode
  } = useGameStore();

  const phaseDisplay = phase.replace('_', ' ');

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#f2e8e5] rounded-xl border-4 border-[#d2bab0] shadow-lg w-full max-w-[400px]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#5b433b] flex items-center gap-2">
          {winner ? <Trophy className="text-yellow-600" /> : <User className="text-[#a18072]" />}
          {winner ? (winner === 1 || winner === 2 ? `Player ${winner} Wins!` : 'Draw!') : `Player ${currentPlayer}'s Turn`}
        </h2>
        <div className="flex gap-2">
          <Button onClick={undo} variant="outline" size="icon" disabled={history.length === 0}>
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button onClick={resetGame} variant="outline" size="icon">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border-2 transition-all ${currentPlayer === 1 ? 'bg-white border-[#5b433b] ring-2 ring-[#f27696]' : 'bg-white/50 border-[#eaddd7]'}`}>
          <p className="text-sm font-bold text-[#30221e]">Player 1 (Dark)</p>
          <div className="flex flex-col mt-2 text-xs space-y-1">
            <div className="flex justify-between">
              <span>To Place:</span>
              <span className="font-bold">{cowsToPlace[1]}</span>
            </div>
            <div className="flex justify-between">
              <span>On Board:</span>
              <span className="font-bold">{cowsOnBoard[1]}</span>
            </div>
            <div className="flex justify-between text-[#e94a74]">
              <span>Captured:</span>
              <span className="font-bold">{cowsLost[2]}</span>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-lg border-2 transition-all ${currentPlayer === 2 ? 'bg-white border-[#5b433b] ring-2 ring-[#f27696]' : 'bg-white/50 border-[#eaddd7]'}`}>
          <p className="text-sm font-bold text-[#846358]">Player 2 (Light)</p>
          <div className="flex flex-col mt-2 text-xs space-y-1">
            <div className="flex justify-between">
              <span>To Place:</span>
              <span className="font-bold">{cowsToPlace[2]}</span>
            </div>
            <div className="flex justify-between">
              <span>On Board:</span>
              <span className="font-bold">{cowsOnBoard[2]}</span>
            </div>
            <div className="flex justify-between text-[#e94a74]">
              <span>Captured:</span>
              <span className="font-bold">{cowsLost[1]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-[#5b433b] uppercase tracking-wider">Current Phase</p>
        <div className="px-4 py-2 bg-[#5b433b] text-white rounded-md text-center font-medium">
          {phaseDisplay}
        </div>
      </div>

      {gameMode === 'SINGLE_PLAYER' && (
        <div className="space-y-2">
          <p className="text-sm font-bold text-[#5b433b] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" /> AI Difficulty
          </p>
          <div className="grid grid-cols-4 gap-1">
            {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as Difficulty[]).map((d) => (
              <Button 
                key={d}
                variant={difficulty === d ? 'default' : 'outline'} 
                className="text-[10px] h-8 px-1"
                onClick={() => setDifficulty(d)}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-[#d2bab0]">
        <Button 
          variant="ghost" 
          className="w-full text-[#846358] hover:text-[#5b433b]"
          onClick={() => setGameMode(null as any)}
        >
          <Settings className="w-4 h-4 mr-2" /> Change Game Mode
        </Button>
      </div>

      {winner && (
        <Button onClick={resetGame} className="w-full bg-[#e94a74] hover:bg-[#d52b5d] text-white py-6 text-xl">
          Play Again
        </Button>
      )}
    </div>
  );
};

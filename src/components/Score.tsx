import React from 'react';
import { Trophy } from 'lucide-react';

interface ScoreProps {
  score: number;
  highScore: number;
}

export const Score: React.FC<ScoreProps> = ({ score, highScore }) => {
  return (
    <div className="absolute top-4 left-4 z-10 space-y-2">
      <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg">
        <div className="text-sm text-gray-600 font-medium">Score</div>
        <div className="text-3xl font-bold text-blue-600">{score}</div>
      </div>
      {highScore > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-medium">Best</span>
          </div>
          <div className="text-2xl font-bold text-white">{highScore}</div>
        </div>
      )}
    </div>
  );
}
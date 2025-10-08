import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center mx-4 transform transition-all">
        <h2 className="text-3xl font-bold mb-4 text-blue-600">Game Over!</h2>
        <p className="text-2xl mb-6 text-gray-700">Score: {score}</p>
        <button
          onClick={onRestart}
          className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
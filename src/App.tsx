import React, { useEffect, useRef, useState } from 'react';
import { Game } from './game/Game';
import { GameOver } from './components/GameOver';
import { Score } from './components/Score';
import { MobileControls } from './components/MobileControls';

function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const updateCanvasSize = () => {
      const maxWidth = Math.min(400, window.innerWidth - 40);
      const aspectRatio = 3/2;
      const height = maxWidth * aspectRatio;

      canvas.style.width = `${maxWidth}px`;
      canvas.style.height = `${height}px`;
      canvas.width = maxWidth;
      canvas.height = height;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    gameRef.current = new Game(canvas, setScore, setGameOver, setHighScore);
    gameRef.current.loadHighScore();
    gameRef.current.start();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (gameRef.current) {
        gameRef.current.stop();
      }
    };
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    if (gameRef.current) {
      gameRef.current.start();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4 touch-none select-none overflow-hidden">
      <div className="relative max-w-[400px] w-full mx-auto">
        <canvas
          ref={canvasRef}
          className="border-4 border-blue-600 rounded-lg bg-white shadow-lg w-full h-full touch-none pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#e0e7ff 1px, transparent 1px), linear-gradient(90deg, #e0e7ff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            touchAction: 'none'
          }}
        />
        <Score score={score} highScore={highScore} />
        {gameOver && <GameOver score={score} onRestart={handleRestart} />}
        <MobileControls game={gameRef.current} />
      </div>
    </div>
  );
}

export default App
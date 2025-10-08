import React, { useCallback } from 'react';
import { Game } from '../game/Game';

interface MobileControlsProps {
  game: Game | null;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ game }) => {
  const handleTouchStart = useCallback((area: 'left' | 'right' | 'center') => (e: React.TouchEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!game) return;

    switch (area) {
      case 'left':
        game.moveLeft();
        break;
      case 'right':
        game.moveRight();
        break;
      case 'center':
        game.startShooting();
        break;
    }
  }, [game]);

  const handleTouchEnd = useCallback((area: 'left' | 'right' | 'center') => (e: React.TouchEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!game) return;

    switch (area) {
      case 'left':
      case 'right':
        game.stopMoving();
        break;
      case 'center':
        game.stopShooting();
        break;
    }
  }, [game]);

  return (
    <div className="fixed inset-0 touch-none pointer-events-none z-10">
      {/* Left control area */}
      <div
        className="absolute left-0 top-0 w-1/3 h-full pointer-events-auto bg-transparent active:bg-blue-200/20"
        onPointerDown={handleTouchStart('left')}
        onPointerUp={handleTouchEnd('left')}
        onPointerCancel={handleTouchEnd('left')}
        onPointerLeave={handleTouchEnd('left')}
        style={{ touchAction: 'none', userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
      />

      {/* Center control area */}
      <div
        className="absolute left-1/3 top-0 w-1/3 h-full pointer-events-auto bg-transparent active:bg-red-200/20"
        onPointerDown={handleTouchStart('center')}
        onPointerUp={handleTouchEnd('center')}
        onPointerCancel={handleTouchEnd('center')}
        onPointerLeave={handleTouchEnd('center')}
        style={{ touchAction: 'none', userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
      />

      {/* Right control area */}
      <div
        className="absolute right-0 top-0 w-1/3 h-full pointer-events-auto bg-transparent active:bg-blue-200/20"
        onPointerDown={handleTouchStart('right')}
        onPointerUp={handleTouchEnd('right')}
        onPointerCancel={handleTouchEnd('right')}
        onPointerLeave={handleTouchEnd('right')}
        style={{ touchAction: 'none', userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
      />
    </div>
  );
}
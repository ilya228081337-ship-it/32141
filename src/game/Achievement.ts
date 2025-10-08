export type AchievementType =
  | 'SCORE_500'
  | 'SCORE_1000'
  | 'SCORE_2500'
  | 'SCORE_5000'
  | 'KILL_5_MONSTERS'
  | 'KILL_10_MONSTERS'
  | 'KILL_25_MONSTERS'
  | 'FIRST_ROCKET'
  | 'SURVIVE_2MIN'
  | 'BREAK_10_PLATFORMS';

export class Achievement {
  private message: string;
  public type: AchievementType;
  private opacity: number;
  private showTimer: number | null;

  constructor(type: AchievementType, message: string) {
    this.type = type;
    this.message = message;
    this.opacity = 0;
    this.showTimer = null;
  }

  public show() {
    this.opacity = 1;
    
    if (this.showTimer) {
      clearTimeout(this.showTimer);
    }
    
    // Show achievement for 3 seconds
    this.showTimer = window.setTimeout(() => {
      this.opacity = 0;
    }, 3000);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.opacity <= 0) return;

    const x = 20;
    const y = 60;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    // Achievement background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.roundRect(x, y, 200, 40, 8);
    ctx.fill();
    
    // Achievement text
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Achievement Unlocked!', x + 10, y + 15);
    
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(this.message, x + 10, y + 30);
    
    ctx.restore();
  }
}
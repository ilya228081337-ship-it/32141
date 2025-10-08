export class Bullet {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public velocityY: number;
  public isActive: boolean;

  constructor(x: number, y: number, direction: 'left' | 'right') {
    this.x = x;
    this.y = y;
    this.width = 8; // Increased size
    this.height = 8; // Increased size
    this.velocityY = -15;
    this.isActive = true;
  }

  public update() {
    this.y += this.velocityY;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    // Larger, more visible bullet with glow effect
    ctx.save();
    
    // Glow effect
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    
    // Main bullet
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Bullet trail
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + 10);
    ctx.stroke();
    
    ctx.restore();
  }

  public checkCollision(monster: Monster): boolean {
    return (
      this.x < monster.x + monster.width &&
      this.x + this.width > monster.x &&
      this.y < monster.y + monster.height &&
      this.y + this.height > monster.y
    );
  }
}
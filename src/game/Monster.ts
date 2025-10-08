export class Monster {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public velocityX: number;
  public isActive: boolean;
  private frame: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.velocityX = 1; // Slower monster movement
    this.isActive = true;
    this.frame = 0;
  }

  public update() {
    this.frame = (this.frame + 1) % 60;
    this.x += this.velocityX;
    if (this.x > 400 || this.x < 0) {
      this.velocityX *= -1;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const bounce = Math.sin(this.frame * 0.1) * 3;
    
    ctx.fillStyle = '#FF6B6B';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Body with bounce effect
    ctx.beginPath();
    ctx.roundRect(this.x, this.y + bounce, this.width, this.height, 10);
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 8, this.y + 12 + bounce, 6, 6);
    ctx.fillRect(this.x + 26, this.y + 12 + bounce, 6, 6);

    // Angry eyebrows
    ctx.beginPath();
    ctx.moveTo(this.x + 6, this.y + 10 + bounce);
    ctx.lineTo(this.x + 16, this.y + 8 + bounce);
    ctx.moveTo(this.x + 24, this.y + 8 + bounce);
    ctx.lineTo(this.x + 34, this.y + 10 + bounce);
    ctx.stroke();

    // Spiky teeth
    ctx.beginPath();
    ctx.moveTo(this.x + 12, this.y + 28 + bounce);
    ctx.lineTo(this.x + 16, this.y + 32 + bounce);
    ctx.lineTo(this.x + 20, this.y + 28 + bounce);
    ctx.lineTo(this.x + 24, this.y + 32 + bounce);
    ctx.lineTo(this.x + 28, this.y + 28 + bounce);
    ctx.stroke();
  }
}
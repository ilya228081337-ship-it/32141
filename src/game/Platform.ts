export class Platform {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public type: 'normal' | 'spring' | 'rocket' | 'breakable';
  public isBroken: boolean;

  constructor(x: number, y: number, type: 'normal' | 'spring' | 'rocket' | 'breakable' = 'normal') {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 10;
    this.type = type;
    this.isBroken = false;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.type === 'breakable' && this.isBroken) {
      // Draw broken platform pieces
      ctx.fillStyle = '#4169E1';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;

      const pieceWidth = this.width / 3;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(this.x + i * pieceWidth, this.y + i * 2);
        ctx.rotate((i - 1) * 0.2);
        ctx.beginPath();
        ctx.roundRect(0, 0, pieceWidth - 2, this.height, 3);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      return;
    }

    ctx.fillStyle = this.type === 'spring' ? '#FFB6C1' :
                   this.type === 'rocket' ? '#FF4500' :
                   this.type === 'breakable' ? '#4169E1' : '#90EE90';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 5);
    ctx.fill();
    ctx.stroke();

    // Draw spring or rocket indicator
    if (this.type === 'spring') {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2 - 5, this.y);
      ctx.lineTo(this.x + this.width / 2 + 5, this.y - 8);
      ctx.stroke();
    } else if (this.type === 'rocket') {
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height);
      ctx.lineTo(this.x + this.width / 2 - 5, this.y + this.height + 8);
      ctx.lineTo(this.x + this.width / 2 + 5, this.y + this.height + 8);
      ctx.fill();
    } else if (this.type === 'breakable') {
      // Draw cracks on breakable platform
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 3, this.y);
      ctx.lineTo(this.x + this.width / 3, this.y + this.height);
      ctx.moveTo(this.x + (this.width * 2) / 3, this.y);
      ctx.lineTo(this.x + (this.width * 2) / 3, this.y + this.height);
      ctx.stroke();
    }
  }

  public break() {
    if (this.type === 'breakable') {
      this.isBroken = true;
    }
  }
}
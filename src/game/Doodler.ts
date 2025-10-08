export class Doodler {
  public x: number;
  public y: number;
  public lastY: number;
  public width: number;
  public height: number;
  public velocityX: number;
  public velocityY: number;
  public direction: 'left' | 'right';
  public canShoot: boolean;
  private isRocketMode: boolean;
  private frame: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.lastY = y;
    this.width = 40;
    this.height = 40;
    this.velocityX = 0;
    this.velocityY = 0;
    this.direction = 'right';
    this.canShoot = true;
    this.isRocketMode = false;
    this.frame = 0;
  }

  public update() {
    this.frame = (this.frame + 1) % 60;
    this.lastY = this.y;
    
    if (this.isRocketMode) {
      this.velocityY = -15;
    } else {
      this.velocityY += 0.4;
    }
    
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Screen wrapping
    if (this.x > 400) this.x = 0;
    if (this.x < 0) this.x = 400;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (this.direction === 'left') ctx.scale(-1, 1);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));

    // Cat body
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Body
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      this.height / 2,
      0, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    // Ears
    const earWiggle = Math.sin(this.frame * 0.1) * 2;
    ctx.beginPath();
    ctx.moveTo(this.x + 10, this.y + 10 + earWiggle);
    ctx.lineTo(this.x + 5, this.y - 5);
    ctx.lineTo(this.x + 15, this.y + 5 + earWiggle);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x + 30, this.y + 10 + earWiggle);
    ctx.lineTo(this.x + 25, this.y - 5);
    ctx.lineTo(this.x + 35, this.y + 5 + earWiggle);
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#000';
    const eyeBlink = this.frame % 60 < 5 ? 1 : 3;
    ctx.fillRect(this.x + 12, this.y + 15, 4, eyeBlink);
    ctx.fillRect(this.x + 24, this.y + 15, 4, eyeBlink);

    // Nose
    ctx.fillStyle = '#FFA07A';
    ctx.beginPath();
    ctx.ellipse(this.x + 20, this.y + 22, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.beginPath();
    ctx.arc(this.x + 20, this.y + 25, 5, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // Rocket effect
    if (this.isRocketMode) {
      ctx.fillStyle = '#FF6B6B';
      ctx.beginPath();
      ctx.moveTo(this.x + 15, this.y + this.height);
      ctx.lineTo(this.x + 25, this.y + this.height + 20);
      ctx.lineTo(this.x + 35, this.y + this.height);
      ctx.fill();
    }

    ctx.restore();
  }

  public moveLeft() {
    this.velocityX = -5;
    this.direction = 'left';
  }

  public moveRight() {
    this.velocityX = 5;
    this.direction = 'right';
  }

  public stop() {
    this.velocityX = 0;
  }

  public jump() {
    this.velocityY = -12;
  }

  public superJump() {
    this.velocityY = -20;
  }

  public startRocket() {
    this.isRocketMode = true;
  }

  public stopRocket() {
    this.isRocketMode = false;
  }

  public checkCollision(platform: Platform): boolean {
    return (
      this.x < platform.x + platform.width &&
      this.x + this.width > platform.x &&
      this.y + this.height > platform.y &&
      this.y + this.height < platform.y + platform.height &&
      this.velocityY > 0
    );
  }

  public checkMonsterCollision(monster: Monster): boolean {
    return (
      this.x < monster.x + monster.width &&
      this.x + this.width > monster.x &&
      this.y < monster.y + monster.height &&
      this.y + this.height > monster.y
    );
  }
}
import { Doodler } from './Doodler';
import { Platform } from './Platform';
import { Monster } from './Monster';
import { PowerUp } from './PowerUp';
import { Bullet } from './Bullet';
import { Achievement, AchievementType } from './Achievement';
import { supabase } from '../lib/supabase';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private doodler: Doodler;
  private platforms: Platform[];
  private monsters: Monster[];
  private powerUps: PowerUp[];
  private bullets: Bullet[];
  private score: number;
  private gameLoop: number | null;
  private setScore: (score: number) => void;
  private setGameOver: (gameOver: boolean) => void;
  private cameraY: number;
  private isRocketMode: boolean;
  private achievements: Achievement[];
  private monstersKilled: number;
  private maxHeight: number;
  private rocketUsed: boolean;
  private shootingInterval: number | null;
  private lastMonsterSpawn: number;
  private isMovingLeft: boolean;
  private isMovingRight: boolean;
  private platformsBroken: number;
  private gameStartTime: number;
  private unlockedAchievements: Set<AchievementType>;
  private setHighScore: (highScore: number) => void;
  private highScore: number;

  constructor(
    canvas: HTMLCanvasElement,
    setScore: (score: number) => void,
    setGameOver: (gameOver: boolean) => void,
    setHighScore: (highScore: number) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setScore = setScore;
    this.setGameOver = setGameOver;
    this.setHighScore = setHighScore;
    this.score = 0;
    this.highScore = 0;
    this.gameLoop = null;
    this.cameraY = 0;
    this.isRocketMode = false;
    this.achievements = [];
    this.monstersKilled = 0;
    this.maxHeight = 0;
    this.rocketUsed = false;
    this.shootingInterval = null;
    this.lastMonsterSpawn = 0;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.platformsBroken = 0;
    this.gameStartTime = Date.now();
    this.unlockedAchievements = new Set();
    this.platforms = [];
    this.monsters = [];
    this.powerUps = [];
    this.bullets = [];
    this.doodler = new Doodler(0, 0);

    this.initializeGame();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft();
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight();
          break;
        case 'Space':
          this.startShooting();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
        case 'ArrowRight':
        case 'KeyD':
          this.stopMoving();
          break;
        case 'Space':
          this.stopShooting();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }

  private generateInitialPlatforms() {
    const platformCount = 7;
    const platformSpacing = 100;
    
    for (let i = 0; i < platformCount; i++) {
      const x = Math.random() * (this.canvas.width - 60);
      const y = this.canvas.height - 150 - i * platformSpacing;
      const type = i === 0 ? 'normal' :
                  Math.random() < 0.15 ? 'spring' :
                  Math.random() < 0.05 ? 'rocket' :
                  Math.random() < 0.1 ? 'breakable' : 'normal';
      
      this.platforms.push(new Platform(x, y, type));
    }
  }

  private initializeGame() {
    this.score = 0;
    this.monstersKilled = 0;
    this.maxHeight = 0;
    this.rocketUsed = false;
    this.isRocketMode = false;
    this.achievements = [];
    this.lastMonsterSpawn = 0;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.platformsBroken = 0;
    this.gameStartTime = Date.now();
    this.unlockedAchievements = new Set();
    
    if (this.shootingInterval) {
      clearInterval(this.shootingInterval);
      this.shootingInterval = null;
    }

    const startPlatform = new Platform(
      this.canvas.width / 2 - 30,
      this.canvas.height - 100,
      'normal'
    );
    
    this.doodler = new Doodler(
      startPlatform.x + startPlatform.width / 2 - 20,
      startPlatform.y - 40
    );
    
    this.doodler.velocityY = 0;
    
    this.platforms = [startPlatform];
    this.generateInitialPlatforms();
    
    this.monsters = [];
    this.powerUps = [];
    this.bullets = [];
    
    this.addMonster();
  }

  private addMonster() {
    const monsterY = this.doodler.y - this.canvas.height * 0.5;
    this.monsters.push(new Monster(
      Math.random() * (this.canvas.width - 40),
      monsterY
    ));
    this.lastMonsterSpawn = Date.now();
  }

  private update() {
    if (!this.gameLoop) return;

    // Update doodler movement based on current state
    if (this.isMovingLeft) {
      this.doodler.velocityX = -5;
      this.doodler.direction = 'left';
    } else if (this.isMovingRight) {
      this.doodler.velocityX = 5;
      this.doodler.direction = 'right';
    } else {
      this.doodler.velocityX = 0;
    }

    this.doodler.update();
    
    const targetY = -this.doodler.y + this.canvas.height * 0.6;
    this.cameraY = targetY;

    const timeSinceLastSpawn = Date.now() - this.lastMonsterSpawn;
    const spawnInterval = Math.max(2000 - this.score / 10, 1000);
    if (timeSinceLastSpawn > spawnInterval) {
      this.addMonster();
    }

    this.platforms = this.platforms.filter(platform => {
      return platform.y > this.doodler.y - this.canvas.height && 
             platform.y < this.doodler.y + this.canvas.height;
    });

    while (this.platforms.length < 12) {
      const type = Math.random() < 0.15 ? 'spring' :
                  Math.random() < 0.03 ? 'rocket' :
                  Math.random() < 0.12 ? 'breakable' : 'normal';
      
      const lastPlatform = this.platforms[this.platforms.length - 1];
      const newY = lastPlatform ? lastPlatform.y - 80 : this.doodler.y - this.canvas.height;
      
      this.platforms.push(new Platform(
        Math.random() * (this.canvas.width - 60),
        newY - Math.random() * 20,
        type
      ));
    }

    this.platforms.forEach(platform => {
      if (platform.type === 'breakable' && platform.isBroken) {
        return;
      }

      if (this.doodler.checkCollision(platform)) {
        if (platform.type === 'spring') {
          this.doodler.superJump();
        } else if (platform.type === 'rocket') {
          this.startRocketMode();
        } else if (platform.type === 'breakable') {
          this.doodler.jump();
          platform.break();
          this.platformsBroken++;
          this.checkAchievements();
        } else {
          this.doodler.jump();
        }
      }
    });

    this.bullets = this.bullets.filter(bullet => {
      bullet.update();
      return bullet.isActive && bullet.y > this.doodler.y - this.canvas.height * 2;
    });

    this.monsters = this.monsters.filter(monster => {
      monster.update();
      
      this.bullets.forEach(bullet => {
        if (bullet.checkCollision(monster)) {
          bullet.isActive = false;
          monster.isActive = false;
          this.monstersKilled++;
          this.score += 50;
          this.setScore(this.score);
          this.checkAchievements();
        }
      });
      
      if (this.doodler.checkMonsterCollision(monster)) {
        if (this.doodler.velocityY > 0) {
          monster.isActive = false;
          this.monstersKilled++;
          this.doodler.jump();
          this.score += 100;
          this.setScore(this.score);
          this.checkAchievements();
        } else if (!this.isRocketMode) {
          this.gameOver();
          return false;
        }
      }
      
      return monster.isActive && 
             monster.y > this.doodler.y - this.canvas.height && 
             monster.y < this.doodler.y + this.canvas.height;
    });

    if (this.doodler.y > this.doodler.lastY + 1000 || 
        this.doodler.y > this.canvas.height + 200) {
      this.gameOver();
      return;
    }
  }

  private startRocketMode() {
    this.isRocketMode = true;
    if (!this.rocketUsed) {
      this.rocketUsed = true;
      this.checkAchievements();
    }
    this.doodler.startRocket();
    setTimeout(() => {
      this.isRocketMode = false;
      this.doodler.stopRocket();
    }, 3000);
  }

  private async gameOver() {
    this.stopShooting();
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.setHighScore(this.highScore);
      await this.saveScore();
    }

    this.setGameOver(true);
  }

  private async saveScore() {
    try {
      await supabase.from('game_scores').insert({ score: this.score });
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }

  public async loadHighScore() {
    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('score')
        .order('score', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        this.highScore = data.score;
        this.setHighScore(this.highScore);
      }
    } catch (error) {
      console.error('Error loading high score:', error);
    }
  }

  private checkAchievements() {
    const checkAndUnlock = (type: AchievementType, condition: boolean, message: string) => {
      if (condition && !this.unlockedAchievements.has(type)) {
        this.unlockedAchievements.add(type);
        const achievement = new Achievement(type, message);
        achievement.show();
        this.achievements.push(achievement);
      }
    };

    checkAndUnlock('SCORE_500', this.score >= 500, 'Score 500 points!');
    checkAndUnlock('SCORE_1000', this.score >= 1000, 'Score 1000 points!');
    checkAndUnlock('SCORE_2500', this.score >= 2500, 'Score 2500 points!');
    checkAndUnlock('SCORE_5000', this.score >= 5000, 'Score 5000 points!');
    checkAndUnlock('KILL_5_MONSTERS', this.monstersKilled >= 5, 'Kill 5 monsters!');
    checkAndUnlock('KILL_10_MONSTERS', this.monstersKilled >= 10, 'Kill 10 monsters!');
    checkAndUnlock('KILL_25_MONSTERS', this.monstersKilled >= 25, 'Kill 25 monsters!');
    checkAndUnlock('FIRST_ROCKET', this.rocketUsed, 'Use a rocket!');
    checkAndUnlock('BREAK_10_PLATFORMS', this.platformsBroken >= 10, 'Break 10 platforms!');

    const timeElapsed = Date.now() - this.gameStartTime;
    checkAndUnlock('SURVIVE_2MIN', timeElapsed >= 120000, 'Survive 2 minutes!');
  }

  public start() {
    this.stop();
    this.setGameOver(false);
    this.initializeGame();
    this.setScore(0);
    
    const animate = () => {
      this.update();
      this.draw();
      this.gameLoop = requestAnimationFrame(animate);
    };
    animate();
  }

  public stop() {
    this.stopShooting();
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  public startShooting() {
    this.shoot();
    if (!this.shootingInterval) {
      this.shootingInterval = window.setInterval(() => this.shoot(), 150);
    }
  }

  public stopShooting() {
    if (this.shootingInterval) {
      clearInterval(this.shootingInterval);
      this.shootingInterval = null;
    }
  }

  public shoot() {
    const bulletX = this.doodler.direction === 'left' ? 
      this.doodler.x : 
      this.doodler.x + this.doodler.width;
      
    this.bullets.push(new Bullet(
      bulletX,
      this.doodler.y + this.doodler.height / 2,
      this.doodler.direction
    ));
  }

  public moveLeft() {
    this.isMovingLeft = true;
    this.isMovingRight = false;
  }

  public moveRight() {
    this.isMovingRight = true;
    this.isMovingLeft = false;
  }

  public stopMoving() {
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.doodler.velocityX = 0;
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(0, this.cameraY);

    this.platforms.forEach(platform => platform.draw(this.ctx));
    this.monsters.forEach(monster => monster.draw(this.ctx));
    this.bullets.forEach(bullet => bullet.draw(this.ctx));
    this.doodler.draw(this.ctx);

    this.ctx.restore();

    this.achievements.forEach(achievement => achievement.draw(this.ctx));
  }
}
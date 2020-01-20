import Scene from '../../../engine/scene/Scene';
import ImageSprite from '../../../engine/render/sprites/ImageSprite';
import Player from './Player';
import Vector from '../../../engine/Vector';
import Keys from '../../../engine/input/Keys';
import Bullet from './Bullet';
import GamePadButtons from '../../../engine/input/GamePadButtons';
import Lives from './Lives';
import Score from './Score';
import Zombie from './Zombie';

export default class GameScene extends Scene {
  #engine;

  #player;
  #lives;
  #score;
  #scoreSprite;
  #bullets = [];
  #zombies = [];

  #zombieChance; // average number of zombies spawned per second
  #zombieMinVelocity; // pixels / second
  #zombieMaxVelocity; // pixels / second

  constructor(engine) {
    super();

    this.#engine = engine;
  }

  async initialize() {
    const { rootSprite } = this;

    await Promise.all([
      Player.load(),
      Bullet.load(),
      Lives.load(),
      Score.load(),
      Zombie.load()
    ]);

    const background = await ImageSprite.createFromUrl('/zombie/assets/background.png');

    const player = Player.create();
    this.#player = player;

    const lives = Lives.create(player.lives);
    lives.x = 10;
    lives.y = 10;

    this.#lives = lives;

    const scoreSprite = Score.create();
    scoreSprite.x = rootSprite.width - 10;
    scoreSprite.y = 10;

    this.#scoreSprite = scoreSprite;

    rootSprite.addChild(background);
    rootSprite.addChild(player);
    rootSprite.addChild(lives);
    rootSprite.addChild(scoreSprite);

    this.#reset();
  }

  tick(sinceLast, now) {
    this.#playerMove(sinceLast);
    this.#playerFire(now);

    this.#bulletsMove(sinceLast);

    this.#zombieCreate(sinceLast);
    this.#zombieMove(sinceLast);

    this.#resolveCollisions();

    this.#lives.lives = this.#player.lives;
    this.#scoreSprite.score = this.#score;

    if (this.#player.lives <= 0) {
      this.#engine.dataManager.set('score', this.#score);
      this.#engine.sceneManager.change('game-over');
      this.#reset();
    }
  }

  #reset() {
    const { rootSprite } = this;

    this.#bullets && this.rootSprite.removeChildren(this.#bullets);
    this.#zombies && this.rootSprite.removeChildren(this.#zombies);

    this.#bullets = [];
    this.#zombies = [];

    this.#player.x = rootSprite.width / 2;
    this.#player.y = rootSprite.height / 2;
    this.#player.reset();

    this.#score = 0;

    this.#zombieChance = 1;
    this.#zombieMinVelocity = 20;
    this.#zombieMaxVelocity = 200;
  }

  #playerMove(sinceLast) {
    const { inputManager } = this.#engine.sceneManager;

    const leftAxis = inputManager.getGamePadAxis(0);
    const rightAxis = inputManager.getGamePadAxis(1);
    const acceleration = new Vector(0, 0);

    if (leftAxis.x) {
      acceleration.x = leftAxis.x * this.#player.maxAcceleration;
    } else if (inputManager.isKeyDown(Keys.A)) {
      acceleration.x = -this.#player.maxAcceleration;
    } else if (inputManager.isKeyDown(Keys.D)) {
      acceleration.x = this.#player.maxAcceleration;
    }

    if (leftAxis.y) {
      acceleration.y = leftAxis.y * this.#player.maxAcceleration;
    } else if (inputManager.isKeyDown(Keys.W)) {
      acceleration.y = this.#player.maxAcceleration;
    } else if (inputManager.isKeyDown(Keys.S)) {
      acceleration.y = -this.#player.maxAcceleration;
    }

    if (rightAxis.x || rightAxis.y) {
      this.#player.rotation = Math.atan2(rightAxis.y, rightAxis.x) + Math.PI / 2;
    } else if (inputManager.isMouseOver) {
      this.#player.rotation = Math.atan2(
        inputManager.mouse.y - this.#player.y,
        inputManager.mouse.x - this.#player.x
      ) + Math.PI / 2;
    }

    const direction = (acceleration.y !== 0 || acceleration.x !== 0)
      ? Math.atan2(acceleration.y, acceleration.x)
      : this.#player.direction;
    this.#player.direction = direction;
    this.#player.acceleration = acceleration.x * Math.cos(direction) + acceleration.y * Math.sin(direction);

    this.#player.move(sinceLast);
  }

  #playerFire(now) {
    const { inputManager } = this.#engine.sceneManager;

    if ((inputManager.isGamePadButtonDown(GamePadButtons.R2) || inputManager.isMouseDown)
        && this.#player.fire(now)) {
      const bullet = Bullet.create();
      bullet.rotation = this.#player.rotation;
      bullet.x = this.#player.x + this.#player.width * .5 * Math.sin(bullet.rotation);
      bullet.y = this.#player.y + this.#player.height * .5 * -Math.cos(bullet.rotation);

      bullet.direction = -bullet.rotation + Math.PI / 2;
      bullet.velocity = bullet.maxVelocity;

      this.#bullets = [ ...this.#bullets, bullet ];

      this.rootSprite.insertBefore(bullet, this.#player);
    }
  }

  #bulletsMove(sinceLast) {
    this.#bullets.forEach(bullet => bullet.move(sinceLast));
  }

  #zombieCreate(sinceLast) {
    if (Math.random() <= this.#zombieChance * (sinceLast / 1000)) {
      const zombie = Zombie.create();
      const rad = Math.random() * 2 * Math.PI;
      const distance = this.rootSprite.width / 2 + zombie.width;

      zombie.x = this.rootSprite.width / 2 + distance * Math.cos(rad);
      zombie.y = this.rootSprite.height / 2 + distance * -Math.sin(rad);

      zombie.velocity = Math.random() * (this.#zombieMaxVelocity - this.#zombieMinVelocity)
        + this.#zombieMinVelocity;

      this.#zombies = [ ...this.#zombies, zombie ];
      this.rootSprite.addChild(zombie);
    }
  }

  #zombieMove(sinceLast) {
    this.#zombies.forEach(zombie => {
      zombie.rotation = Math.atan2(zombie.y - this.#player.y, zombie.x - this.#player.x) - Math.PI / 2;
      zombie.direction = -zombie.rotation + Math.PI / 2;

      zombie.move(sinceLast);
    });
  }

  #resolveCollisions() {
    this.#zombies.forEach(zombie => {
      const bullet = this.#bullets.find(bullet => bullet.hitRect(zombie));

      if (bullet) {
        this.#bullets = this.#destroyFrom(bullet, this.#bullets);
        this.#zombies = this.#destroyFrom(zombie, this.#zombies);
        this.#score += 10;
      } else if(this.#player.hitRect(zombie)) {
        this.#zombies = this.#destroyFrom(zombie, this.#zombies);
        this.#player.lives--;
      }
    });
  }

  #destroyFrom(sprite, spriteArray) {
    const index = spriteArray.indexOf(sprite);

    if (index === -1) {
      return spriteArray;
    }

    sprite.parent.removeChild(sprite);

    return [
      ...spriteArray.slice(0, index),
      ...spriteArray.slice(index + 1)
    ];
  }
}
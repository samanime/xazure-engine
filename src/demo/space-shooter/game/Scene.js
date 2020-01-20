import Scene from '../../../engine/scene/Scene';
import Keys from '../../../engine/input/Keys';
import Player from './Player';
import PlayerBullet from './PlayerBullet';
import Enemy from './Enemy';
import TextSprite from '../../../engine/render/sprites/TextSprite';
import Lives from './Lives';
import Ray from '../../../engine/Ray';
import GamePadButtons from '../../../engine/input/GamePadButtons';
import Background from './Background';

export default class GameScene extends Scene {
  #engine;

  #player;
  #background;
  #gameSprites;
  #lives;
  #scoreText;
  #score;

  #enemyChance = 1.5; // enemies per second on average
  #enemyMinVelocity = 200;
  #enemyMaxVelocity = 800;

  constructor(engine) {
    super();

    this.#engine = engine;
  }

  async initialize() {
    const { rootSprite } = this;

    await Promise.all([
      Player.load(),
      PlayerBullet.load(),
      Enemy.load(),
      Lives.load(),
      Background.load()
    ]);

    this.#player = Player.create();
    this.#background = Background.create();
    this.#background.width = rootSprite.width;
    this.#background.height = rootSprite.height;

    this.#scoreText = new TextSprite();
    this.#scoreText.color = '#FFF';
    this.#scoreText.fontSize = 20;
    this.#scoreText.align = TextSprite.Align.RIGHT;
    this.#scoreText.origin.x = this.#scoreText.width;
    this.#scoreText.x = this.rootSprite.width - 10;
    this.#scoreText.y = 10;

    this.#lives = Lives.create();
    this.#lives.x = 10;
    this.#lives.y = 10;

    rootSprite.addChild(this.#background);
    rootSprite.addChild(this.#player);
    rootSprite.addChild(this.#lives);
    rootSprite.addChild(this.#scoreText);

    this.#reset();
  }

  async tick(sinceLast) {
    this.#background.tick(sinceLast);

    this.#playerMove(sinceLast);
    this.#playerFire(sinceLast);

    this.#enemiesCreate(sinceLast);

    this.#gameSpritesMove(sinceLast);

    this.#resolveCollisions();

    this.#lives.lives = this.#player.lives;
    this.#scoreText.text = `Score: ${this.#score}`;

    if (this.#player.lives <= 0) {
      this.#gameOver();
    }
    
    console.log(this.#gameSprites.length);
  }

  #reset() {
    const { rootSprite } = this;

    this.#gameSprites && rootSprite.removeChildren(this.#gameSprites);
    this.#gameSprites = [];

    this.#score = 0;

    this.#player.reset(10, rootSprite.height / 2 - this.#player.height / 2);
  }

  #playerMove(sinceLast) {
    const { inputManager } = this.#engine.sceneManager;

    const axis = inputManager.getGamePadAxis(0).y;

    let direction = this.#player.direction;
    let acceleration = 0;

    if (axis) {
      direction = (axis < 0 ? -1 : 1) * Math.PI / 2;
      acceleration = axis * this.#player.maxAcceleration;
    } else if (inputManager.isKeyDown(Keys.ArrowUp)) {
      direction = Math.PI / 2;
      acceleration = this.#player.maxAcceleration;
    } else if (inputManager.isKeyDown(Keys.ArrowDown)) {
      direction = -Math.PI / 2;
      acceleration = this.#player.maxAcceleration;
    }

    this.#player.direction = direction;
    this.#player.acceleration = acceleration;
    this.#player.move(sinceLast);
  }

  #playerFire(sinceLast) {
    const { rootSprite } = this;
    const { inputManager } = this.#engine.sceneManager;

    if (inputManager.isKeyDown(Keys.Space) || inputManager.isGamePadButtonDown(GamePadButtons.A)) {
      if (this.#player.fire(sinceLast)) {
        const bullet = PlayerBullet.create();

        bullet.x = this.#player.x + this.#player.width;
        bullet.y = this.#player.y + this.#player.height / 2 - bullet.height / 2;
        bullet.velocity = this.#player.bulletVelocity;

        this.#gameSprites = [ ...this.#gameSprites, bullet ];
        rootSprite.addChild(bullet);
      }
    } else {
      this.#player.release();
    }
  }

  #enemiesCreate(sinceLast) {
    const { rootSprite } = this;

    const r = Math.random();
    if (this.#enemyChance * ((sinceLast || 0) / 1000) >= r) {
      const enemy = Enemy.create();

      this.#gameSprites = [ ...this.#gameSprites, enemy ];

      enemy.x = rootSprite.width;
      enemy.y = Math.random() * (rootSprite.height - enemy.height);
      rootSprite.addChild(enemy);

      enemy.velocity = Math.random() * (this.#enemyMaxVelocity - this.#enemyMinVelocity) + this.#enemyMinVelocity;
      enemy.direction = -Math.PI;
    }
  }

  #gameSpritesMove(sinceLast) {
    const { rootSprite } = this;

    this.#gameSprites.forEach((sprite, index) => {
      sprite.move(sinceLast);

      if (!sprite.hitRect(rootSprite) && !rootSprite.hitRay(Ray.fromDirection(sprite, sprite.direction))) {
        this.#destroy(sprite);
      }
    });
  }

  #resolveCollisions() {
    const enemies = this.#gameSprites.filter(sprite => sprite instanceof Enemy);
    const bullets = this.#gameSprites.filter(sprite => sprite instanceof PlayerBullet);

    enemies.forEach(enemy => {
      const bullet = bullets.find(bullet => bullet.hitRect(enemy));

      if (bullet) {
        this.#destroy(bullet);
        this.#destroy(enemy);

        this.#score += 10;
      } else if (this.#player.hitRect(enemy)) {
        this.#destroy(enemy);

        this.#player.lives--;
      }
    });
  }

  #destroy(sprite) {
    const { rootSprite } = this;
    const index = this.#gameSprites.indexOf(sprite);

    if (index === -1) {
      return;
    }

    rootSprite.removeChild(sprite);

    this.#gameSprites = [
      ...this.#gameSprites.slice(0, index),
      ...this.#gameSprites.slice(index + 1)
    ];
  }

  #gameOver() {
    this.#engine.dataManager.set('score', this.#score);
    this.#engine.sceneManager.change('game-over');
    this.#reset();
  }
}
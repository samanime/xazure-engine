import Scene from '../../../engine/scene/Scene';
import Map from './Map';
import Player from './Player';
import Chicken from './Chicken';
import Bat from './Bat';
import Keys from '../../../engine/input/Keys';
import Vector from '../../../engine/Vector';

export default class GameScene extends Scene {
  #engine;
  #player;
  #map;

  #enemies = [];
  #enemyChance = .5; // number of enemies spawned per second on average
  #enemyWeights = [
    { clazz: Chicken, weight: 4 },
    { clazz: Bat, weight: 1 }
  ];

  #attacking = false;
  #attackStarted;

  constructor(engine) {
    super();

    this.#engine = engine;
  }

  async initialize() {
    const { rootSprite } = this;

    await Promise.all([
      Map.load(),
      Player.load(),
      Chicken.load(),
      Bat.load()
    ]);

    this.#map = Map.create();
    this.#player = Player.create();

    rootSprite.addChild(this.#map);
    rootSprite.addChild(this.#player);

    this.#reset();
  }

  #reset() {
    const { rootSprite } = this;

    this.#enemies.length && this.#enemies.forEach(enemy => rootSprite.removeChild(enemy));
    this.#enemies = [];

    this.#player.x = rootSprite.width / 2;
    this.#player.y = rootSprite.height / 2;
  }

  tick(sinceLast, now) {
    this.#playerMove(sinceLast, now);
    this.#playerAttack(now);

    this.#enemiesCreate(sinceLast);

    this.#enemiesMove(sinceLast, now);

    this.#arrange();

    this.rootSprite.x = -this.#player.x + this.rootSprite.width / 2;
    this.rootSprite.y = -this.#player.y + this.rootSprite.height / 2;
  }

  #playerMove(sinceLast, now) {
    const { inputManager } = this.#engine.sceneManager;

    const direction = new Vector(0, 0);

    if (inputManager.isKeyDown(Keys.ArrowLeft)) {
      direction.x = -1;
    } else if (inputManager.isKeyDown(Keys.ArrowRight)) {
      direction.x = 1;
    }

    if (inputManager.isKeyDown(Keys.ArrowUp)) {
      direction.y = 1;
    } else if (inputManager.isKeyDown(Keys.ArrowDown)) {
      direction.y = -1;
    }

    if (direction.x || direction.y) {
      this.#player.direction = Math.atan2(direction.y, direction.x);
      this.#player.acceleration = this.#player.maxAcceleration;
    } else {
      this.#player.acceleration = 0;
    }

    this.#player.move(sinceLast, now);
  }

  #playerAttack(now) {
    const { inputManager } = this.#engine.sceneManager;

    if (inputManager.isKeyDown(Keys.Space) && this.#player.attack(now)) {
      this.#attacking = true;
      this.#attackStarted = now;
      console.log(now);
    }

    if(this.#attacking && now >= this.#attackStarted + this.#player.attackDelay * 1000) {
      this.#attacking = false;

      const attackRect = this.#player.attackRect.boundsRectRelativeTo(this.rootSprite);

      const hits = this.#enemies.filter(enemy => attackRect.hitRect(enemy));

      hits.forEach(enemy => {
        this.#destroyEnemy(enemy);
      });
    }
  }

  #enemiesCreate(sinceLast) {
    if (Math.random() <= this.#enemyChance * sinceLast / 1000) {
      const enemyClass = this.#pickEnemy();
      const enemy = enemyClass.create();
      enemy.x = 500;
      enemy.y = 500;

      this.#enemies = [...this.#enemies, enemy];
    }
  }

  #enemiesMove(sinceLast, now) {
    this.#enemies.forEach(enemy => {
      enemy.direction = -Math.atan2(this.#player.y - enemy.y, this.#player.x - enemy.x);

      enemy.move(sinceLast, now);
    });
  }

  #destroyEnemy(enemy) {
    const index = this.#enemies.indexOf(enemy);

    this.rootSprite.removeChild(enemy);

    this.#enemies = [
      ...this.#enemies.slice(0, index),
      ...this.#enemies.slice(index + 1)
    ];
  }

  #arrange() {
    const toArrange = [this.#player, ...this.#enemies];

    toArrange.sort((a, b) => a.bounds.bottom - b.bounds.bottom);

    this.rootSprite.orderChildren([this.#map, ...toArrange]);
  }

  #pickEnemy() {
    const rand = Math.random();
    const weightTotal = this.#enemyWeights.reduce((sum, { weight }) => sum + weight, 0);

    let i = 0;
    let total = 0;
    for(let len = this.#enemyWeights.length; i < len && rand >= total / weightTotal; i++) {
      total += this.#enemyWeights[i].weight;
    }

    return this.#enemyWeights[i-1].clazz;
  }
}
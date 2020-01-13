import Scene from '../../../engine/scene/Scene';
import Map from './Map';
import Player from './Player';
import Keys from '../../../engine/input/Keys';
import Vector from '../../../engine/Vector';

export default class GameScene extends Scene {
  #engine;
  #player;
  #map;

  constructor(engine) {
    super();

    this.#engine = engine;
  }

  async initialize() {
    const { rootSprite } = this;

    await Promise.all([
      Map.load(),
      Player.load()
    ]);

    const map = Map.create();
    this.#map = map;

    const player = Player.create();
    player.scale = .5;
    player.x = rootSprite.width / 2;
    player.y = rootSprite.height / 2;

    this.#player = player;

    rootSprite.addChild(map);
    rootSprite.addChild(player);
  }

  tick(sinceLast) {
    this.#playerMove(sinceLast);

    this.rootSprite.x = -this.#player.x + this.rootSprite.width / 2;
    this.rootSprite.y = -this.#player.y + this.rootSprite.height / 2;
  }

  #playerMove(sinceLast) {
    const { inputManager } = this.#engine.sceneManager;

    const direction = new Vector(0, 0);

    if (inputManager.isKeyDown(Keys.ArrowLeft)) {
      direction.x = -1;
    } else if (inputManager.isKeyDown(Keys.ArrowRight)) {
      direction.x = 1;
    }

    if (inputManager.isKeyDown(Keys.ArrowUp)) {
      direction.y = -1;
    } else if (inputManager.isKeyDown(Keys.ArrowDown)) {
      direction.y = 1;
    }

    if (direction.x || direction.y) {
      const rad = Math.atan2(direction.y, direction.x);

      this.#player.acceleration = new Vector(
        this.#player.maxAcceleration * Math.cos(rad),
        this.#player.maxAcceleration * Math.sin(rad)
      );
    } else {
      this.#player.acceleration = new Vector(0, 0);
    }

    this.#player.move(sinceLast);
  }
}
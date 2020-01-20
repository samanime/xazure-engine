import { clamp } from '../../../engine/util/clamp';
import GameSprite from '../../../engine/render/sprites/GameSprite';

export default class Player extends GameSprite {
  static imageUrl = '/space/assets/player.png';

  lives;

  bulletVelocity; // pixels / second
  fireRate;    // shots / second

  direction = 3 * Math.PI / 2;

  #sinceLastFired = 0;
  #fired = false;

  constructor() {
    super();

    this.reset();
  }

  reset(x = 0, y = 0) {
    this.#fired = false;
    this.#sinceLastFired = 1000;

    this.lives = 5;
    this.bulletVelocity = 300;
    this.fireRate = 5;

    this.maxVelocity = 300;
    this.maxAcceleration = 500;

    this.velocity = 0;
    this.acceleration = 0;
    this.friction = 200;

    this.x = x;
    this.y = y;
  }

  fire(sinceLast) {
    this.#sinceLastFired += sinceLast;

    if (this.canFire()) {
      this.#fired = true;
      this.#sinceLastFired = 0;
      return true;
    }

    return false;
  }

  release() {
    this.#fired = false;
  }

  canFire() {
    const { fireRate } = this;

    return !this.#fired && this.#sinceLastFired >= 1000 / fireRate;
  }
}
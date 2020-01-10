import { clamp } from '../../../engine/util/clamp';
import GameSprite from '../../../engine/render/sprites/GameSprite';

export default class Player extends GameSprite {
  static imageUrl = '/space/assets/player.png';

  lives;

  maxVelocity;     // pixels / second
  maxAcceleration; // pixels / second / second

  bulletVelocity; // pixels / second
  fireRate;    // shots / second

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

    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.friction = { x: 0, y: 200 };

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

  clampMove() {
    const { parent, velocity, maxVelocity, y } = this;

    if (!this.parent) {
      return;
    }

    this.velocity = {
      x: 0,
      y: clamp(velocity.y, -maxVelocity, maxVelocity)
    };

    this.y = clamp(y, 0, parent.height - this.height);
  }
}
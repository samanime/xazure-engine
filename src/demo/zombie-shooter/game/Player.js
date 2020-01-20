import GameSprite from '../../../engine/render/sprites/GameSprite';
import Vector from '../../../engine/Vector';

export default class Player extends GameSprite {
  static imageUrl = '/zombie/assets/player.png';

  #lastFired = 0;

  fireRate; // bullets / second

  lives;

  origin = new Vector(Player.image.width / 2, Player.image.height * .636);

  constructor() {
    super();

    this.reset();
  }

  reset() {
    this.fireRate = 5;

    this.lives = 5;
    this.friction = 800;

    this.velocity = 0;
    this.minVelocity = -300;
    this.maxVelocity = 300;

    this.acceleration = 0;
    this.minAcceleration = -1200;
    this.maxAcceleration = 1200;
  }

  fire(now) {
    if (now - this.#lastFired >= 1000 / this.fireRate) {
      this.#lastFired = now;
      return true;
    }

    return false;
  }
}
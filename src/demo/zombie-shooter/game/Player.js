import GameSprite from '../../../engine/render/sprites/GameSprite';
import Vector from '../../../engine/Vector';

export default class Player extends GameSprite {
  static imageUrl = '/zombie/assets/player.png';

  #lastFired = 0;

  fireRate; // bullets / second

  lives;

  maxVelocity; // pixels / second
  maxAcceleration; // pixels / second /second

  origin = new Vector(Player.image.width / 2, Player.image.height * .636);

  constructor() {
    super();

    this.reset();
  }

  reset() {
    this.fireRate = 5;

    this.lives = 5;
    this.maxVelocity = 800;
    this.maxAcceleration = 800;
    this.friction = new Vector(600, 600);
    this.velocity = new Vector();
    this.acceleration = new Vector();
  }

  fire(now) {
    if (now - this.#lastFired >= 1000 / this.fireRate) {
      this.#lastFired = now;
      return true;
    }

    return false;
  }
}
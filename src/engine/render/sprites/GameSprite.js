import loadImage from '../../util/loadImage';
import ImageSprite from './ImageSprite';
import { clamp } from '../../util/clamp';

export default class GameSprite extends ImageSprite {
  static imageUrl;
  static image;

  static async load() {
    if (!this.imageUrl) {
      return;
    }

    this.image = await loadImage(this.imageUrl);
  }

  static create() {
    const sprite = new this();

    sprite.image = this.image;
    sprite.sizeToImage();

    return sprite;
  }

  #direction = 0;

  #velocity = 0;     // pixels / second
  #minVelocity = Number.MIN_VALUE;
  #maxVelocity = Number.MAX_VALUE;

  #acceleration = 0; // pixels / second^2
  #minAcceleration = Number.MIN_VALUE;
  #maxAcceleration = Number.MAX_VALUE;

  friction = 0;     // pixels / second^2

  get direction() {
    return this.#direction;
  }

  set direction(value) {
    this.#direction = Math.atan2(Math.sin(value), Math.cos(value));
  }

  get acceleration() {
    return this.#acceleration;
  }

  set acceleration(value) {
    this.#acceleration = clamp(value, this.#minAcceleration, this.#maxAcceleration);
  }

  get velocity() {
    return this.#velocity;
  }

  set velocity(value) {
    this.#velocity = clamp(value, this.#minVelocity, this.#maxVelocity);
  }

  get minVelocity() {
    return this.#minVelocity;
  }

  set minVelocity(value) {
    this.#minVelocity = value;
    this.#velocity = Math.max(value, this.#velocity);
  }

  get maxVelocity() {
    return this.#maxVelocity;
  }

  set maxVelocity(value) {
    this.#maxVelocity = value;
    this.#velocity = Math.min(value, this.#velocity);
  }

  get minAcceleration() {
    return this.#minAcceleration;
  }

  set minAcceleration(value) {
    this.#minAcceleration = value;
    this.#acceleration = Math.max(value, this.#acceleration);
  }

  get maxAcceleration() {
    return this.#maxAcceleration;
  }

  set maxAcceleration(value) {
    this.#maxAcceleration = value;
    this.#acceleration = Math.min(value, this.#acceleration);
  }

  move(sinceLast, now) {
    const { velocity, friction, acceleration, direction } = this;
    const seconds = (sinceLast || 0) / 1000;

    let newVelocity = velocity;

    if (acceleration !== 0) {
      newVelocity += acceleration * seconds;
    }

    if (friction !== 0 && velocity !== 0) {
      newVelocity = (newVelocity / Math.abs(newVelocity))
        * Math.max(0, Math.abs(newVelocity) - (Math.abs(friction) * seconds));
    }

    this.x += newVelocity * Math.cos(direction) * seconds;
    this.y += newVelocity * -Math.sin(direction) * seconds;
    this.velocity = newVelocity;
  }
}
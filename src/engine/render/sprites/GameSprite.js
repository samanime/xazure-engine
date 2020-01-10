import loadImage from '../../util/loadImage';
import ImageSprite from './ImageSprite';

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

  velocity = { x: 0, y: 0 };
  acceleration = { x: 0, y: 0 };
  friction = { x: 0, y: 0 };

  clampMove() {}

  move(sinceLast) {
    const { velocity, acceleration, friction, x, y } = this;

    const xForces = calculateForces(sinceLast, x, velocity.x, acceleration.x, friction.x);
    const yForces = calculateForces(sinceLast, y, velocity.y, acceleration.y, friction.y);

    this.velocity = { x: xForces.velocity, y: yForces.velocity };

    this.x = xForces.position;
    this.y = yForces.position;

    this.clampMove();
  }
}

const calculateForces = (sinceLast, position, velocity, acceleration, friction) => {
  let newVelocity = velocity;
  let newPosition = position;

  if (acceleration !== 0) {
    newVelocity += acceleration * ((sinceLast || 0) / 1000);
  }

  if (friction !== 0 && velocity !== 0) {
    newVelocity = (newVelocity / Math.abs(newVelocity)) * Math.max(0, Math.abs(newVelocity) - (Math.abs(friction) * (sinceLast || 0) / 1000));
  }

  newPosition += newVelocity * (sinceLast || 0) / 1000;

  return { position: newPosition, velocity: newVelocity };
};
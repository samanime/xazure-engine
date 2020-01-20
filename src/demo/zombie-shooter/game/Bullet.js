import GameSprite from '../../../engine/render/sprites/GameSprite';
import Vector from '../../../engine/Vector';

export default class Bullet extends GameSprite {
  static imageUrl = '/zombie/assets/bullet.png';

  origin = new Vector(Bullet.image.width / 2, Bullet.image.height / 2);

  constructor() {
    super();

    this.maxVelocity = 500;
  }
}
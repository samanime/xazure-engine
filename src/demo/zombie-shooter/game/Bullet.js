import GameSprite from '../../../engine/render/sprites/GameSprite';
import Vector from '../../../engine/Vector';

export default class Bullet extends GameSprite {
  static imageUrl = '/zombie/assets/bullet.png';

  maxVelocity = 500;

  origin = new Vector(Bullet.image.width / 2, Bullet.image.height / 2);
}
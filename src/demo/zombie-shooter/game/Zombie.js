import GameSprite from '../../../engine/render/sprites/GameSprite';

export default class Zombie extends GameSprite {
  static imageUrl = '/zombie/assets/zombie.png';

  totalVelocity;

  origin = { x: Zombie.image.width / 2, y: Zombie.image.height * .651};
}
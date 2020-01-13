import GameSprite from '../../../engine/render/sprites/GameSprite';
import Vector from '../../../engine/Vector';

export default class Player extends GameSprite {
  static imageUrl = '/neighborhood/assets/player.png';

  maxAcceleration = 180;
  maxVelocity = 200;
  friction = { x: 80, y: 80 };

  origin = new Vector(Player.image.width / 2, Player.image.height / 2);
  scale = .5;

  clampMove() {
    const rad = Math.atan2(this.velocity.y, this.velocity.x);
    const totalVelocity = Math.abs(this.velocity.x * Math.cos(rad) + this.velocity.y * Math.sin(rad));

    if (totalVelocity - this.maxVelocity > 0) {
      this.velocity = new Vector(
        this.maxVelocity * Math.cos(rad),
        this.maxVelocity * Math.sin(rad)
      );
    }
  }
}
import ImageSprite from '../../../engine/render/sprites/ImageSprite';
import loadImage from '../../../engine/util/loadImage';
import GameSprite from '../../../engine/render/sprites/GameSprite';

let image;

export default class PlayerBullet extends GameSprite {
  static imageUrl = '/space/assets/player-bullet.png';
}
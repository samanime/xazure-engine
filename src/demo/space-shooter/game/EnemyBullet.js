import ImageSprite from '../../../engine/render/sprites/ImageSprite';
import loadImage from '../../../engine/util/loadImage';

let image;

export default class EnemyBullet extends ImageSprite {
  static async load() {
    image = await loadImage('/space/assets/enemy-bullet.png');
  }

  static async create() {
    const sprite = new EnemyBullet();

    sprite.image = image;
    sprite.sizeToImage();

    return sprite;
  }
}
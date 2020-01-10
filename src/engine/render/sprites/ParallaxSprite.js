import ImageSprite from './ImageSprite';
import Sprite from './Sprite';
import loadImage from '../../util/loadImage';

export default class ParallaxSprite extends Sprite {
  static async loadFromUrl(url) {
    const sprite = new this();

    sprite.image = await loadImage(url);

    return sprite;
  }

  image;
  speed = { x: 0, y: 0 }; // pixels / second
  position = { x: 0, y: 0 };

  tick(sinceLast) {
    const { speed, position, image } = this;

    this.position = {
      x: (position.x - speed.x * sinceLast / 1000) % image.width,
      y: (position.y - speed.y * sinceLast / 1000) % image.height
    };
  }

  renderSelf(ctx) {
    const { image, width, height, position } = this;

    let x = position.x;

    while (x < width) {
      let y = position.y;

      while (y < height) {
        ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);

        y += image.height;
      }

      x += image.width;
    }
  }
}
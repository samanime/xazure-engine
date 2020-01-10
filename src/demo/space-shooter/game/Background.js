import ParallaxSprite from '../../../engine/render/sprites/ParallaxSprite';
import loadImage from '../../../engine/util/loadImage';

export default class Background extends ParallaxSprite {
  static image;

  static async load() {
    this.image = await loadImage('/space/assets/background.png');
  }

  static create() {
    const sprite = new Background();

    sprite.image = this.image;

    return sprite;
  }

  speed = { x: 100, y: 0 };
}
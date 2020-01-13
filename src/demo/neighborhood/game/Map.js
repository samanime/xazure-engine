import Sprite from '../../../engine/render/sprites/Sprite';
import loadImage from '../../../engine/util/loadImage';
import ImageSprite from '../../../engine/render/sprites/ImageSprite';

export default class Map extends Sprite {
  static #images = {};

  static async load() {
    await Promise.all([
      'map',
      'east-house-clip',
      'fence-clip',
      'middle-house-clip',
      'southeast-cars-clip',
      'south-houses-clip'
    ].map(async fileName => {
      this.#images[fileName] = await loadImage(`/neighborhood/assets/${fileName}.png`);
    }));
  }

  static create() {
    const sprite = new Map();
    sprite.width = 3200;
    sprite.height = 2400;

    const mapSprite = new ImageSprite();
    mapSprite.image = this.#images.map;
    mapSprite.sizeToImage();

    sprite.addChild(mapSprite);

    return sprite;
  }
}
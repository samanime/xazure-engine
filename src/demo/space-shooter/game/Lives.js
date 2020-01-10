import Sprite from '../../../engine/render/sprites/Sprite';
import loadImage from '../../../engine/util/loadImage';
import GameSprite from '../../../engine/render/sprites/GameSprite';
import { range } from '../../../engine/util/range';

class Life extends GameSprite {
  static imageUrl = '/space/assets/life.png';

  sizeToImage() {
    this.width = this.image.width / 2;
    this.height = this.image.height / 2;
  }
}

export default class Lives extends Sprite {
  static #image;

  #lives = 0;
  #lifeSprites = [];

  static async load() {
    await Life.load();
  }

  static create(lifeCount) {
    return new Lives();
  }

  get lives() {
    return this.#lives;
  }

  set lives(value) {
    this.#lives = value;

    const diff = value - this.#lifeSprites.length;

    if (diff > 0) {
      this.#lifeSprites = [
        ...this.#lifeSprites,
        ...range(value - diff, value - 1).map((_, index) => {
          const sprite = Life.create();

          sprite.x = (sprite.width + 10) * index;
          this.addChild(sprite);

          return sprite;
        })
      ];
    } else if (diff < 0) {
      this.removeChildren(this.#lifeSprites.slice(diff));

      this.#lifeSprites = this.#lifeSprites.slice(0, value);
    }
  }
}
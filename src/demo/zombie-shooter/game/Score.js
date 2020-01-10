import Sprite from '../../../engine/render/sprites/Sprite';
import loadImage from '../../../engine/util/loadImage';
import ImageSprite from '../../../engine/render/sprites/ImageSprite';
import Vector from '../../../engine/Vector';
import TextSprite from '../../../engine/render/sprites/TextSprite';
import { padBefore } from '../../../engine/util/pad';

export default class Score extends Sprite {
  static #image;
  static #textWidth = 200;

  #scoreText;

  width = Score.#image.width + Score.#textWidth + 10;
  height = Score.#image.height;

  origin = new Vector(this.width, 0);

  static async load() {
    this.#image = await loadImage('/zombie/assets/score.png');
  }

  static create() {
    return new Score();
  }

  set score(value) {
    this.#scoreText.text = padBefore(value, 6);
  }

  constructor() {
    super();

    const score = new ImageSprite();
    score.image = Score.#image;
    score.sizeToImage();

    const fontSize = 60;
    const scoreText = new TextSprite();
    scoreText.verticalAlign = TextSprite.VerticalAlign.BOTTOM;
    scoreText.fontSize = fontSize;
    scoreText.height = fontSize;
    scoreText.origin = new Vector(0, fontSize);
    scoreText.y = Score.#image.height;
    scoreText.x = Score.#image.width + 10;
    scoreText.color = '#5a8e30';

    this.#scoreText = scoreText;

    this.addChild(score);
    this.addChild(scoreText);
  }
}
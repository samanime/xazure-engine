import GameSprite from './GameSprite';
import Rectangle from '../../Rectangle';
import Sprite from './Sprite';

export default class SheetSprite extends GameSprite {
  spriteRect = new Rectangle();
  animations = {};
  currentAnimation = null;
  currentStep = 0;

  #stateChangeSpeed = .2; // seconds between change
  #lastStateChange = 0;

  changeAnimation(sequence) {
    if (this.currentAnimation === sequence) {
      return;
    }

    this.currentAnimation = sequence;
    this.currentStep = 0;
  }

  sizeToImage() {
    const { spriteRect } = this;

    this.width = spriteRect.width;
    this.height = spriteRect.height;
  }

  renderSelf(ctx) {
    const { image, width, height, spriteRect, currentAnimation, currentStep } = this;
    const spritesWide = image.width / spriteRect.width;
    const spriteX = currentAnimation[currentStep] % spritesWide;
    const spriteY = Math.floor(currentAnimation[currentStep] / spritesWide);

    Sprite.prototype.renderSelf.call(this, ctx);

    if (image) {
      ctx.drawImage(
        image,
        spriteX * spriteRect.width,
        spriteY * spriteRect.height,
        spriteRect.width,
        spriteRect.height,
        0,
        0,
        width,
        height
      );
    }
  }

  move(sinceLast, now) {
    const { currentStep, currentAnimation } = this;

    super.move(sinceLast, now);

    if (now >= this.#lastStateChange + this.#stateChangeSpeed * 1000) {
      this.currentStep = (currentStep + 1) % currentAnimation.length;
      this.#lastStateChange = now;
    }
  }
}
import Sprite from './Sprite';
import loadImage from '../../util/loadImage';

export default class ImageSprite extends Sprite {
  static async createFromUrl(url, hoverUrl = undefined, activeUrl = undefined) {
    const sprite = new ImageSprite();

    sprite.image = await loadImage(url);
    sprite.hoverImage = hoverUrl && (await loadImage(hoverUrl));
    sprite.activeImage = activeUrl && (await loadImage(activeUrl));

    sprite.sizeToImage();

    return sprite;
  }

  image;
  hoverImage;
  activeImage;

  #hovering = false;
  #mouseDown = false;

  get renderImage() {
    const { image, activeImage, hoverImage } = this;

    if (this.#mouseDown && activeImage) {
      return activeImage;
    } else if (this.#hovering && hoverImage) {
      return hoverImage;
    }

    return image;
  }

  sizeToImage() {
    const { image } = this;

    this.width = image.width;
    this.height = image.height;
  }

  hover() {
    super.hover();

    this.#hovering = true;
  }

  exit() {
    super.exit();

    this.#hovering = false;
    this.#mouseDown = false;
  }

  mouseDown() {
    super.mouseDown();

    this.#mouseDown = true;
  }

  mouseUp() {
    super.mouseUp();

    this.#mouseDown = false;
  }

  renderSelf(ctx) {
    const { width, height, renderImage } = this;

    super.renderSelf(ctx);

    if (renderImage) {
      ctx.drawImage(renderImage, 0, 0, renderImage.width, renderImage.height, 0, 0, width, height);
    }
  }
}
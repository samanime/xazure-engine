import Sprite from './Sprite';

export default class TextSprite extends Sprite {
  static get Align() {
    return {
      LEFT: 'left',
      RIGHT: 'right',
      CENTER: 'center'
    };
  }

  static get VerticalAlign() {
    return {
      TOP: 'top',
      MIDDLE: 'middle',
      BOTTOM: 'bottom'
    };
  }

  color = '#000';
  text = '';
  fontFamily = 'Arial, Helvetica, sans-serif';
  fontSize = 12;
  weight = 400;
  align = TextSprite.Align.LEFT;
  verticalAlign = TextSprite.VerticalAlign.TOP;

  renderSelf(ctx) {
    const { color, text, fontFamily, fontSize, weight, align, verticalAlign } = this;
    const { x, y } = this.getPosition();

    super.renderSelf(ctx);

    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = verticalAlign;
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
    ctx.fillText(text, x, y);
  }

  getPosition() {
    const { Align, VerticalAlign } = TextSprite;
    const { align, verticalAlign } = this;
    const position = { x: 0, y: 0 };

    if (align === Align.RIGHT) {
      position.x = this.width;
    } else if (align === Align.CENTER) {
      position.x = this.width / 2;
    }

    if (verticalAlign === VerticalAlign.BOTTOM) {
      position.y = this.height;
    } else if (verticalAlign === VerticalAlign.MIDDLE) {
      position.y = this.height / 2;
    }

    return position;
  }
}
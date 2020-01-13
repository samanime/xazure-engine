import Rectangle from '../../Rectangle';

export default class Sprite extends Rectangle {
  parent = null;
  #children = [];

  #rotation = 0;

  scale = 1;

  background = null;

  cursor = 'auto';

  onClick = null;
  onHover = null;
  onMouseDown = null;
  onMouseUp = null;
  onExit = null;

  get rotation() {
    return this.#rotation;
  }

  set rotation(value) {
    this.#rotation = value % (2 * Math.PI);
  }

  get children() {
    return this.#children.slice(0);
  }

  click() {
    const { onClick } = this;

    onClick && onClick();
  }

  hover() {
    const { onHover } = this;

    onHover && onHover();
  }

  enter() {
    const { onEnter } = this;

    onEnter && onEnter();
  }

  exit() {
    const { onExit } = this;

    onExit && onExit();
  }

  mouseDown() {
    const { onMouseDown } = this;

    onMouseDown && onMouseDown();
  }

  mouseUp() {
    const { onMouseUp } = this;

    onMouseUp && onMouseUp();
  }

  addChild(child) {
    this.#children = [ ...this.#children, child ];
    child.parent = this;
  }

  insertBefore(child, before) {
    const index = this.#children.indexOf(before);

    if (index === -1) {
      throw new Error('Child does not belong to sprite.');
    }

    child.parent = this;

    this.#children = [
      ...this.#children.slice(0, index),
      child,
      ...this.#children.slice(index)
    ];
  }

  removeChild = (child) => {
    const children = this.#children;

    const index = children.indexOf(child);

    if (index === -1) {
      return;
    }

    this.#children = [
      ...children.slice(0, index),
      ...children.slice(index + 1)
    ];
  };

  removeChildren = (children) => {
    children.forEach(this.removeChild);
  };

  renderSelf(ctx) {
    const { width, height, background } = this;

    if (background) {
      ctx.save();
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  render(ctx) {
    const { x, y, origin: { x: originX, y: originY }, rotation, scale } = this;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.translate(-originX, -originY);

    this.renderSelf(ctx);

    this.#children.forEach(child => child.render(ctx));

    ctx.restore();
  }

  childHitPoint(point) {
    const { children } = this;

    const hitChildren = children.filter(child => child.childHitPoint(point));

    return hitChildren.length
      ? hitChildren.pop()
      : this.hitPoint(point) && this;
  }
}
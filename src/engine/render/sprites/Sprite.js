import Rectangle from '../../Rectangle';

export default class Sprite extends Rectangle {
  parent = null;
  #children = [];

  #rotation = 0;

  scale = 1;
  opacity = 1;

  background = null;

  cursor = 'auto';

  onClick = null;
  onHover = null;
  onMouseDown = null;
  onMouseUp = null;
  onExit = null;

  padding = { top: 0, left: 0, bottom: 0, right: 0 };

  get bounds() {
    const { padding, scale, origin, x, y, width, height } = this;

    return {
      top: y - origin.y + padding.top * scale,
      bottom: y - origin.y + (height - padding.bottom) * scale,
      left: x - origin.x + padding.left * scale,
      right: x - origin.x + (width - padding.right) * scale
    };
  }

  get boundsRect() {
    const { padding, scale, origin, x, y, width, height } = this;

    return new Rectangle(
      x - (origin.x + padding.left) * scale,
      y - (origin.y + padding.top) * scale,
      (width - padding.right) * scale,
      (height - padding.bottom) * scale
    );
  };

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

  boundsRectRelativeTo(ancestor) {
    const { parent } = this;

    if (parent === ancestor || !parent) {
      return this;
    }

    let current = parent;
    const relativeRect = new Rectangle(
      this.x - this.origin.x * this.scale,
      this.y - this.origin.y * this.scale,
      this.width * this.scale,
      this.height * this.scale
    );

    while (current && current !== ancestor) {
      relativeRect.x = current.x + relativeRect.x * current.scale;
      relativeRect.y = current.y + relativeRect.y * current.scale;
      relativeRect.width *= current.scale;
      relativeRect.height *= current.scale;

      current = current.parent;
    }

    return relativeRect;
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

  orderChildren(children) {
    this.#children = children;
  }

  swap(a, b) {
    const indexA = this.#children.indexOf(a);
    const indexB = this.#children.indexOf(b);

    this.#children = [
      ...this.#children.slice(0, Math.min(indexA, indexB)),
      this.#children[Math.max(indexA, indexB)],
      ...this.#children.slice(Math.min(indexA, indexB) + Math.max(indexA, indexB)),
      this.#children[Math.min(indexA, indexB)],
      ...this.#children.slice(Math.max(indexA, indexB) + 1)
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
    ctx.globalAlpha = ctx.globalAlpha * this.opacity;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.translate(-originX, -originY);

    this.renderSelf(ctx);

    ctx.translate(originX, originY);

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
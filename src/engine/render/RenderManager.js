export default class RenderManager {
  rootElement;

  canvas = document.createElement('canvas');
  ctx = this.canvas.getContext('2d');

  constructor(rootElement) {
    this.rootElement = rootElement;

    this.initializeCanvas();
  }

  render(rootSprite) {
    const { canvas, ctx } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rootSprite.render(ctx);
  }

  initializeCanvas() {
    const { rootElement, canvas } = this;

    canvas.width = rootElement.offsetWidth;
    canvas.height = rootElement.offsetHeight;

    rootElement.appendChild(canvas);
  }
}
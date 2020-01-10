import { walkSprites } from '../util/walkSprites';

export default class SceneManager {
  #renderManager;
  #current;
  #scenes;

  /** @type {Sprite} */
  #currentHover = null;
  #wasMouseDown = false;
  #lastTick;

  inputManager;

  constructor(renderManager, inputManager) {
    this.#renderManager = renderManager;
    this.inputManager = inputManager;

    inputManager.listen(renderManager.rootElement);
  }

  get current() {
    return this.#current;
  }

  get scenes() {
    return this.#scenes;
  }

  async tick() {
    const current = this.#current;

    const now = Date.now();

    if (current.enableMouse) {
      this.#updateMouseInputs();
    }

    await current.tick(this.#lastTick ? Date.now() - this.#lastTick : 0, now);

    this.#renderManager.render(current.rootSprite);

    this.#lastTick = now;
  }

  async add(name, scene) {
    scene.rootSprite.width = this.#renderManager.canvas.width;
    scene.rootSprite.height = this.#renderManager.canvas.height;

    await scene.initialize();

    this.#scenes = Object.freeze({ ...this.#scenes, [name]: scene });
  }

  remove(name) {
    if (this.#scenes[name] === this.#current) {
      throw new Error('Cannot remove the current scene.');
    }

    const newScenes = { ...this.#scenes };
    delete newScenes[name];

    this.#scenes = Object.freeze(newScenes);
  }

  async change(name) {
    const next = this.#scenes[name];

    if (!next) {
      throw new Error(`Unknown scene: ${name}`);
    }

    if (this.#current) {
      this.#currentHover && this.#currentHover.exit();
      await this.#current.exit();
    }

    this.#current = next;

    await next.enter();

    this.#currentHover = null;
    this.#lastTick = undefined;
  }

  #updateMouseInputs() {
    const { inputManager } = this;

    if (!inputManager.isMouseOver) {
      this.#currentHover && this.#currentHover.exit();
      this.#currentHover = null;
    } else {
      const hit = inputManager.isMouseOver && this.#current.rootSprite.childHitPoint(inputManager.mouse);

      if (hit !== this.#currentHover) {
        this.#currentHover && this.#currentHover.exit();

        hit.enter();

        this.#currentHover = hit;
      }

      this.#currentHover.hover();

      if (inputManager.isMouseDown) {
        if (!this.#wasMouseDown) {
          this.#currentHover.mouseDown();
          this.#wasMouseDown = true;
        }
      } else if (this.#wasMouseDown) {
        this.#currentHover.click();
        this.#currentHover.mouseUp();
        this.#wasMouseDown = false;
      }

      this.#renderManager.canvas.style.cursor = hit.cursor || 'auto';
    }
  }
}
import Sprite from './render/sprites/Sprite';
import InputManager from './input/InputManager';
import SceneManager from './scene/SceneManager';
import RenderManager from './render/RenderManager';
import DataManager from './data/DataManager';

export default class XazureEngine {
  fps = 60;
  running = false;

  dataManager = new DataManager();

  initialize(rootElement) {
    const renderManager = new RenderManager(rootElement);
    const inputManager = new InputManager();

    this.sceneManager = new SceneManager(renderManager, inputManager);
  }

  start() {
    this.running = true;

    // noinspection JSIgnoredPromiseFromCall
    this.tick();
  }

  pause() {
    this.running = false;
  }

  tick = async () => {
    const { fps, sceneManager, renderManager } = this;

    if (!this.running) {
      return;
    }

    await sceneManager.tick();

    setTimeout(this.tick, 1000 / fps);
  };
}
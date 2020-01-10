import Sprite from '../render/sprites/Sprite';

export default class Scene {
  rootSprite = new Sprite();

  get enableMouse() {
    return false;
  }

  async initialize() {}
  async enter() {}
  async exit() {}
  async tick(sinceLast = 0, now) {}
}
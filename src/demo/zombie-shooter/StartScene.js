import Scene from '../../engine/scene/Scene';
import ImageSprite from '../../engine/render/sprites/ImageSprite';
import Vector from '../../engine/Vector';

export class StartScene extends Scene {
  #sceneManager;

  get enableMouse() {
    return true;
  }

  constructor(sceneManager) {
    super();

    this.#sceneManager = sceneManager;
  }

  async initialize() {
    const { rootSprite } = this;

    const title = await ImageSprite.createFromUrl(
      '/zombie/assets/title.png'
    );

    title.origin = new Vector(title.width / 2, title.height / 2);
    title.x = rootSprite.width / 2;
    title.y = rootSprite.height / 2 - 50;

    const startButton = await ImageSprite.createFromUrl(
      '/zombie/assets/start-button.png',
      '/zombie/assets/start-button-hover.png',
      '/zombie/assets/start-button-active.png'
    );

    startButton.origin = new Vector(startButton.width / 2, startButton.height);
    startButton.x = rootSprite.width / 2;
    startButton.y = rootSprite.height - 20;
    startButton.onClick = () => this.#sceneManager.change('game');

    rootSprite.addChild(title);
    rootSprite.addChild(startButton);
  }
}
import Scene from '../../engine/scene/Scene';
import ImageSprite from '../../engine/render/sprites/ImageSprite';
import Vector from '../../engine/Vector';

export default class StartScene extends Scene {
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

    const titleSprite = await ImageSprite.createFromUrl('/neighborhood/assets/title.png');
    titleSprite.origin = new Vector(titleSprite.width / 2, titleSprite.height / 2);
    titleSprite.x = rootSprite.width / 2;
    titleSprite.y = rootSprite.height / 2 - 100;

    const startButtonSprite = await ImageSprite.createFromUrl(
      '/neighborhood/assets/start-button.png',
      '/neighborhood/assets/start-button-hover.png'
    );

    startButtonSprite.origin = new Vector(startButtonSprite.width / 2, startButtonSprite.height);
    startButtonSprite.x = rootSprite.width / 2;
    startButtonSprite.y = rootSprite.height - 20;
    startButtonSprite.cursor = 'pointer';

    startButtonSprite.onClick = () => this.#sceneManager.change('game');

    rootSprite.addChild(titleSprite);
    rootSprite.addChild(startButtonSprite);
  }
}
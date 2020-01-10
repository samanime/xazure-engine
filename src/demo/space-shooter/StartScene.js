import Scene from '../../engine/scene/Scene';
import ImageSprite from '../../engine/render/sprites/ImageSprite';
import TextSprite from '../../engine/render/sprites/TextSprite';
import GamePadButtons from '../../engine/input/GamePadButtons';

export default class StartScene extends Scene {
  #engine;

  textSprite;

  get enableMouse() {
    return true;
  }

  constructor(engine) {
    super();

    this.#engine = engine;
  }

  async initialize() {
    const { rootSprite } = this;

    const startButton = await ImageSprite.createFromUrl(
      '/space/assets/start.png',
      '/space/assets/start-hover.png',
      '/space/assets/start-active.png'
    );

    startButton.origin = { x: startButton.width / 2, y: startButton.height / 2 };
    startButton.x = rootSprite.width / 2;
    startButton.y = rootSprite.height - startButton.height;
    startButton.cursor = 'pointer';

    startButton.onClick = this.#play;

    const textSprite = new TextSprite();
    textSprite.text = 'Hello World';
    textSprite.x = 50;
    textSprite.y = 50;
    textSprite.align = TextSprite.Align.CENTER;
    textSprite.verticalAlign = TextSprite.VerticalAlign.MIDDLE;

    this.textSprite = textSprite;

    const title = await ImageSprite.createFromUrl('/space/assets/title.png');
    title.origin.x = title.width / 2;
    title.origin.y = title.height / 2;
    title.x = rootSprite.width / 2;
    title.y = rootSprite.height / 2;

    rootSprite.addChild(startButton);
    rootSprite.addChild(textSprite);
    rootSprite.addChild(title);
  }

  tick() {
    const { textSprite } = this;
    const { inputManager } = this.#engine.sceneManager;

    textSprite.text = `Game Pad Connected: ${inputManager.isGamePadConnected}`;

    inputManager.isGamePadButtonDown(GamePadButtons.START)
      && this.#play();
  }

  #play = () => {
    this.#engine.sceneManager.change('game');
  };
}
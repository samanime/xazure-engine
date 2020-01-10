import Scene from '../../engine/scene/Scene';
import ImageSprite from '../../engine/render/sprites/ImageSprite';
import Vector from '../../engine/Vector';
import TextSprite from '../../engine/render/sprites/TextSprite';
import GamePadButtons from '../../engine/input/GamePadButtons';

export default class GameOverScene extends Scene {
  #engine;
  #scoreText;

  get enableMouse() {
    return true;
  }

  constructor(engine) {
    super();

    this.#engine = engine;
  }

  async initialize() {
    const { rootSprite } = this;

    const gameOver = await ImageSprite.createFromUrl('/space/assets/game-over.png');
    gameOver.origin = new Vector(gameOver.width / 2, gameOver.height / 2);
    gameOver.x = rootSprite.width / 2;
    gameOver.y = rootSprite.height / 2 - 50;

    const scoreText = new TextSprite();
    scoreText.align = TextSprite.Align.CENTER;
    scoreText.verticalAlign = TextSprite.VerticalAlign.MIDDLE;
    scoreText.fontSize = 30;
    scoreText.origin = new Vector(50, 50);
    scoreText.x = rootSprite.width / 2;
    scoreText.y = rootSprite.height / 2 + 100;

    this.#scoreText = scoreText;

    const playAgain = await ImageSprite.createFromUrl(
      '/space/assets/play-again.png',
      '/space/assets/play-again-hover.png',
      '/space/assets/play-again-active.png'
    );
    playAgain.origin = new Vector(playAgain.width / 2, playAgain.height);
    playAgain.x = rootSprite.width / 2;
    playAgain.y = rootSprite.height - 20;
    playAgain.cursor = 'pointer';
    playAgain.onClick = this.#playAgain;

    this.rootSprite.addChild(gameOver);
    this.rootSprite.addChild(scoreText);
    this.rootSprite.addChild(playAgain);
  }

  enter() {
    this.#scoreText.text = `Final Score: ${this.#engine.dataManager.get('score')}`;
  }

  tick() {
    this.#engine.sceneManager.inputManager.isGamePadButtonDown(GamePadButtons.START)
      && this.#playAgain();
  }

  #playAgain = () => {
    this.#engine.sceneManager.change('game');
  };
}
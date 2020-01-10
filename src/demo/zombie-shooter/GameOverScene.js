import Scene from '../../engine/scene/Scene';
import ImageSprite from '../../engine/render/sprites/ImageSprite';
import Vector from '../../engine/Vector';

export default class GameOverScene extends Scene {
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

    const gameOver = await ImageSprite.createFromUrl(
      '/zombie/assets/game-over.png'
    );

    gameOver.origin = new Vector(gameOver.width / 2, gameOver.height / 2);
    gameOver.x = rootSprite.width / 2;
    gameOver.y = rootSprite.height / 2 - 50;

    const playAgainButton = await ImageSprite.createFromUrl(
      '/zombie/assets/play-again-button.png',
      '/zombie/assets/play-again-button-hover.png',
      '/zombie/assets/play-again-button-active.png'
    );

    playAgainButton.origin = new Vector(playAgainButton.width / 2, playAgainButton.height);
    playAgainButton.x = rootSprite.width / 2;
    playAgainButton.y = rootSprite.height - 20;
    playAgainButton.onClick = () => this.#sceneManager.change('game');

    rootSprite.addChild(gameOver);
    rootSprite.addChild(playAgainButton);
  }
}
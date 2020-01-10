import XazureEngine from '../../engine';
import { StartScene } from './StartScene';
import GameScene from './game/GameScene';
import GameOverScene from './GameOverScene';

(async () => {
  const engine = new XazureEngine();
  engine.initialize(document.querySelector('#root'));

  const { sceneManager } = engine;

  await Promise.all([
    sceneManager.add('start', new StartScene(sceneManager)),
    sceneManager.add('game', new GameScene(engine)),
    sceneManager.add('game-over', new GameOverScene(sceneManager))
  ]);

  await sceneManager.change('start');

  engine.start();
})();


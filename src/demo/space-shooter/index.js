import XazureEngine from '../../engine';
import StartScene from './StartScene';
import GameScene from './game/Scene';
import GameOverScene from './GameOverScene';

(async () => {
  const engine = new XazureEngine();
  engine.initialize(document.querySelector('#root'));

  const { sceneManager } = engine;

  await Promise.all([
    sceneManager.add('start', new StartScene(engine)),
    sceneManager.add('game', new GameScene(engine)),
    sceneManager.add('game-over', new GameOverScene(engine))
  ]);

  await sceneManager.change('start'); // @TODO change to start

  engine.start();
})();
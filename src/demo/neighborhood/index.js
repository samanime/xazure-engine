import XazureEngine from '../../engine';
import StartScene from './StartScene';
import GameScene from './game/GameScene';

(async () => {
  const engine = new XazureEngine();
  engine.initialize(document.querySelector('#root'));

  const { sceneManager } = engine;

  await Promise.all([
    sceneManager.add('start', new StartScene(sceneManager)),
    sceneManager.add('game', new GameScene(engine))
  ]);

  await sceneManager.change('game'); // @TODO change to 'start'

  engine.start();
})();
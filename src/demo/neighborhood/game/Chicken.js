import SheetSprite from '../../../engine/render/sprites/SheetSprite';
import { range } from '../../../engine/util/range';
import Rectangle from '../../../engine/Rectangle';
import Vector from '../../../engine/Vector';
import radianBetween from '../../../engine/util/radianBetween';

export default class Chicken extends SheetSprite {
  static imageUrl = '/assets/chicken.png';

  animations = {
    WALKING_UP: range(0, 2),
    WALKING_RIGHT: range(3, 5),
    WALKING_DOWN: range(6, 8),
    WALKING_LEFT: range(9, 11)
  };

  velocity = 100;
  currentAnimation = this.animations.WALKING_UP;

  spriteRect = new Rectangle(0, 0, 32, 32);

  static create() {
    const sprite = super.create();

    sprite.scale = 2;
    sprite.width = 32;
    sprite.height = 32;
    sprite.origin = new Vector(sprite.width / 2, sprite.height / 2);

    return sprite;
  }

  move(sinceLast, now) {
    const { direction, animations } = this;

    if (radianBetween(direction, -Math.PI / 4, Math.PI / 4)) {
      this.changeAnimation(animations.WALKING_RIGHT);
    } else if (radianBetween(direction, Math.PI / 4, Math.PI * 3 / 4)) {
      this.changeAnimation(animations.WALKING_UP);
    } else if (radianBetween(direction, Math.PI * 3 / 4, Math.PI * 5 / 4)) {
      this.changeAnimation(animations.WALKING_LEFT);
    } else if (radianBetween(direction, Math.PI * 5 / 4, Math.PI * 7 / 4)) {
      this.changeAnimation(animations.WALKING_DOWN);
    }

    super.move(sinceLast, now);
  }
}
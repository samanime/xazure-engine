import Vector from '../../../engine/Vector';
import Rectangle from '../../../engine/Rectangle';
import SheetSprite from '../../../engine/render/sprites/SheetSprite';
import { range } from '../../../engine/util/range';
import radianBetween from '../../../engine/util/radianBetween';
import Sprite from '../../../engine/render/sprites/Sprite';

export default class Player extends SheetSprite {
  static imageUrl = '/assets/player.png';

  animations = {
    IDLE_DOWN: range(0, 3),
    IDLE_RIGHT: range(4, 7),
    IDLE_LEFT: range(8, 11),
    IDLE_UP: range(12, 15),
    WALKING_DOWN: range(16, 21),
    WALKING_RIGHT: range(22, 27),
    WALKING_LEFT: range(28, 33),
    WALKING_UP: range(34, 39),
    ATTACK_RIGHT: range(40, 44),
    ATTACK_LEFT: range(45, 49),
    ATTACK_DOWN: range(50, 54),
    ATTACK_UP: range(55, 59)
  };

  currentAnimation = this.animations.WALKING_UP;

  friction = 750;

  spriteRect = new Rectangle(0, 0, 67, 52);
  padding = { top: 18, bottom: 7, left: 23, right: 21 };

  attackSprites;

  attackSpeed = 1.2;
  attackDelay = .6;
  #attacking = false;
  #lastAttacked = 0;

  static create() {
    const sprite = super.create();

    sprite.scale = 4;

    sprite.width = 67;
    sprite.height = 52;
    sprite.origin = new Vector(sprite.width / 2, sprite.height / 2);

    sprite.attackSprites = {
      top: new Sprite(3 - sprite.origin.x, -sprite.origin.y, 58, 30),
      bottom: new Sprite(7 - sprite.origin.x, -6, 59, 33),
      left: new Sprite(-sprite.origin.x - 3, -9, 33, 25),
      right: new Sprite(0, -9, 36, 25)
    };

    sprite.addChild(sprite.attackSprites.top);
    sprite.addChild(sprite.attackSprites.bottom);
    sprite.addChild(sprite.attackSprites.left);
    sprite.addChild(sprite.attackSprites.right);

    // sprite.attackSprites.right.background = '#0F0';
    // sprite.attackSprites.right.opacity = 0.5;
    //
    // sprite.attackSprites.top.background = '#F00';
    // sprite.attackSprites.top.opacity = 0.5;
    //
    // sprite.attackSprites.bottom.background = '#00F';
    // sprite.attackSprites.bottom.opacity = 0.5;
    //
    // sprite.attackSprites.left.background = '#FF0';
    // sprite.attackSprites.left.opacity = 0.5;

    return sprite;
  }

  get attackRect() {
    const { direction } = this;

    if (radianBetween(direction, -Math.PI / 4, Math.PI / 4)) {
      return this.attackSprites.right;
    } else if (radianBetween(direction, Math.PI / 4, Math.PI * 3 / 4)) {
      return this.attackSprites.top;
    } else if (radianBetween(direction, Math.PI * 3 / 4, Math.PI * 5 / 4)) {
      return this.attackSprites.left;
    } else if (radianBetween(direction, Math.PI * 5 / 4, Math.PI * 7 / 4)) {
      return this.attackSprites.bottom;
    }
  }

  constructor() {
    super();

    this.maxAcceleration = 1000;
    this.maxVelocity = 500;
  }

  move(sinceLast, now) {
    const { direction, currentStep, currentAnimation, animations, velocity } = this;

    if (this.#attacking && currentStep === currentAnimation.length - 1) {
      this.#attacking = false;
    }

    if (!this.#attacking) {
      if (radianBetween(direction, -Math.PI / 4, Math.PI / 4)) {
        this.changeAnimation(Math.floor(velocity) ? animations.WALKING_RIGHT : animations.IDLE_RIGHT);
      } else if (radianBetween(direction, Math.PI / 4, Math.PI * 3 / 4)) {
        this.changeAnimation(Math.floor(velocity) ? animations.WALKING_UP : animations.IDLE_UP);
      } else if (radianBetween(direction, Math.PI * 3 / 4, Math.PI * 5 / 4)) {
        this.changeAnimation(Math.floor(velocity) ? animations.WALKING_LEFT : animations.IDLE_LEFT);
      } else if (radianBetween(direction, Math.PI * 5 / 4, Math.PI * 7 / 4)) {
        this.changeAnimation(Math.floor(velocity) ? animations.WALKING_DOWN : animations.IDLE_DOWN);
      }
    }

    super.move(sinceLast, now);
  }

  attack(now) {
    const { direction, attackSpeed, animations } = this;

    if (now >= this.#lastAttacked + attackSpeed * 1000) {
      this.#lastAttacked = now;
      this.#attacking = true;

      if (radianBetween(direction, -Math.PI / 4, Math.PI / 4)) {
        this.changeAnimation(animations.ATTACK_RIGHT);
      } else if (radianBetween(direction, Math.PI / 4, Math.PI * 3 / 4)) {
        this.changeAnimation(animations.ATTACK_UP);
      } else if (radianBetween(direction, Math.PI * 3 / 4, Math.PI * 5 / 4)) {
        this.changeAnimation(animations.ATTACK_LEFT);
      } else if (radianBetween(direction, Math.PI * 5 / 4, Math.PI * 7 / 4)) {
        this.changeAnimation(animations.ATTACK_DOWN);
      }

      return true;
    }

    return false;
  }
}
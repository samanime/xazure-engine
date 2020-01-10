export default class InputManager {
  #target;

  #keys = [];
  #gamePadIndex = null;
  #gamePadAxisDeadZone = 0.15;
  #mouse = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };
  #mouseDown = false;

  get mouse() {
    return this.#mouse;
  }

  get isFocused() {
    return this.#target === document.activeElement;
  }

  get isMouseOver() {
    return !isNaN(this.#mouse.x);
  }

  get isMouseDown() {
    return this.#mouseDown;
  }

  get isGamePadConnected() {
    return this.#gamePadIndex !== null;
  }

  clearMouse() {
    this.#mouse = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };
  }

  listen(element = document) {
    this.#target = element;

    element.tabIndex = 0;

    window.addEventListener('gamepadconnected', this.#handleGamePadConnected);
    window.addEventListener('gamepaddisconnected', this.#handleGamePadDisconnected);

    element.addEventListener('mousemove', this.#handleMouseMove);
    element.addEventListener('mouseup', this.#handleMouseUp);
    element.addEventListener('mouseout', this.#handleMouseOut);
    element.addEventListener('mousedown', this.#handleMouseDown);

    window.addEventListener('focus', this.#handleFocus);
    element.addEventListener('keydown', this.#handleKeyDown);
    element.addEventListener('keyup', this.#handleKeyUp);
    element.addEventListener('blur', this.#handleBlur);

    element.focus();
  }

  isKeyDown(key) {
    return this.#keys.includes(key.toUpperCase());
  }

  isGamePadButtonDown(index) {
    if (!this.isGamePadConnected) {
      return false;
    }

    return navigator.getGamepads()[this.#gamePadIndex].buttons[index].pressed;
  }

  getGamePadButtonValue(index) {
    if (!this.isGamePadConnected) {
      return false;
    }

    return navigator.getGamepads()[this.#gamePadIndex].buttons[index].value;
  }

  getGamePadAxis(index) {
    if (!this.isGamePadConnected) {
      return {};
    }

    const deadZone = this.#gamePadAxisDeadZone;
    const axes = navigator.getGamepads()[this.#gamePadIndex].axes;

    const x = axes[index * 2];
    const y = axes[index * 2 + 1];

    return {
      x: Math.abs(x) >= deadZone ? x : 0,
      y: Math.abs(y) >= deadZone ? y : 0
    };
  }

  #handleFocus = _ => {
    setTimeout(() => this.#target.focus(), 0);
  };

  #handleKeyDown = event => {
    if (!this.#keys.includes(event.key.toUpperCase())) {
      this.#keys = [
        ...this.#keys,
        event.key.toUpperCase()
      ];
    }
  };

  #handleKeyUp = event => {
    const index = this.#keys.indexOf(event.key.toUpperCase());

    if (index === -1) {
      return;
    }

    this.#keys = [
      ...this.#keys.slice(0, index),
      ...this.#keys.slice(index + 1)
    ];
  };

  #handleBlur = _ => {
    this.#keys = [];
  };

  #handleMouseDown = _ => {
    this.#mouseDown = true;
  };

  #handleMouseUp = _ => {
    this.#mouseDown = false;
  };

  #handleMouseMove = event => {
    this.#mouse = { x: event.offsetX, y: event.offsetY };
  };

  #handleMouseOut = _ => {
    this.#mouse = { x: NaN, y: NaN };
  };

  #handleGamePadConnected = event => {
    this.#gamePadIndex = event.gamepad.index;
  };

  #handleGamePadDisconnected = _ => {
    this.#gamePadIndex = null;
  };
}
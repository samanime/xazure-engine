export default class Vector {
  x;
  y;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  scale(value) {
    this.x *= value;
    this.y *= value;
  }
}
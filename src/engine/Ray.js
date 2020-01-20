import Vector from './Vector';

export default class Ray {
  origin;
  point;

  static fromDirection(origin = new Vector(), radians = 0) {
    return new Ray(origin, new Vector(
      origin + Math.cos(radians),
      origin - Math.sin(radians)
    ));
  }

  constructor(origin = new Vector(), point = new Vector()) {
    this.origin = origin;
    this.point = point;
  }
}
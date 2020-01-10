import Vector from './Vector';

export default class Ray {
  origin;
  direction;

  constructor(origin = new Vector(), direction = new Vector()) {
    this.origin = origin;
    this.direction = direction;
  }
}
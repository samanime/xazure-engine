import Vector from './Vector';

export default class Rectangle extends Vector {
  width;
  height;

  origin = new Vector();

  constructor(x = 0, y = 0, width = 100, height = 100, origin = new Vector()) {
    super(x, y);

    this.width = 100;
    this.height = 100;

    this.origin = origin;
  }

  hitPoint(point) {
    const { x, y, width, height, origin } = this;

    return x - origin.x <= point.x && x - origin.x + width >= point.x
      && y - origin.y <= point.y && y - origin.y + height >= point.y;
  }

  hitRect(rect) {
    const { x, y, origin, width, height } = this;

    return x - origin.x < rect.x - rect.origin.x + rect.width
      && x - origin.x + width > rect.x - rect.origin.x
      && y - origin.y < rect.y - rect.origin.y + rect.height
      && y - origin.y + height > rect.y - rect.origin.y;
  }

  // Adapted from https://tavianator.com/fast-branchless-raybounding-box-intersections/
  hitRay(ray) {
    let tMin = -Infinity;
    let tMax = Infinity;

    const xResult = hitRayAxis(tMin, tMax, this.x, this.x + this.width, ray.origin.x, ray.direction.x);

    tMin = xResult.tMin;
    tMax = xResult.tMax;

    const yResult = hitRayAxis(tMin, tMax, this.y, this.y + this.height, ray.origin.y, ray.direction.y);

    tMin = yResult.tMin;
    tMax = yResult.tMax;

    return tMax >= tMin && tMax >= 0;
  }
}

const hitRayAxis = (tMin, tMax, bMin, bMax, o, p) => {
  if (p !== 0) {
    const t1 = (bMin - o) / p;
    const t2 = (bMax - o) / p;

    tMin = Math.max(tMin, Math.min(t1, t2));
    tMax = Math.min(tMax, Math.max(t1, t2));
  }

  return { tMin, tMax };
};
export const clamp = (value, min = Number.MIN_VALUE, max = Number.MAX_VALUE) => {
  return Math.max(min, Math.min(max, value));
};

export const createClamp = (min = Number.MIN_VALUE, max = Number.MAX_VALUE) =>
  value => clamp(value, min, max);
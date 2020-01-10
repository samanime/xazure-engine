export const range = (start, end) =>
  (new Array(end - start + 1)).fill(1).map((_, index) => index + start);
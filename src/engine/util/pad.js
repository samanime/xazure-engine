export const pad = (value, length, padding = '0') =>
  (value + (new Array(length)).fill(padding).join('')).slice(0, length);

export const padBefore = (value, length, padding = '0') =>
  ((new Array(length)).fill(padding).join('') + value).slice(-length);
export const walkSprites = (sprite, callback) => {
  if (sprite.children.length) {
    sprite.children.forEach(child => walkSprites(child, callback));
  }

  callback(sprite);
};
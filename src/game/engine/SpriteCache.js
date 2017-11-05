export default class SpriteCache {
  static fetch(sprites) {
    return Promise.all(
      sprites.map(sprite => {
        if (sprite.animations) {
          return _loadImage(sprite.animations.url);
        }
        return Promise.resolve();
      })
    );
  }
}

function _loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      resolve();
    };
    image.src = url;
  });
}

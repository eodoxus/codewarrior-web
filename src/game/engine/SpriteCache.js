export default class SpriteCache {
  static images = {};
  static async fetch(sprites) {
    await Promise.all(
      sprites.map(sprite => {
        if (sprite.animations) {
          return cacheImage(sprite.animations.url);
        }
        return Promise.resolve();
      })
    );
  }

  static get(name) {
    return SpriteCache.images[name];
  }
}

function cacheImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      resolve();
    };
    image.src = url;
    SpriteCache.images[url] = image;
  });
}

export default class SpriteCache {
  static async fetch(sprites) {
    await Promise.all(
      sprites.map(sprite => {
        if (sprite.animations) {
          return requestImage(sprite.animations.url);
        }
        return Promise.resolve();
      })
    );
  }
}

function requestImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      resolve();
    };
    image.src = url;
  });
}

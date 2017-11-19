export default class TextureCache {
  static images = {};
  static async fetch(textures) {
    await Promise.all(
      textures.map(texture => {
        return cacheImage(texture);
      })
    );
  }

  static get(name) {
    return TextureCache.images[name];
  }

  static put(name, data) {
    const image = new Image();
    image.src = data;
    TextureCache.images[name] = image;
  }
}

function cacheImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      resolve();
    };
    image.src = url;
    TextureCache.images[url] = image;
  });
}

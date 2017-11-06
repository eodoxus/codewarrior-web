import Animation from "./Animation";

export default class AnimationCollection {
  animations = {};
  config;
  data;
  url;

  constructor(config) {
    this.config = config;
    this.url = config.image;
    this.animations = parse(config);
  }

  get(animationName) {
    if (!this.animations[animationName]) {
      throw new Error(
        `Animation ${animationName} doesn't exist in the collection`
      );
    }
    return this.animations[animationName];
  }
}

function parse(config) {
  const animations = [];
  Object.keys(config.data.frames).forEach(key => {
    const frame = config.data.frames[key].frame;
    const name = key.substring(0, key.lastIndexOf("/")).replace("/", "_");
    if (!animations[name]) {
      animations[name] = new Animation(
        name,
        config.image,
        config.data.meta.size.w,
        config.data.meta.size.h,
        config.speed
      );
    }
    animations[name].addFrame({
      name: key,
      x: frame.x,
      y: frame.y,
      width: frame.w,
      height: frame.h
    });
  });
  return animations;
}

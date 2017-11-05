import Animation from "./Animation";

export default class AnimationCollection {
  animations = {};
  config;
  data;
  url;

  constructor(config) {
    this.config = config;
    this.url = config.image;
    this.data = config.data;
    this.parse(this.data);
  }

  get(animationName) {
    return this.animations[animationName] || {};
  }

  parse(data) {
    this.frames = [];
    Object.keys(data.frames).forEach(key => {
      const frame = data.frames[key].frame;
      const name = key.substring(0, key.lastIndexOf("/")).replace("/", "_");
      if (!this.animations[name]) {
        this.animations[name] = new Animation(
          name,
          this.url,
          data.meta.size.w,
          data.meta.size.h,
          this.config.speed
        );
      }
      this.animations[name].addFrame({
        name: key,
        url: this.url,
        x: frame.x,
        y: frame.y,
        width: frame.w,
        height: frame.h
      });
    });
  }
}

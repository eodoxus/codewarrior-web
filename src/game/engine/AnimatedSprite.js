import Animation from "./Animation";
import RestClient from "../../lib/RestClient";
import Sprite from "./Sprite";
import Url from "../../lib/Url";
import TextureCache from "./TextureCache";

export default class AnimatedSprite extends Sprite {
  animations;
  curAnimation;
  fps;

  constructor(id, size, fps) {
    super(id, size);
    this.fps = fps;
  }

  getAnimation() {
    return this.curAnimation;
  }

  setAnimation(name) {
    this.curAnimation = this.animations[name];
    return this.curAnimation;
  }

  getAnimations() {
    return this.animations;
  }

  async loadAssets() {
    let plist = await new RestClient().get(Url.ANIMATIONS + this.id + ".json");
    this.texture = Url.ANIMATIONS + plist.meta.image;
    this.animations = {};
    Object.keys(plist.frames).forEach(key => {
      const frame = plist.frames[key].frame;
      const name = key.substring(0, key.lastIndexOf("/")).replace("/", "_");
      if (!this.animations[name]) {
        this.animations[name] = new Animation(name, this.texture, this.fps);
      }
      this.animations[name].addFrame(frame);
    });
    await TextureCache.fetch(this.texture);
  }

  getTexture() {
    return this.curAnimation.getCurrentFrame();
  }
}

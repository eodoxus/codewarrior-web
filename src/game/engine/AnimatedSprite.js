import Animation from "./Animation";
import RestClient from "../../lib/RestClient";
import Sprite from "./Sprite";
import TextureCache from "./TextureCache";
import Url from "../../lib/Url";

export default class AnimatedSprite extends Sprite {
  animations;
  curAnimation;
  fps;

  constructor(id, size, fps) {
    super(id, size);
    this.fps = fps;
  }

  changeAnimationTo(name) {
    if (this.curAnimation && this.curAnimation.getName() !== name) {
      this.curAnimation.stop().reset();
    }
    this.setAnimation(name).start();
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

  getTexture() {
    return this.curAnimation.getCurrentFrame();
  }

  loadAnimations(plist, textureUrl = "") {
    this.animations = {};
    Object.keys(plist.frames).forEach(key => {
      const frame = plist.frames[key].frame;
      const name = key.substring(0, key.lastIndexOf("/")).replace("/", "_");
      if (!this.animations[name]) {
        this.animations[name] = new Animation(name, textureUrl, this.fps);
      }
      this.animations[name].addFrame(frame);
    });
  }

  async init() {
    if (this.sprite && this.sprite.getAnimations()) {
      return;
    }
    const plist = await new RestClient().get(
      Url.ANIMATIONS + this.id + ".json"
    );
    const textureUrl = Url.ANIMATIONS + plist.meta.image;
    this.loadAnimations(plist, textureUrl);
    await TextureCache.fetch(textureUrl);
  }
}

import Animation from "./Animation";
import RestClient from "../../lib/RestClient";
import Sprite from "./Sprite";
import TextureCache from "./TextureCache";
import Url from "../../lib/Url";

export default class AnimatedSprite extends Sprite {
  animations;
  curAnimation;
  fps;
  name;

  constructor(name, size, fps) {
    super(size);
    this.name = name;
    this.fps = fps;
  }

  changeAnimationTo(name) {
    if (this.curAnimation && this.curAnimation.getName() !== name) {
      this.curAnimation.stop().reset();
    }
    this.setAnimation(name);
  }

  getAnimation() {
    return this.curAnimation;
  }

  setAnimation(name) {
    this.curAnimation = this.animations[name];
  }

  getAnimations() {
    return this.animations;
  }

  getTexture() {
    return this.curAnimation.getCurrentFrame();
  }

  setFps(fps) {
    this.getAnimation().setFps(this.fps);
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
    const plistFile = Url.ANIMATIONS + this.name + ".json";
    const plist = await new RestClient().get(plistFile);
    const textureUrl = Url.ANIMATIONS + plist.meta.image;
    this.loadAnimations(plist, textureUrl);
    await TextureCache.fetch(textureUrl);
  }
}

import Size from "./Size";
import Sprite from "./Sprite";
import Texture from "./Texture";
import Vector from "./Vector";

export default class AnimatedSprite extends Sprite {
  animations;
  curAnimation;

  constructor(size, animations) {
    super(size);
    this.animations = animations;
  }

  addAnimation(animation) {
    this.animations.push(animation);
  }

  getAnimation() {
    return this.animations && this.animations.get(this.curAnimation);
  }

  setAnimation(name) {
    this.curAnimation = name;
  }

  removeAnimation(name) {
    this.animations.remove(name);
  }

  getTexture() {
    const animation = this.getAnimation();
    const frame = animation.getFrame();
    return new Texture(
      animation.getUrl(),
      new Vector(frame.x, frame.y),
      new Size(frame.width, frame.height)
    );
  }

  getTextures() {
    return [this.animations.getUrl()];
  }
}

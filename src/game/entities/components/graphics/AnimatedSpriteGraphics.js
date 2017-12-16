import AnimatedSprite from "../../../engine/AnimatedSprite";
import GraphicsComponent from "./GraphicsComponent";

export default class AnimatedSpriteGraphics extends GraphicsComponent {
  constructor(entity, animation, size, fps, zIndex = 0) {
    super(entity, zIndex);
    this.sprite = new AnimatedSprite(animation, size, fps);
  }

  getStoppedAnimation() {
    // Override this
  }

  start() {
    if (!this.isReady()) {
      return;
    }
    this.updateAnimation();
    const animation = this.sprite.getAnimation();
    if (animation) {
      animation.start();
    }
  }

  stop() {
    if (!this.isReady()) {
      return;
    }
    this.updateAnimation();
    const animation = this.sprite.getAnimation();
    if (animation) {
      animation.stop().reset();
    } else {
      this.sprite.setAnimation(this.getStoppedAnimation());
    }
  }

  update() {
    const animation = this.sprite.getAnimation();
    if (animation) {
      animation.update();
    }
  }

  updateAnimation() {
    const animationName = this.pickAnimation();
    this.sprite.changeAnimationTo(animationName);
  }

  pickAnimation() {
    // Override this
  }
}

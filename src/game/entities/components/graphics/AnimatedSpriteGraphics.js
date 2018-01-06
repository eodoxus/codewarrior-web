import AnimatedSprite from "../../../engine/AnimatedSprite";
import GraphicsComponent from "./GraphicsComponent";
import Size from "../../../engine/Size";
import Tile from "../../../engine/map/Tile";

export default class AnimatedSpriteGraphics extends GraphicsComponent {
  static create(entity) {
    return new AnimatedSpriteGraphics(
      entity,
      entity.getProperty(Tile.PROPERTIES.ANIMATION),
      new Size(
        parseFloat(entity.getProperty(Tile.PROPERTIES.WIDTH)),
        parseFloat(entity.getProperty(Tile.PROPERTIES.HEIGHT))
      ),
      entity.getProperty(Tile.PROPERTIES.FPS)
    );
  }

  constructor(entity, animation, size, fps) {
    super(entity);
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
      this.sprite.setAnimation(this.entity.getBehavior().getStoppedAnimation());
    }
  }

  update() {
    const animation = this.sprite.getAnimation();
    if (animation) {
      animation.update();
    }
  }

  updateAnimation() {
    const animationName = this.entity.getBehavior().pickAnimation();
    this.sprite.changeAnimationTo(animationName);
  }

  pickAnimation() {
    // Override this
  }
}

import AnimatedSprite from "../../../engine/AnimatedSprite";
import GraphicsComponent from "./GraphicsComponent";

export default class AnimationGraphics extends GraphicsComponent {
  textureName;

  constructor(entity, animationName, textureName, size, fps, zIndex = 0) {
    super(entity, zIndex);
    this.sprite = new AnimatedSprite(animationName, size, fps);
    this.textureName = textureName;
  }

  async init() {
    await GraphicsComponent.prototype.init.call(this);
    this.sprite.setAnimation(this.textureName);
    this.sprite.getAnimation().start();
  }

  update(dt) {
    this.getSprite()
      .getAnimation()
      .update(dt);
  }
}

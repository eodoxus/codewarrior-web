import AnimatedSprite from "../../../engine/AnimatedSprite";
import GraphicsComponent from "./GraphicsComponent";
import Size from "../../../engine/Size";
import Tile from "../../../engine/map/Tile";

export default class AnimationGraphics extends GraphicsComponent {
  static create(entity) {
    return new AnimationGraphics(
      entity,
      entity.getProperty(Tile.PROPERTIES.ANIMATION),
      entity.getProperty(Tile.PROPERTIES.FRAME_SET),
      new Size(
        parseFloat(entity.getProperty(Tile.PROPERTIES.WIDTH)),
        parseFloat(entity.getProperty(Tile.PROPERTIES.HEIGHT))
      ),
      entity.getProperty(Tile.PROPERTIES.FPS)
    );
  }

  textureName;

  constructor(entity, animationName, textureName, size, fps) {
    super(entity);
    this.sprite = new AnimatedSprite(animationName, size, fps);
    this.textureName = textureName;
  }

  async init() {
    await GraphicsComponent.prototype.init.call(this);
    this.sprite.setAnimation(this.textureName);
    this.sprite.getAnimation().start();
  }

  update() {
    this.getSprite()
      .getAnimation()
      .update();
  }
}

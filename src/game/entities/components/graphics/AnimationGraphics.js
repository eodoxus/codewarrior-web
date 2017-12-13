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
        entity.getProperty(parseInt(Tile.PROPERTIES.WIDTH, 10)),
        entity.getProperty(parseInt(Tile.PROPERTIES.HEIGHT, 10))
      ),
      entity.getProperty(Tile.PROPERTIES.FPS)
    );
  }
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

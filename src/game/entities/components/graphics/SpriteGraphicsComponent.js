import GraphicsComponent from "../../components/graphics/GraphicsComponent";
import Sprite from "../../../engine/Sprite";

export default class SpriteGraphicsComponent extends GraphicsComponent {
  static create(entity) {
    const graphics = new SpriteGraphicsComponent(entity);
    graphics.setSprite(Sprite.create(entity.getProperties()));
    return graphics;
  }
}

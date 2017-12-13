import Graphics from "../../../engine/Graphics";
import GraphicsComponent from "../../components/graphics/GraphicsComponent";
import Size from "../../../engine/Size";
import Vector from "../../../engine/Vector";
import Sprite from "../../../engine/Sprite";

export default class ShadowedSpriteGraphics extends GraphicsComponent {
  static create(entity, position) {
    const graphics = new ShadowedSpriteGraphics(entity, position);
    graphics.setSprite(Sprite.createFromProperties(entity.getProperties()));
    return graphics;
  }

  shadowGap;
  startPos;

  constructor(entity, position) {
    super(entity);
    this.startPos = Vector.copy(position);
    this.shadowGap = parseFloat(entity.getProperty("shadow"));
  }

  render() {
    super.render();
    this.renderShadow();
  }

  renderShadow(gap) {
    const size = this.getSprite().getSize();
    const startPos = this.startPos;
    const shadowPosition = new Vector(
      startPos.x + size.width / 2,
      startPos.y + size.height + this.shadowGap
    );
    const curPos = this.entity.movement.getPosition();
    const dy = Math.max(0.5, startPos.y - curPos.y);
    Graphics.drawShadow(shadowPosition, new Size(size.width, 5 * dy / 2));
  }
}

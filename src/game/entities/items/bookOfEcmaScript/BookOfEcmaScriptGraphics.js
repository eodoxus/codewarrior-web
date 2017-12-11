import Graphics from "../../../engine/Graphics";
import GraphicsComponent from "../../components/graphics/GraphicsComponent";
import Size from "../../../engine/Size";
import Texture from "../../../engine/Texture";
import Url from "../../../../lib/Url";
import Vector from "../../../engine/Vector";
import Sprite from "../../../engine/Sprite";

const SHADOW_GAP_WIDTH = 3;
const SIZE = new Size(32, 20);
const TEXTURE = Url.SPRITES + "items.png";

export default class BookOfEcmaScriptGraphics extends GraphicsComponent {
  constructor(entity) {
    super(entity);
    this.sprite = new Sprite(SIZE, new Texture(TEXTURE, new Vector(), SIZE));
  }

  render() {
    super.render();
    this.renderShadow();
  }

  renderShadow() {
    const startPos = this.entity.movement.getStartPosition();
    const shadowPosition = new Vector(
      startPos.x + SIZE.width / 2,
      startPos.y + SIZE.height + SHADOW_GAP_WIDTH
    );
    const curPos = this.entity.movement.getPosition();
    const dy = Math.max(0.5, startPos.y - curPos.y);
    Graphics.drawShadow(shadowPosition, new Size(SIZE.width, 5 * dy / 2));
  }
}

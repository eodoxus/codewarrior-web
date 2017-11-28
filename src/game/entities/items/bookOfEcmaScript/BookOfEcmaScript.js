import Entity from "../../../engine/Entity";
import Size from "../../../engine/Size";
import Sprite from "../../../engine/Sprite";
import Texture from "../../../engine/Texture";
import Vector from "../../../engine/Vector";
import Url from "../../../../lib/Url";
import Graphics from "../../../engine/Graphics";

const TEXTURE = Url.SPRITES + "items.png";

export default class BookOfEcmaScript extends Entity {
  static ID = "bookOfEcmaScript";
  static FLOAT_DISTANCE = 2;
  static STATES = {
    STOPPED: 0,
    FLOATING: 1
  };
  static VELOCITY = -1.5;

  originalPosition;

  constructor(id, position) {
    super(BookOfEcmaScript.ID, position);
    this.state = BookOfEcmaScript.STATES.FLOATING;
    this.originalPosition = Vector.copy(this.position);
    this.velocity = new Vector(0, BookOfEcmaScript.VELOCITY);
  }

  async loadAssets() {
    if (this.sprite) {
      return;
    }
    this.sprite = new Sprite(
      BookOfEcmaScript.ID,
      new Size(32, 32),
      new Texture(TEXTURE, new Vector(), new Size(32, 20))
    );
    await this.sprite.loadAssets();
  }

  render() {
    // Draw shadow
    const size = this.getSprite().getSize();
    const dy = Math.max(0.5, this.originalPosition.y - this.position.y);
    const position = new Vector(
      this.originalPosition.x + size.width / 2,
      this.originalPosition.y + size.height / 2 + 7
    );
    Graphics.drawShadow(
      position,
      new Size(size.width, 5 * dy / BookOfEcmaScript.FLOAT_DISTANCE)
    );
    super.render();
  }

  stop() {
    super.stop();
    this.state = BookOfEcmaScript.STATES.STOPPED;
  }

  update(dt) {
    super.update(dt);
    if (this.state === BookOfEcmaScript.STATES.FLOATING) {
      const dy = this.originalPosition.y - this.position.y;
      if (dy >= BookOfEcmaScript.FLOAT_DISTANCE || dy <= 0) {
        this.velocity.multiply(-1);
      }
    }
  }
}

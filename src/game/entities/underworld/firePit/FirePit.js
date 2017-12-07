import AnimatedSprite from "../../../engine/AnimatedSprite";
import Entity from "../../../engine/Entity";
import Size from "../../../engine/Size";

const ANIMATION = "firePit";
const FPS = 20;

export default class FirePit extends Entity {
  static ID = "firePit";

  constructor(id, position) {
    super(FirePit.ID, position);
    this.sprite = new AnimatedSprite("underworld", new Size(16, 16), FPS);
  }

  handleEvent(event) {
    // Do nothing
  }

  async init() {
    await Entity.prototype.init.call(this);
    const sprite = this.getSprite();
    sprite.setAnimation(ANIMATION);
    sprite.getAnimation().start();
  }

  update(dt) {
    if (Math.random() > 0.5) {
      this.getSprite()
        .getAnimation()
        .update(dt);
    }
  }
}

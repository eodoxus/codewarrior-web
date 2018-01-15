import entities from "../index";
import Vector from "../../engine/Vector";
import GameEvent from "../../engine/GameEvent";

const ANIMATION = "shatter";
const ANIMATION_DURATION = 500;

let count = 0;
export default class ShatterFactory {
  static async create(entity) {
    const shatter = entities.create(new Vector(), {
      name: "shatter" + count++,
      graphics: "AnimatedSprite",
      animation: "items",
      enemy: "true",
      fps: "10",
      width: "31",
      height: "30"
    });
    shatter.setPosition(shatter.translateToOrigin(entity.getOrigin()));
    shatter.isWalkable = () => true;
    await shatter.init();
    shatter.getBehavior().pickAnimation = () => ANIMATION;
    shatter.getGraphics().start();
    GameEvent.fire(GameEvent.ADD_ENTITY, shatter);
    setTimeout(
      () => GameEvent.fire(GameEvent.REMOVE_ENTITY, shatter),
      ANIMATION_DURATION
    );
    return shatter;
  }
}

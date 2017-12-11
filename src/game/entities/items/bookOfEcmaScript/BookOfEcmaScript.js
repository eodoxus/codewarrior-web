import BehaviorComponent from "../../components/behaviors/BehaviorComponent";
import BookOfEcmaScriptGraphics from "./BookOfEcmaScriptGraphics";
import Entity from "../../../engine/Entity";
import PacingMovement from "../../../entities/components/movements/PacingMovement";
import Vector from "../../../engine/Vector";

const DISTANCE = 2;
const VELOCITY = -1.5;

export default class BookOfEcmaScript extends Entity {
  static ID = "bookOfEcmaScript";

  constructor(id, position, properties) {
    super(BookOfEcmaScript.ID, properties);
    this.behavior = new BehaviorComponent(this);
    this.graphics = new BookOfEcmaScriptGraphics(this);

    const orientation = new Vector(0, 1);
    const endPosition = Vector.copy(position);
    endPosition.y -= DISTANCE;
    const velocity = new Vector(0, VELOCITY);
    this.movement = new PacingMovement(
      this,
      orientation,
      position,
      endPosition,
      velocity
    );
  }
}

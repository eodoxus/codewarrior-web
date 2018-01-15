import SinkingState from "./states/SinkingState";
import Vector from "../../engine/Vector";
import WalkingState from "./states/WalkingState";

export default class HeroBehaviorHelper {
  static land(subject) {
    const landingTile = subject
      .getMap()
      .getTileAt(
        Vector.add(
          subject.getOrigin(),
          new Vector(0, subject.getSprite().getSize().height / 2)
        )
      );
    if (landingTile.isWater()) {
      return new SinkingState(subject);
    }
    return new WalkingState(subject);
  }
}

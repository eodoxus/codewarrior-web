import State from "../../../engine/State";
import SceneTransitioner from "../../../engine/SceneTransitioner";
import WalkingState from "./WalkingState";
import Vector from "../../../engine/Vector";

const PADDING = 24;

export default class TransitioningState extends State {
  enter(velocity, orientation) {
    this.subject.setVelocity(velocity);
    this.subject.setOrientation(orientation);
    this.subject.getGraphics().start();
  }

  exit() {
    this.subject.setVelocity(new Vector());
  }

  pickAnimation() {
    return WalkingState.getAnimationFor(this.subject);
  }

  update() {
    if (detectSceneBoundaryCollision(this.subject)) {
      return new WalkingState(this.subject);
    }
    this.subject.getPosition().add(this.subject.getVelocity());
    return this;
  }
}

function detectSceneBoundaryCollision(hero) {
  const orientation = hero.getOrientation();
  const boundingBox = hero.getBoundingBox();
  const sceneSize = SceneTransitioner.getSceneSize();
  if (orientation.y > 0) {
    return boundingBox.y <= PADDING;
  }
  if (orientation.y < 0) {
    return boundingBox.y + boundingBox.height + PADDING >= sceneSize.height;
  }
  if (orientation.x > 0) {
    return boundingBox.x <= PADDING;
  }
  return boundingBox.x + boundingBox.width + PADDING >= sceneSize.width;
}

import State from "../../../engine/State";
import SceneTransitioner from "../../../engine/SceneTransitioner";
import WalkingState from "./WalkingState";
import Vector from "../../../engine/Vector";

const PADDING = 20;

export default class TransitioningState extends State {
  enter(hero, velocity, orientation) {
    hero.setVelocity(velocity);
    hero.setOrientation(orientation);
    hero.getGraphics().start();
  }

  exit(hero) {
    hero.setVelocity(new Vector());
  }

  pickAnimation(hero) {
    return WalkingState.animationForOrientation(hero);
  }

  update(hero) {
    if (detectSceneBoundaryCollision(hero)) {
      return new WalkingState(hero);
    }
    hero.getPosition().add(hero.getVelocity());
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

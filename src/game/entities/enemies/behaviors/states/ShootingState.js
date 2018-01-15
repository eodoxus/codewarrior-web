import BehaviorHelper from "../../../components/behaviors/BehaviorHelper";
import GameState from "../../../../GameState";
import State from "../../../../engine/State";
import Time from "../../../../engine/Time";

const ANIMATION_DURATION = 500;

export default class ShootingState extends State {
  restartTime;
  timer;

  enter() {
    this.subject.stop();
    BehaviorHelper.faceToward(this.subject, GameState.getHero());
    this.subject.getGraphics().start();
    setTimeout(async () => {
      this.subject.getGraphics().stop();
      await this.subject.getBehavior().createProjectile();
      this.timer = Time.timer();
    }, ANIMATION_DURATION);
    return this;
  }

  update() {
    if (this.timer && this.timer.elapsed() > ANIMATION_DURATION) {
      const stateClass = this.subject.getBehavior().startState;
      return new stateClass(this.subject);
    }
    return this;
  }
}

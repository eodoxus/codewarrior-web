import NoGraphics from "../../components/graphics/NoGraphicsComponent";
import State from "../../../engine/State";
import Time from "../../../engine/Time";
import Vector from "../../../engine/Vector";
import Audio from "../../../engine/Audio";

const ANIMATION = "plunging";
const DAMAGE_DURATION = 600;
const SINKING_DURATION = 300;
const SINKING_DAMAGE = 4;
const FPS = 10;

export default class SinkingState extends State {
  isAnimationDone;
  timer;

  enter() {
    Audio.playEffect(Audio.EFFECTS.SPLASH);
    this.subject.getPosition().add(new Vector(0, 8));
    this.subject.setVelocity(new Vector());
    const sprite = this.subject.getGraphics().getSprite();
    sprite.setAnimation(this.pickAnimation());
    sprite.getAnimation().setFps(FPS);
    this.isAnimationDone = false;
    this.timer = Time.timer();
  }

  pickAnimation() {
    return ANIMATION;
  }

  update() {
    if (this.isAnimationDone) {
      this.runDamageAccrual();
    } else {
      this.runAnimation();
    }
    return this;
  }

  runDamageAccrual() {
    if (this.subject.isDead()) {
      return;
    }
    if (this.timer.elapsed() >= DAMAGE_DURATION) {
      this.subject.takeDamage(SINKING_DAMAGE);
      this.timer.reset();
    }
  }

  runAnimation() {
    if (this.subject.isDead()) {
      return;
    }
    if (this.timer.elapsed() >= SINKING_DURATION) {
      this.subject.setGraphics(new NoGraphics(this.subject));
      this.timer.reset();
      this.isAnimationDone = true;
    }
    this.subject.getGraphics().start();
  }
}

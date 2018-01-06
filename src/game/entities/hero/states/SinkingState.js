import GameEvent from "../../../engine/GameEvent";
import NoGraphics from "../../components/graphics/NoGraphicsComponent";
import State from "../../../engine/State";
import Time from "../../../engine/Time";
import Vector from "../../../engine/Vector";
import Audio from "../../../engine/Audio";

const ANIMATION = "plunging";
const SINKING_DURATION = 300;
const FPS = 10;

export default class SinkingState extends State {
  timer;

  enter() {
    Audio.playEffect(Audio.EFFECTS.SPLASH);
    this.subject.getPosition().add(new Vector(0, 8));
    this.subject.setVelocity(new Vector());
    const sprite = this.subject.getGraphics().getSprite();
    sprite.setAnimation(this.pickAnimation());
    sprite.getAnimation().setFps(FPS);
    this.timer = Time.timer();
  }

  pickAnimation() {
    return ANIMATION;
  }

  update() {
    if (this.timer.elapsed() >= SINKING_DURATION) {
      this.subject.setGraphics(new NoGraphics(this.subject));
      GameEvent.fire(GameEvent.HERO_DEATH);
    }
    this.subject.getGraphics().start();
    return this;
  }
}

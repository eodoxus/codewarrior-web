import GameState from "../GameState";
import Url from "../../lib/Url";
import RestClient from "../../lib/RestClient";
import GameEvent from "./GameEvent";

export default class Dialog {
  static data;
  static async load() {
    Dialog.data = await new RestClient().get(Url.PUBLIC + "/dialog.json");
  }

  key;
  state;

  constructor(key, state) {
    this.key = key;
    this.state = state || -1;
    GameEvent.on(GameEvent.CANCEL, this.onCancel, true);
  }

  areRequirementsFulfilled() {
    const msg = this.getMessage();
    if (typeof msg === "string" || !msg.requires) {
      return true;
    }
    const hero = GameState.getHero();
    const isEveryExperienceFulfilled = !msg.requires.some(
      experience => !!!hero.getExperienceStatus(experience)
    );
    return isEveryExperienceFulfilled;
  }

  getAction() {
    const msg = this.getMessage();
    return msg && msg.action;
  }

  getMessage() {
    return Dialog.data[this.key][this.state];
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
  }

  next() {
    const msg = this.getMessage();
    const next = (msg && msg.next) || this.state + 1;
    const max = Dialog.data[this.key].length - 1;
    this.state = Math.min(max, next);
    if (!this.areRequirementsFulfilled()) {
      this.state--;
    }
  }

  onCancel = () => {
    this.state--;
  };
}

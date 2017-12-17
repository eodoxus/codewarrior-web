import Url from "../../lib/Url";
import RestClient from "../../lib/RestClient";

export default class Dialog {
  static text;
  static async load() {
    Dialog.text = await new RestClient().get(Url.PUBLIC + "/dialog.json");
  }

  key;
  state;

  constructor(key, state) {
    this.key = key;
    this.state = state || 0;
  }

  getText() {
    const text = Dialog.text[this.key][this.state];
    return text;
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
  }

  next() {
    const maxState = Dialog.text[this.key].length - 1;
    this.state = Math.min(maxState, this.state + 1);
  }
}

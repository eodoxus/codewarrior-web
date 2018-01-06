import NpcBehavior from "../behaviors/NpcBehavior";
import TalkingState from "./TalkingState";

export default class CrestfallenMageBehavior extends NpcBehavior {
  constructor(entity) {
    super(entity);
    this.talkingState = TalkingState;
  }
}

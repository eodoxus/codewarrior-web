import BehaviorComponent from "../components/behaviors/BehaviorComponent";
import GameEvent from "../../engine/GameEvent";
import StoppedState from "./states/StoppedState";
import WalkingState from "./states/WalkingState";

export default class HeroBehavior extends BehaviorComponent {
  listeners;

  constructor(entity) {
    super(entity, StoppedState, StoppedState);
    this.initListeners();
  }

  beginWalking(tile) {
    tile.clear();
    if (this.entity.getMovement().walkTo(tile)) {
      this.state = new WalkingState(this.entity);
    }
  }

  handleCollision(entity) {
    if (entity.isNpc()) {
      const movement = this.entity.getMovement();
      if (this.isIntent(GameEvent.TALK)) {
        movement.faceEntity(entity);
        this.fulfillIntent();
        this.state = new StoppedState(this.entity);
      }
      movement.reroute();
    }
  }

  handleEvent(event) {
    if (event.getType() === GameEvent.CLICK) {
      const tile = event.getData();
      if (tile.hasNpc()) {
        const npc = tile.getEntity();
        this.setIntent(GameEvent.talk(npc));
        npc.getBehavior().setIntent(GameEvent.talk(this.entity));
      }
      this.beginWalking(tile);
    }
    if (event.getType() === GameEvent.COLLISION) {
      this.handleCollision(event.getData());
    }
    if (event.getType() === GameEvent.NPC_INTERACTION) {
      this.handleNpcInteraction(event.getData().interaction);
    }
  }

  handleNpcInteraction(interaction) {
    switch (interaction) {
      case "CrestfallenMage.GivePage":
        this.receiveTatteredPage();
        break;
      default:
        return false;
    }
  }

  initListeners() {
    this.listeners = [];
    let eventName = GameEvent.NPC_INTERACTION;
    this.listeners.push(
      GameEvent.on(eventName, data =>
        this.handleEvent(GameEvent.generic(eventName, data))
      )
    );
  }

  receiveTatteredPage() {
    GameEvent.fire(GameEvent.OPEN_TATTERED_PAGE, {
      hero: this.entity.getApi()
    });
  }
}

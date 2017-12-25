import BehaviorComponent from "../components/behaviors/BehaviorComponent";
import GameEvent from "../../engine/GameEvent";
import Spell from "../items/Spell";
import StoppedState from "./states/StoppedState";
import WalkingState from "./states/WalkingState";

const TATTERED_PAGE = "tatteredPage";

export default class HeroBehavior extends BehaviorComponent {
  listeners;

  constructor(entity) {
    super(entity, StoppedState, StoppedState);
    this.initListeners();
  }

  beginWalking(tile) {
    tile.clear();
    if (this.entity.getMovement().walkTo(tile)) {
      this.state.exit();
      this.state = new WalkingState(this.entity);
    }
  }

  handleCollision(entity) {
    if (entity.isNpc()) {
      const movement = this.entity.getMovement();
      if (this.isIntent(GameEvent.TALK)) {
        movement.faceEntity(entity);
        this.fulfillIntent();
        this.state.exit();
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
      this.handleNpcInteraction(event.getData());
    }
  }

  handleNpcInteraction(interaction) {
    switch (interaction.getType()) {
      case "CrestfallenMage.GivePage":
        this.receiveTatteredPage(interaction.getData());
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

  receiveTatteredPage(spellCode) {
    const inventory = this.entity.getInventory();
    const api = { hero: this.entity.getApi() };
    const spell = new Spell(TATTERED_PAGE, api, spellCode);
    inventory.remove(TATTERED_PAGE);
    inventory.add(spell);
    spell.edit();
    spell.onDoneEditing(() => {
      GameEvent.fire(GameEvent.OPEN_HERO_MENU, this.entity);
    });
  }
}

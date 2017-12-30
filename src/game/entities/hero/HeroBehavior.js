import BehaviorComponent from "../components/behaviors/BehaviorComponent";
import GameEvent from "../../engine/GameEvent";
import GameState from "../../GameState";
import Hint from "../hints/Hint";
import JumpingState from "./states/JumpingState";
import PickingState from "./states/PickingState";
import Spell from "../items/Spell";
import StoppedState from "./states/StoppedState";
import TatteredPage from "../items/TatteredPage";
import WalkingState from "./states/WalkingState";
import BounceState from "./states/BounceState";

const STOPPED_ANIMATION = "walking_down";

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

  getStoppedAnimation() {
    return STOPPED_ANIMATION;
  }

  handleClick(tile) {
    if (this.state instanceof PickingState) {
      this.state.setTarget(tile.getPosition());
      return;
    }
    if (tile.hasNpc()) {
      const npc = tile.getEntity();
      this.setIntent(GameEvent.talk(npc));
      npc.getBehavior().setIntent(GameEvent.talk(this.entity));
    }
    this.beginWalking(tile);
  }

  handleCollision(entity) {
    if (!(entity instanceof Hint) && this.state instanceof JumpingState) {
      this.state = new BounceState(this.entity);
      return;
    }

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
      this.handleClick(event.getData());
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
        if (!this.entity.getInventory().get(TatteredPage.NAME)) {
          this.receiveTatteredPage(interaction.getData());
        } else {
          const spellIdx = 0;
          this.openTatteredPage(spellIdx);
        }
        break;
      default:
        return false;
    }
  }

  jump(tile) {
    this.state = new JumpingState(this.entity, tile);
  }

  initListeners() {
    this.listeners = [];
    let eventName = GameEvent.NPC_INTERACTION;
    this.listeners.push(
      GameEvent.on(eventName, data =>
        this.handleEvent(GameEvent.generic(eventName, data))
      )
    );

    let spellEvent = GameEvent.on(GameEvent.SPELL_CAST, spell => {
      this.entity.fulfillExperience("castSpell");
      spellEvent.remove();
    });
  }

  openTatteredPage(spellIdx) {
    const spell = this.entity
      .getInventory()
      .get(TatteredPage.NAME)
      .getSpell(spellIdx);
    spell.edit();
  }

  receiveTatteredPage(spellCode) {
    const inventory = this.entity.getInventory();
    const tatteredPage = new TatteredPage();
    inventory.add(TatteredPage.NAME, tatteredPage);
    const spell = new Spell(spellCode);
    tatteredPage.addSpell(spell);
    spell.edit();
    spell.onDoneEditing(() => {
      GameState.storeHero(this.entity);
      GameEvent.fire(GameEvent.SAVE_GAME);
    });
  }

  pickAnimation() {
    return this.state && this.state.pickAnimation(this.entity);
  }

  async pickTarget() {
    this.stop();
    this.state = new PickingState(this.entity);
    return await this.state.getTarget();
  }
}

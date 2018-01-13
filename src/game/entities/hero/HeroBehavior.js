import BehaviorComponent from "../components/behaviors/BehaviorComponent";
import ChargingState from "./states/ChargingState";
import GameEvent from "../../engine/GameEvent";
import GameState from "../../GameState";
import JumpingState from "./states/JumpingState";
import PickingState from "./states/PickingState";
import ReadingState from "./states/ReadingState";
import SinkingState from "./states/SinkingState";
import Spell from "../items/Spell";
import StoppedState from "./states/StoppedState";
import TatteredPage from "../items/TatteredPage";
import TransitioningState from "./states/TransitioningState";
import WalkingState from "./states/WalkingState";

const STOPPED_ANIMATION = "walking_down";

export default class HeroBehavior extends BehaviorComponent {
  listeners;

  constructor(entity) {
    super(entity, StoppedState, StoppedState);
    this.initListeners();
  }

  beginTransition(velocity, orientation) {
    this.entity.fulfillExperience("transitioned");
    this.state = new TransitioningState(this.entity, velocity, orientation);
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
      this.state = new WalkingState(this.entity);
      return;
    }
    if (tile.hasNpc()) {
      const npc = tile.getEntity();
      this.setIntent(GameEvent.talk(npc));
      npc.getBehavior().setIntent(GameEvent.talk(this.entity));
      if (npc.intersects(this.entity)) {
        return;
      }
    } else if (!tile.isWalkable()) {
      return GameEvent.fire(GameEvent.DIALOG, {
        error: true,
        msg: "I can't walk there"
      });
    }
    this.beginWalking(tile);
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
      this.handleClick(event.getData());
    }
    if (event.getType() === GameEvent.COLLISION) {
      this.handleCollision(event.getData());
    }
  }

  isReading() {
    return GameState.getIsReading();
  }

  initListeners() {
    GameEvent.on(
      GameEvent.OPEN_TATTERED_PAGE,
      () => (this.state = new ReadingState(this.entity))
    );
    GameEvent.on(GameEvent.SPELL_CAST, spell => {
      this.entity.spendMagic(spell.getCost());
      this.entity.fulfillExperience("castSpell");
    });
  }

  openTatteredPage(spellIdx) {
    const spell = this.entity
      .getInventory()
      .get(TatteredPage.NAME)
      .getSpell(spellIdx);
    spell.edit();
  }

  receiveSpell(spellCode) {
    const spell = new Spell(spellCode);
    const tatteredPage = this.entity.getInventory().get(TatteredPage.NAME);
    tatteredPage.addSpell(spell);
    spell.edit();
    spell.onDoneEditing(() => {
      GameState.storeHero(this.entity);
      GameEvent.fire(GameEvent.SAVE_GAME);
    });
  }

  receiveTatteredPage(spellCode) {
    const inventory = this.entity.getInventory();
    const tatteredPage = new TatteredPage();
    inventory.add(TatteredPage.NAME, tatteredPage);
    this.receiveSpell(spellCode);
    this.entity.setMagic(tatteredPage.getTotalMagic());
  }

  pickAnimation() {
    return this.state && this.state.pickAnimation(this.entity);
  }

  async pickTarget() {
    if (this.state instanceof SinkingState) {
      return;
    }
    this.stop();
    this.state = new PickingState(this.entity);
    return await this.state.getTarget();
  }

  jump(tile) {
    if (this.state instanceof SinkingState) {
      return;
    }
    this.state = new JumpingState(this.entity, tile);
  }

  charge(tile) {
    this.state = new ChargingState(this.entity, tile);
  }

  update() {
    super.update();

    if (this.state instanceof TransitioningState) {
      return;
    }

    const map = this.entity.getMovement().getMap();
    const tile = map && map.getTileAt(this.entity.getOrigin());
    if (!tile) {
      return;
    }
    if (tile.isDoorway()) {
      return GameEvent.fire(GameEvent.DOORWAY, tile);
    }
    if (tile.isTransition()) {
      return GameEvent.fire(GameEvent.TRANSITION, tile);
    }
  }
}

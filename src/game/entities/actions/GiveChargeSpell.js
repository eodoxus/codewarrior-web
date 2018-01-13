import Action from "./Action";
import GameEvent from "../../engine/GameEvent";
import GameState from "../../GameState";

const CHARGE_CODE = `/**
* Charge Command
* To charge, pick a target you want to
* charge into, then pass that position to the
* hero's charge command.
*/
var position = hero.pickTarget();
hero.charge(position);`;

export default class GiveChargeSpellAction extends Action {
  dialog;
  tatteredPageListener;

  execute() {
    this.dialog = this.entity.getBehavior().getDialog();
    const heroBehavior = GameState.getHero().getBehavior();
    heroBehavior.receiveSpell(CHARGE_CODE);
    const spellIdx = 1;
    heroBehavior.openTatteredPage(spellIdx);
    this.dialog.next();
    this.startTatteredPageListener();
  }

  onCloseTatteredPage = () => {
    GameEvent.fireAfterClick(GameEvent.DIALOG, this.dialog.getMessage());
  };

  startTatteredPageListener() {
    if (this.tatteredPageListener) {
      return;
    }
    this.tatteredPageListener = GameEvent.on(
      GameEvent.CLOSE_TATTERED_PAGE,
      () => this.onCloseTatteredPage(),
      true
    );
  }

  finish() {
    this.tatteredPageListener.remove();
  }
}

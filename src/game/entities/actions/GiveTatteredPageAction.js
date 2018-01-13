import Action from "./Action";
import Audio from "../../engine/Audio";
import GameEvent from "../../engine/GameEvent";
import GameState from "../../GameState";
import TatteredPage from "../items/TatteredPage";

const MESSAGE_SUCCESS = 4;
const MESSAGE_TRY_AGAIN = 3;
const JUMP_CODE = `/**
* Jump Command
* To jump, pick a target where you want to
* land, then pass that position to the
* hero's jump command.
*
* Helpful Hint: type alt+space to see what
* other things you can do.
*/
var position = hero.pickTarget();
hero.jump();`;

export default class GiveTatteredPageAction extends Action {
  dialog;
  tatteredPageListeners;

  execute() {
    this.dialog = this.entity.getBehavior().getDialog();
    const hero = GameState.getHero();
    const heroBehavior = hero.getBehavior();
    if (!hero.getInventory().get(TatteredPage.NAME)) {
      heroBehavior.receiveTatteredPage(JUMP_CODE);
    } else {
      const spellIdx = 0;
      heroBehavior.openTatteredPage(spellIdx);
    }
    this.dialog.next();
    this.startTatteredPageListeners();
  }

  onCloseTatteredPage = () => {
    GameEvent.fireAfterClick(GameEvent.DIALOG, this.dialog.getMessage());
  };

  onEditorSuccess = () => {
    this.dialog.setState(MESSAGE_SUCCESS);
    this.entity.getState().speak();
    Audio.play(Audio.EFFECTS.SECRET);
    GameEvent.fire(GameEvent.CLOSE_TATTERED_PAGE);
  };

  onEditorFailure = () => {
    this.dialog.setState(MESSAGE_TRY_AGAIN);
  };

  startTatteredPageListeners() {
    if (this.tatteredPageListeners) {
      return;
    }
    this.tatteredPageListeners = [
      GameEvent.on(
        GameEvent.CLOSE_TATTERED_PAGE,
        () => this.onCloseTatteredPage(),
        true
      ),
      GameEvent.on(
        GameEvent.EDITOR_SUCCESS,
        () => this.onEditorSuccess(),
        true
      ),
      GameEvent.on(GameEvent.EDITOR_FAILURE, () => this.onEditorFailure(), true)
    ];
  }

  finish() {
    this.tatteredPageListeners.forEach(listener => listener.remove());
  }
}

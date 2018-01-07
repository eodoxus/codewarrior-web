import Audio from "../../../engine/Audio";
import GameEvent from "../../../engine/GameEvent";
import GameState from "../../../GameState";
import NpcBehavior from "../behaviors/NpcBehavior";
import TalkingState from "../behaviors/states/TalkingState";
import TatteredPage from "../../items/TatteredPage";

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

export default class CrestfallenMageBehavior extends NpcBehavior {
  constructor(entity) {
    super(entity);
    this.talkingState = MageTalkingState;
  }
}

export class MageTalkingState extends TalkingState {
  dialogListener;
  tatteredPageListeners;

  enter(entity) {
    super.enter(entity);
    this.startDialogListener();
    this.startTatteredPageListeners();
    return this;
  }

  exit() {
    this.removeDialogListener();
    this.removeTatteredPageListeners();
  }

  onCloseTatteredPage = () => {
    GameEvent.fireAfterClick(
      GameEvent.DIALOG,
      this.subject.behavior.getDialog().getMessage()
    );
  };

  onDialogConfirm = dialog => {
    this.removeDialogListener();
    const mageDialog = this.subject.behavior.getDialog();
    let spellCode;
    if (mageDialog.getState() === 2) {
      spellCode = JUMP_CODE;
    }
    GameEvent.fire(
      GameEvent.NPC_INTERACTION,
      GameEvent.generic(dialog.action, spellCode)
    );
    mageDialog.next();
  };

  onEditorSuccess = () => {
    Audio.playEffect(Audio.EFFECTS.SECRET);
    this.subject.behavior.getDialog().setState(4);
    GameEvent.fire(GameEvent.CLOSE_TATTERED_PAGE);
  };

  onEditorFailure = () => {
    this.subject.behavior.getDialog().setState(3);
  };

  removeDialogListener() {
    if (this.dialogListener) {
      this.dialogListener.remove();
      delete this.dialogListener;
    }
  }

  removeTatteredPageListeners() {
    if (this.tatteredPageListeners) {
      this.tatteredPageListeners.forEach(listener => listener.remove());
      delete this.tatteredPageListeners;
    }
  }

  startDialogListener() {
    if (!this.dialogListener) {
      this.dialogListener = GameEvent.on(
        GameEvent.CONFIRM,
        event => this.onDialogConfirm(event.dialog),
        true
      );
    }
  }

  startTatteredPageListeners() {
    if (!this.tatteredPageListeners) {
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
        GameEvent.on(
          GameEvent.EDITOR_FAILURE,
          () => this.onEditorFailure(),
          true
        )
      ];
    }
  }

  updateDialog() {
    const dialog = this.subject.behavior.getDialog();
    const caveSceneState = GameState.getSceneState("HomeCaveScene");
    switch (dialog.getState()) {
      case 0:
        const hasEnteredCave = !!caveSceneState;
        if (hasEnteredCave) {
          dialog.next();
        }
        break;
      case 1:
        dialog.next();
        break;
      case 2:
        break;
      case 3:
        dialog.setState(2);
        break;
      case 4:
        dialog.next();
        break;
      case 5:
        const hero = GameState.getHero();
        if (!hero.getInventory().get(TatteredPage.NAME)) {
          dialog.setState(2);
        }
        break;
      default:
        dialog.setState(0);
    }
  }
}

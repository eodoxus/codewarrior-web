import GameSaveModel from "../data/GameSaveModel";
import DataCollection from "../data/DataCollection";

let gameSave;
let state = {
  scenes: {}
};

export default class GameState {
  static getBehaviorState(behavior) {
    const dialog = behavior.getDialog && behavior.getDialog();
    if (dialog) {
      return {
        dialog: dialog.getState()
      };
    }
  }

  static getEntityState(entity) {
    const behaviorState = GameState.getBehaviorState(entity.getBehavior());
    if (behaviorState) {
      return {
        behavior: behaviorState
      };
    }
  }

  static async getGameSave(slot) {
    if (!gameSave || gameSave.slot !== slot) {
      const token = GameSaveModel.getToken();
      let saves = await DataCollection.create(GameSaveModel).list({ token });
      if (saves.length) {
        gameSave = saves[slot];
      } else {
        gameSave = new GameSaveModel({ token, slot });
      }
    }
    return gameSave;
  }

  static getLastScene() {
    return state.lastScene;
  }

  static getSceneState(sceneName) {
    return state.scenes[sceneName];
  }

  static async load(slot = 0) {
    const save = await GameState.getGameSave(slot);
    if (save && save.data) {
      state = save.data;
    }
  }

  static restoreBehavior(behavior, state) {
    const dialog = behavior.getDialog && behavior.getDialog();
    if (dialog) {
      dialog.setState(state.dialog);
    }
  }

  static restoreEntity(entity, state) {
    if (!state) {
      return;
    }

    Object.keys(state).forEach(key => {
      if (key === "behavior") {
        GameState.restoreBehavior(entity.getBehavior(), state.behavior);
      }
    });
  }

  static restoreHero(hero) {}

  static restoreScene(scene) {
    const sceneState = state.scenes[scene.getName()];
    if (!sceneState) {
      return;
    }

    Object.keys(sceneState).forEach(key => {
      if (key === "entities") {
        sceneState.entities.forEach(entityState => {
          scene.getEntities().forEach(entity => {
            if (entityState.id === entity.getId()) {
              GameState.restoreEntity(entity, entityState);
            }
          });
        });
      }
    });
  }

  static async save(slot = 0) {
    const save = await GameState.getGameSave(slot);
    save.data = state;
    save.save();
  }

  static setLastScene(scene) {
    return (state.lastScene = scene);
  }

  static storeHero() {}

  static storeScene(scene) {
    const sceneState = {};
    const entities = [];
    scene.getEntities().forEach(entity => {
      if (!entity.isHero()) {
        const entityState = GameState.getEntityState(entity);
        if (entityState) {
          entityState.id = entity.getId();
          entities.push(entityState);
        }
      }
    });
    if (entities.length) {
      sceneState.entities = entities;
    }
    state.scenes[scene.getName()] = sceneState;
  }

  static timer() {
    return new Timer();
  }

  static timestamp() {
    return window.performance && window.performance.now
      ? window.performance.now()
      : new Date().getTime();
  }
}

class Timer {
  dt;
  time;

  constructor() {
    this.dt = 0;
    this.time = GameState.timestamp();
  }

  elapsed() {
    const now = GameState.timestamp();
    this.dt += now - this.time;
    this.time = now;
    return this.dt;
  }
}

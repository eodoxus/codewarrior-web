import * as _ from "lodash";
import GameSaveModel from "../data/GameSaveModel";
import DataCollection from "../data/DataCollection";
import GameScriptModel from "../data/GameScriptModel";
import Spell from "./entities/items/Spell";
import TatteredPage from "./entities/items/TatteredPage";

let gameSave;
let gameSaveSlot = 0;
let sceneApi;
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

  static async getGameSave() {
    const slot = gameSaveSlot + "";
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

  static getSceneApi() {
    return sceneApi;
  }

  static getSceneState(sceneName) {
    return state.scenes[sceneName];
  }

  static async load(slot) {
    gameSaveSlot = slot;
    const save = await GameState.getGameSave();
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

  static async restoreHero(hero) {
    if (!state.hero || !state.hero.inventory) {
      return;
    }
    await state.hero.inventory.forEach(async item => {
      const restoreFn = "restore" + _.upperFirst(item.id);
      await GameState[restoreFn](hero);
    });
  }

  static async restoreTatteredPage(hero) {
    const scriptsCollection = DataCollection.create(GameScriptModel);
    const token = GameSaveModel.getToken();
    const scripts = await scriptsCollection.list({ token });
    const tatteredPage = new TatteredPage();
    if (scripts.length) {
      scripts.forEach(script => {
        const spell = new Spell();
        spell.setScript(script);
        tatteredPage.addSpell(spell);
      });
    }
    hero.getInventory().add(TatteredPage.NAME, tatteredPage);
  }

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

  static async save(slot) {
    gameSaveSlot = slot;
    const save = await GameState.getGameSave();
    save.data = state;
    return save.save();
  }

  static setLastScene(scene) {
    return (state.lastScene = scene);
  }

  static setSceneApi(api) {
    sceneApi = api;
  }

  static storeHero(hero) {
    state.hero = { inventory: [] };
    const inventory = hero.getInventory();
    inventory.getItems().forEach(item => {
      state.hero.inventory.push({
        id: item.getId()
      });
    });
  }

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

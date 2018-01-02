import * as _ from "lodash";
import GameSaveModel from "../data/GameSaveModel";
import DataCollection from "../data/DataCollection";
import GameScriptModel from "../data/GameScriptModel";
import Spell from "./entities/items/Spell";
import TatteredPage from "./entities/items/TatteredPage";

let _hero;
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
    const state = {
      _isDead: entity.isDead()
    };
    const behaviorState = GameState.getBehaviorState(entity.getBehavior());
    if (behaviorState) {
      state.behavior = behaviorState;
    }
    return state;
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

  static getHero() {
    return _hero;
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
      } else {
        entity[key] = state[key];
      }
    });
  }

  static async restoreHero(hero) {
    _hero = hero;

    if (!state.hero) {
      return;
    }

    if (state.hero.experiences) {
      state.hero.experiences.forEach(experience => {
        hero.fulfillExperience(experience);
      });
    }

    if (state.hero.inventory) {
      await state.hero.inventory.forEach(async item => {
        const restoreFn = "restore" + _.upperFirst(item.id);
        await GameState[restoreFn](hero);
      });
    }

    hero.health = state.hero.health;
    hero.totalHealth = state.hero.totalHealth;
    hero.magic = state.hero.magic;
    hero.totalMagic = state.hero.totalMagic;
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
    state.hero = { experiences: [], inventory: [] };
    Object.keys(hero.getExperiences()).forEach(experience => {
      state.hero.experiences.push(experience);
    });
    state.hero.health = hero.health;
    state.hero.totalHealth = hero.totalHealth;
    state.hero.magic = hero.magic;
    state.hero.totalMagic = hero.totalMagic;
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
}

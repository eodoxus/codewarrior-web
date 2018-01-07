import * as _ from "lodash";
import GameSaveModel from "../data/GameSaveModel";
import DataCollection from "../data/DataCollection";
import GameScriptModel from "../data/GameScriptModel";
import Spell from "./entities/items/Spell";
import TatteredPage from "./entities/items/TatteredPage";

let gameSave;
let gameSaveSlot = 0;
let heroRef;
let sceneApi;
let state = {
  scenes: {}
};

export default class GameState {
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

  static setGameSave(save) {
    gameSave = save;
  }

  static getGlobalState() {
    return JSON.parse(JSON.stringify(state));
  }

  static getHero() {
    return heroRef;
  }

  static getHeroState() {
    if (state.hero) {
      return JSON.parse(JSON.stringify(state.hero));
    }
  }

  static getIsReading() {
    return state.isReading;
  }

  static setIsReading(isReading) {
    state.isReading = isReading;
  }

  static getLastScene() {
    return state.lastScene;
  }

  static setLastScene(scene) {
    state.lastScene = scene;
  }

  static getSceneApi() {
    return sceneApi;
  }

  static setSceneApi(api) {
    sceneApi = api;
  }

  static getSceneState(sceneName) {
    if (state.scenes[sceneName]) {
      return JSON.parse(JSON.stringify(state.scenes[sceneName]));
    }
  }

  static async load(slot) {
    gameSaveSlot = slot;
    const save = await GameState.getGameSave();
    state = save && save.data ? save.data : (state = { scenes: {} });
  }

  static async save(slot) {
    gameSaveSlot = slot;
    const save = await GameState.getGameSave();
    save.data = state;
    return save.save();
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

  static getBehaviorState(behavior) {
    const dialog = behavior.getDialog && behavior.getDialog();
    if (dialog) {
      return {
        dialog: dialog.getState()
      };
    }
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

  static restoreBehavior(behavior, state) {
    const dialog = behavior.getDialog && behavior.getDialog();
    if (dialog) {
      dialog.setState(state.dialog);
    }
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

  static async restoreHero(hero) {
    heroRef = hero;

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
}

import GameState from "./GameState";
import Scene from "./engine/Scene";
import entities from "./entities";
import Entity from "./engine/Entity";
import Hero from "./entities/hero/Hero";
import Vector from "./engine/Vector";
import DataCollection from "../data/DataCollection";
import GameSaveModel from "../data/GameSaveModel";
import TatteredPage from "./entities/items/TatteredPage";
import Spell from "./entities/items/Spell";

// Mock Data layer aspeects to fake http interaction
const gameSave = new GameSaveModel({
  id: 1,
  token: "test",
  slot: 0,
  data: JSON.parse(
    `{"scenes":{"CrestfallenHome":{"entities":[{"behavior":{"dialog":0},"id":"crestfallenMage"},{"id":"firePit_01"},{"id":"firePit_02"}]}},"lastScene":"CrestfallenHome","hero":{"experiences":[],"inventory":[],"health":12,"totalHealth":12,"magic":0,"totalMagic":0}}`
  )
});
let mockGameSaveList = [gameSave];
DataCollection.prototype.list = () => mockGameSaveList;
GameSaveModel.prototype.save = function() {
  return this;
};

const SCENE_NAME = "test";
const DIALOG_STATE = 1;
let scene;
let hero;
let entity;
let mage;

describe("GameState", () => {
  beforeEach(() => {
    hero = new Hero();
    scene = new Scene(SCENE_NAME, hero);
    entity = entities.create(new Vector(0, 0), {
      name: "entity"
    });
    scene.addEntity(entity);
    mage = entities.create(new Vector(0, 0), {
      animation: "npcs",
      behavior: "Npc",
      fps: "10",
      graphics: "AnimatedSprite",
      dialog: "CrestfallenHome.CrestfallenMage",
      endX: "150",
      endY: "82",
      movement: "Pacing",
      npc: "true",
      velocityX: "10",
      velocityY: "0",
      width: "24",
      height: "32"
    });
    scene.addEntity(mage);
  });

  describe("Scene", () => {
    it("stores a scene and its entities", () => {
      hero.setPosition(new Vector(10, 10));
      entity.setPosition(new Vector(30, 10));
      mage.setPosition(new Vector(10, 30));
      mage
        .getBehavior()
        .getDialog()
        .setState(1);
      GameState.storeScene(scene);
      const sceneState = GameState.getSceneState(SCENE_NAME);
      expect(sceneState).toBeDefined();
      expect(sceneState.entities.length).toBe(2);
      expect(sceneState.entities[1].behavior.dialog).toBe(DIALOG_STATE);
    });

    it("restores a scene and its entities", () => {
      GameState.restoreScene(scene);
      scene.getEntities().forEach(entity => {
        if (entity.getId() === "crestfallenMage") {
          expect(
            entity
              .getBehavior()
              .getDialog()
              .getState()
          ).toBe(DIALOG_STATE);
        }
      });
    });
  });

  describe("Hero", () => {
    it("stores hero", () => {
      hero.fulfillExperience("test");
      const tatteredPage = new TatteredPage();
      tatteredPage.addSpell(new Spell());
      hero.getInventory().add(TatteredPage.NAME, tatteredPage);
      hero.health = 5;
      hero.totalHealth = 10;
      hero.magic = 6;
      hero.totalMagic = 12;
      GameState.storeHero(hero);
      const state = GameState.getHeroState();
      expect(state.experiences.length).toBe(1);
      expect(state.inventory.length).toBe(1);
      expect(state.health).toBe(5);
      expect(state.totalHealth).toBe(10);
      expect(state.magic).toBe(6);
      expect(state.totalMagic).toBe(12);
    });

    it("restores hero", async () => {
      hero = new Hero();
      await GameState.restoreHero(hero);
      expect(hero.getExperienceStatus("test")).toBe(true);
      expect(hero.getInventory().getItems().length).toBe(1);
      const tatteredPage = hero.getInventory().get(TatteredPage.NAME);
      expect(tatteredPage.getSpells().length).toBe(1);
      expect(hero.health).toBe(5);
      expect(hero.totalHealth).toBe(10);
      expect(hero.magic).toBe(6);
      expect(hero.totalMagic).toBe(12);
    });
  });

  describe("Save", () => {
    it("saves GameSave object to api backend", async () => {
      // Mock game save get response to be empty
      mockGameSaveList = [];
      const save = await GameState.save(0);
      expect(save.token).toBe("10000000-1000-4000-8000-100000000000");
      expect(save.data.hero).toBeDefined();
      expect(save.data.scenes.test).toBeDefined();
      expect(save.data.scenes.test.entities.length).toBe(2);
    });

    it("saves appropriate GameSave object to api backend by slot", async () => {
      // Mock game save get response to return 2 existing game saves
      mockGameSaveList = [
        gameSave,
        new GameSaveModel({
          id: 2,
          token: "test",
          slot: 0,
          data: {}
        })
      ];
      const data = await GameState.save(1);
      expect(data.id).toBe(2);
    });
  });

  describe("Load", () => {
    beforeEach(() => {
      GameState.setGameSave(undefined);
    });

    it("creates a new GameSave object if the api responds with empty during load", async () => {
      // Mock game save get response to be empty
      mockGameSaveList = [];
      await GameState.load(0);
      const state = GameState.getGlobalState();
      expect(state.scenes).toEqual({});
      expect(state.hero).not.toBeDefined();
    });

    it("loads data from GameSave object if the api responds with one", async () => {
      // Mock game save get response to be empty
      mockGameSaveList = [gameSave];
      await GameState.load(0);
      const state = GameState.getGlobalState();
      expect(state.scenes.CrestfallenHome.entities.length).toBe(3);
      expect(state.hero).toBeDefined();
      expect(state.lastScene).toBe("CrestfallenHome");
    });

    it("loads data from appropriate GameSave object by slot", async () => {
      // Mock game save get response to be empty
      mockGameSaveList = [
        gameSave,
        new GameSaveModel({
          id: 2,
          token: "test",
          slot: 0,
          data: JSON.parse(`{"scenes": {"test": {}}}`)
        })
      ];
      await GameState.load(1);
      const state = GameState.getGlobalState();
      expect(state.scenes).toEqual({ test: {} });
    });
  });
});

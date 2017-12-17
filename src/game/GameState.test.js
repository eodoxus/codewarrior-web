import GameState from "./GameState";
import Scene from "./engine/Scene";
import entities from "./entities";
import Entity from "./engine/Entity";
import Hero from "./entities/hero/Hero";
import CrestfallenMage from "./entities/npcs/crestfallenMage/CrestfallenMage";
import Vector from "./engine/Vector";

const SCENE_NAME = "Base Scene";
const DIALOG_STATE = 1;
let scene;
let hero;
let entity;
let mage;

describe("GameState", () => {
  beforeEach(() => {
    hero = new Hero();
    scene = new Scene(hero);
    entity = entities.create(new Vector(0, 0), {
      name: "entity"
    });
    scene.addEntity(entity);
    mage = entities.create(new Vector(0, 0), {
      actor: "true",
      dialog: "CrestfallenHome.CrestfallenMage",
      end_x: "150",
      end_y: "82",
      entity: "CrestfallenMage",
      movement: "Pacing",
      npc: "true",
      velocity_x: "10",
      velocity_y: "0"
    });
    scene.addEntity(mage);
  });

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
    expect(sceneState.entities.length).toBe(DIALOG_STATE);
    expect(sceneState.entities[0].behavior.dialog).toBe(DIALOG_STATE);
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

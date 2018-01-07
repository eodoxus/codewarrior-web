import Audio from "./Audio";
import DataCollection from "../../data/DataCollection";
import entities from "../entities/index";
import Entity from "./Entity";
import GameEvent from "./GameEvent";
import GameSaveModel from "../../data/GameSaveModel";
import GameState from "../GameState";
import Hero from "../entities/hero/Hero";
import NoGraphicsComponent from "../entities/components/graphics/NoGraphicsComponent";
import Scene from "./Scene";
import Tile from "./map/Tile";
import TiledMap from "./map/TiledMap";
import Vector from "./Vector";
import TextureCache from "./TextureCache";
import Graphics from "./Graphics";
import Size from "./Size";

jest.mock("./Audio");
jest.mock("../GameState");
jest.mock("./Graphics");

const mockHero = new Hero();
mockHero.setProperty("width", "24");
mockHero.setProperty("height", "32");
mockHero.setGraphics(new NoGraphicsComponent(mockHero));

let scene;
let entity1;
let entity2;

describe("Scene", () => {
  beforeEach(() => {
    mockHero.setPosition(new Vector());
    mockHero.setVelocity(new Vector());
    scene = new Scene("test");
    scene.addEntity(mockHero);
    entity1 = entities.create(new Vector(10, 1), {
      name: "e1",
      graphics: "No",
      width: "10",
      height: "10"
    });
    scene.addEntity(entity1);
    entity2 = entities.create(new Vector(10, 2), {
      name: "e2",
      graphics: "No",
      width: "10",
      height: "10"
    });
    scene.addEntity(entity2);
  });

  it("instantiates without crashing", () => {
    expect(scene).toBeDefined();
  });

  describe("Rendering and Collision Detection", () => {
    let renderOrder;

    beforeEach(() => {
      scene.getMap().render = jest.fn();
      renderOrder = [];
      mockHero.render = () => renderOrder.push("hero");
      entity1.render = () => renderOrder.push("entity1");
      entity2.render = () => renderOrder.push("entity2");
    });

    describe("render", () => {
      it("renders entities in order of their y-coord", () => {
        scene.render();
        expect(renderOrder).toEqual(["entity1", "entity2", "hero"]);
        entity1.setPosition(new Vector(10, 3));
        renderOrder = [];
        scene.renderEntities();
        expect(renderOrder).toEqual(["entity2", "entity1", "hero"]);
        renderOrder = [];
        entity1.setPosition(new Vector(10, 2));
        scene.renderEntities();
        expect(renderOrder).toEqual(["entity2", "entity1", "hero"]);
      });

      it("doesn't render dead entities", () => {
        entity2.die();
        scene.render();
        expect(renderOrder).toEqual(["entity1", "hero"]);
      });

      it("renders the tiled map", () => {
        scene.render();
        expect(scene.getMap().render).toHaveBeenCalledTimes(1);
      });

      it("doesn't render the map if there isn't one", () => {
        scene.setMap(undefined);
        scene.render();
      });

      describe("Debug", () => {
        beforeEach(() => {
          Graphics.debug = true;
        });

        afterEach(() => {
          Graphics.debug = false;
        });

        it("only draws stuff it has info about", () => {
          scene.render();
          expect(Graphics.drawPoint).not.toHaveBeenCalled();
          expect(Graphics.colorize).not.toHaveBeenCalled();
        });

        it("draws pixel at clicked position", () => {
          scene.clickedPosition = new Vector(30, 40);
          scene.render();
          expect(Graphics.drawPoint).toHaveBeenCalledWith(
            scene.clickedPosition
          );
        });

        it("draws black rect on top of clicked tile", () => {
          const tile = new Tile(new Vector(30, 40), new Size(10, 10));
          const rect = tile.getRect();
          scene.clickedTile = tile;
          scene.render();
          expect(Graphics.colorize).toHaveBeenCalledWith(rect, "black");
        });

        it("draws cyan rect on top of debug tile", () => {
          const tile = new Tile(new Vector(30, 40), new Size(10, 10));
          const rect = tile.getRect();
          Graphics.debugTile = tile;
          scene.render();
          expect(Graphics.colorize).toHaveBeenCalledWith(rect, "cyan");
        });
      });
    });

    describe("renderToTexture", () => {
      it("renders the whole scene to a buffer and returns that as a texture", () => {
        const name = "testFrameTexture";
        const tex = scene.renderToTexture();
        expect(tex.getUrl()).toBe(name);
        expect(TextureCache.get(name)).toBeDefined();
        expect(scene.getMap().render).toHaveBeenCalledTimes(1);
        expect(renderOrder).toEqual(["entity1", "entity2", "hero"]);
      });
    });

    describe("detectCollisions", () => {
      beforeEach(() => {
        entity1.setPosition(new Vector(30, 0));
        entity2.die();
        mockHero.handleEvent = jest.fn();
        entity1.handleEvent = jest.fn();
      });

      afterEach(() => {
        mockHero.handleEvent.mockRestore();
        entity1.handleEvent.mockRestore();
      });

      it("doesn't detect collision on dead entities", () => {
        entity2.die();
        entity2.getVelocity = jest.fn();
        scene.detectCollisions();
        expect(entity2.getVelocity).not.toHaveBeenCalled();
        entity1.die();
        entity1.getVelocity = jest.fn();
        scene.detectCollisions();
        expect(entity1.getVelocity).not.toHaveBeenCalled();
      });

      describe("Interesction checks", () => {
        beforeEach(() => {
          jest.spyOn(mockHero, "intersects");
          jest.spyOn(entity1, "intersects");
        });

        afterEach(() => {
          mockHero.intersects.mockRestore();
          entity1.intersects.mockRestore();
        });

        it("doesn't check for collision if entities aren't moving and neither has intent", () => {
          scene.detectCollisions();
          expect(mockHero.intersects).not.toHaveBeenCalled();
          expect(entity1.intersects).not.toHaveBeenCalled();
        });

        it("checks for collision if at least 1 entity is moving", () => {
          mockHero.setVelocity(new Vector(1, 0));
          scene.detectCollisions();
          expect(mockHero.intersects).toHaveBeenCalledTimes(1);
        });

        it("checks for collision if at least 1 entity has intent", () => {
          mockHero.getBehavior().setIntent("test");
          scene.detectCollisions();
          expect(mockHero.intersects).toHaveBeenCalledTimes(1);
        });
      });

      it("doesn't trigger collision handling if entities don't collide", () => {
        mockHero.setVelocity(new Vector(1, 0));
        scene.detectCollisions();
        expect(mockHero.handleEvent).not.toHaveBeenCalled();
        expect(entity1.handleEvent).not.toHaveBeenCalled();
      });

      it("triggers collision handling if entities collide", () => {
        mockHero.setPosition(new Vector(20, 0));
        mockHero.setVelocity(new Vector(1, 0));
        scene.detectCollisions();
        expect(mockHero.handleEvent).toHaveBeenCalledTimes(1);
        expect(mockHero.handleEvent).toHaveBeenCalledWith(
          GameEvent.collision(entity1)
        );
        expect(entity1.handleEvent).toHaveBeenCalledTimes(1);
        expect(entity1.handleEvent).toHaveBeenCalledWith(
          GameEvent.collision(mockHero)
        );
      });
    });
  });

  describe("Getters & Setters", () => {
    describe("getApi", () => {
      it("creates an api by aggregating apis for all entities", () => {
        entity1.getApi = () => "e1api";
        entity2.getApi = () => "e2api";
        const api = scene.getApi();
        expect(Object.keys(api)).toEqual(["hero", "e1", "e2"]);
        expect(api.e1).toEqual("e1api");
        expect(api.e2).toEqual("e2api");
        expect(api.hero.functions).toBeDefined();
      });
    });

    describe("getBackgroundMusic", () => {
      it("returns path to song for the scene by looking up backgroundMusic property on map", () => {
        const map = scene.getMap();
        expect(scene.getBackgroundMusic()).not.toBeDefined();
        map.setProperty(Tile.PROPERTIES.BACKGROUND_MUSIC, "song");
        expect(scene.getBackgroundMusic()).toBe("song");
      });
    });

    describe("getEntities", () => {
      it("returns scene's entities", () => {
        expect(scene.getEntities().length).toBe(3);
      });
    });

    describe("setMap", () => {
      it("sets scene's map and sets it on all scene's entity", () => {
        const mockMap = { id: "testMap" };
        scene.setMap(mockMap);
        expect(scene.getMap()).toBe(mockMap);
        expect(entity1.getMap()).toBe(mockMap);
        expect(entity2.getMap()).toBe(mockMap);
        expect(mockHero.getMap()).toBe(mockMap);
      });
    });

    describe("getName", () => {
      it("returns scene's map's name", () => {
        expect(scene.getName()).toBe("test");
      });
    });

    describe("removeEntity", () => {
      it("removes an entity from entities list if it exists", () => {
        scene.removeEntity(entity1);
        expect(scene.getEntities().length).toBe(2);
      });

      it("does not remove an entity from entities list if it does not exist", () => {
        scene.removeEntity({});
        expect(scene.getEntities().length).toBe(3);
      });
    });

    describe("shouldShowBorder", () => {
      it("returns false if the map data doesn't specify that border should be shown", () => {
        expect(scene.shouldShowBorder()).toBe(false);
      });

      it("returns true if the map data specifies that border should be shown", () => {
        scene.getMap().setProperty(Tile.PROPERTIES.SHOW_BORDER, true);
        expect(scene.shouldShowBorder()).toBe(true);
      });
    });
  });

  describe("init", () => {
    let backgroundMusic;
    beforeEach(async () => {
      const mockGameSave = new GameSaveModel({
        id: 1,
        token: "test",
        slot: 0,
        data: JSON.parse(
          `{"scenes":{"test":{"entities":[{"behavior":{"dialog":0},"id":"crestfallenMage"},{"id":"firePit_01"},{"id":"firePit_02"}]}},"lastScene":"CrestfallenHome","hero":{"experiences":[],"inventory":[],"health":12,"totalHealth":12,"magic":0,"totalMagic":0}}`
        )
      });
      DataCollection.prototype.list = () => [mockGameSave];
      TiledMap.prototype.init = function() {
        this.properties = {
          initialized: true,
          backgroundMusic
        };
      };
      mockHero.init = jest.fn();
      entity1.init = jest.fn();
      entity2.init = jest.fn();
      await scene.init();
    });

    it("initializes the map and adds map entities to scene", async () => {
      const map = scene.getMap();
      map.addEntity(entity1);
      map.addEntity(entity2);
      await scene.init();
      expect(scene.getMap().getProperty("initialized")).toBe(true);
      expect(scene.getEntities().length).toBe(5);
    });

    it("initializes all entities", () => {
      scene.getEntities().forEach(entity => {
        expect(entity.init).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Events", () => {
    describe("onClick", () => {
      it("stores the clicked position and tile on the scene", async () => {
        scene.getMap().getTileAt = () => new Tile(position, new Size(10, 10));
        const position = new Vector(10, 10);
        scene.onClick(position);
        expect(scene.clickedPosition).toBe(position);
        expect(scene.clickedTile.getPosition()).toBe(position);
        expect(scene.clickedTile.getSize()).toEqual(new Size(10, 10));
      });

      it("communicates click to hero if a tile was clicked", async () => {
        mockHero.handleEvent = jest.fn();
        const position = new Vector(10, 10);
        scene.getMap().getTileAt = () => new Tile(position, new Size(10, 10));
        scene.onClick(position);
        expect(mockHero.handleEvent).toHaveBeenCalledTimes(1);
        expect(mockHero.handleEvent).toHaveBeenCalledWith(
          GameEvent.click(scene.clickedTile)
        );
      });

      it("does not communicate click to hero if a tile was not clicked", async () => {
        mockHero.handleEvent = jest.fn();
        scene.getMap().getTileAt = () => undefined;
        scene.onClick(new Vector(10, 10));
        expect(mockHero.handleEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe("update", () => {
    beforeEach(() => {
      scene.detectCollisions = jest.fn();
      scene.getMap().trackEntities = jest.fn();
      scene.getEntities().forEach(entity => (entity.update = jest.fn()));
      scene.update();
    });

    it("updates map tiles with entity information", async () => {
      expect(scene.getMap().trackEntities).toHaveBeenCalledTimes(1);
      expect(scene.getMap().trackEntities).toHaveBeenCalledWith(
        scene.getEntities()
      );
    });

    it("updates all entities", async () => {
      scene
        .getEntities()
        .forEach(entity => expect(entity.update).toHaveBeenCalledTimes(1));
    });

    it("detects all collisions after updates", async () => {
      expect(scene.detectCollisions).toHaveBeenCalledTimes(1);
    });
  });
});

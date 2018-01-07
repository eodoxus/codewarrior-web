import Audio from "./Audio";
import GameEvent from "./GameEvent";
import GameState from "../GameState";
import Hero from "../entities/hero/Hero";
import Scene from "./Scene";
import SceneLoader from "./SceneLoader";
import TiledMap from "./map/TiledMap";

jest.mock("./Audio");
jest.mock("./Scene");
jest.mock("../GameState");

let loader;
let scene;

describe("SceneLoader", () => {
  beforeEach(() => {
    loader = new SceneLoader();
    loader.setHero(new Hero());
    jest.spyOn(loader, "loadScene");
  });

  describe("unloadCurrentScene", () => {
    it("does nothing if there isn't a current scene", () => {
      loader.unloadCurrentScene();
      expect(GameState.storeHero).not.toHaveBeenCalled();
    });

    it("stops hero, closes tattered page, stores scene and hero", async () => {
      let isEditing = true;
      loader.hero.stop = jest.fn();
      GameEvent.on(GameEvent.CLOSE_TATTERED_PAGE, () => (isEditing = false));
      await loader.load("test");
      loader.unloadCurrentScene();
      expect(loader.hero.stop).toHaveBeenCalledTimes(1);
      expect(GameState.storeScene).toHaveBeenCalledTimes(1);
      expect(GameState.storeScene).toHaveBeenCalledWith(loader.currentScene);
      expect(GameState.storeHero).toHaveBeenCalledTimes(1);
      expect(GameState.storeHero).toHaveBeenCalledWith(loader.hero);
      expect(isEditing).toBe(false);
    });
  });

  describe("load", () => {
    it("loads a scene's adjacent scenes", async () => {
      await loader.load("test");
      expect(loader.loadScene).toHaveBeenCalledTimes(5);
    });

    it("caches scenes it's already loaded so they are only initialized once", async () => {
      await loader.load("test");
      expect(loader.scenes.length).toBe(5);
      await loader.load("test");
      expect(loader.scenes.length).toBe(5);
    });

    it("stops audio from playing", async () => {
      expect(Audio.stop).toHaveBeenCalledTimes(4);
    });

    it("restores scene data from GameStates", async () => {
      expect(GameState.restoreScene).toHaveBeenCalledTimes(4);
      expect(GameState.setSceneApi).toHaveBeenCalledTimes(4);
    });
  });
});

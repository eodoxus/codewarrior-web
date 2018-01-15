import Hero from "../entities/hero/Hero";
import TiledMap from "../engine/map/TiledMap";

export default class GameState {
  static load = () => Promise.resolve();
  static storeScene = jest.fn();
  static restoreScene = jest.fn();
  static getHero = () => {
    const hero = new Hero();
    hero.setMap(new TiledMap());
    return hero;
  };
  static storeHero = jest.fn();
  static restoreHero = jest.fn();
  static save = jest.fn();
  static getLastScene = () => "Home";
  static setLastScene = jest.fn();
  static setSceneApi = jest.fn();
}

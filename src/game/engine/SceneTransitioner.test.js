import Graphics from "./Graphics";
import Hero from "../entities/hero/Hero";
import NoGraphicsComponent from "../entities/components/graphics/NoGraphicsComponent";
import Scene from "./Scene";
import SceneTransitioner from "./SceneTransitioner";
import Size from "./Size";
import Tile from "./map/Tile";
import Vector from "./Vector";
import TransitioningState from "../entities/hero/states/TransitioningState";

jest.useFakeTimers();
jest.mock("./Graphics");
jest.mock("./Scene");

Graphics.getScale.mockReturnValue(0.75);
const mockHero = new Hero();
mockHero.setProperty("width", "24");
mockHero.setProperty("height", "32");
mockHero.setGraphics(new NoGraphicsComponent(mockHero));
mockHero.render = jest.fn();

function createTransitioner(orientation = { x: "0", y: "1" }) {
  mockHero.setPosition(new Vector(100, 100));
  const transitionTile = new Tile(new Vector(), new Size(10, 10));
  transitionTile.setProperties({
    orientationX: orientation.x,
    orientationY: orientation.y
  });
  const fromScene = new Scene("fromScene");
  const toScene = new Scene("toScene");
  return new SceneTransitioner(
    mockHero,
    fromScene,
    toScene,
    transitionTile,
    new Size(300, 300)
  );
}

function finishTransition(transitioner) {
  while (!transitioner.isDone) {
    jest.runOnlyPendingTimers();
  }
}

describe("SceneTransitioner", () => {
  it("scales scene size to from dom to canvas scale", () => {
    createTransitioner();
    expect(SceneTransitioner.getSceneSize()).toEqual(new Size(225, 225));
  });

  describe("animate", () => {
    it("puts Hero into transitioning state and moves scenes through transition, constraining Hero on scene", () => {
      let transitioner = createTransitioner();
      transitioner.animate();
      expect(mockHero.getState() instanceof TransitioningState).toBe(true);
      finishTransition(transitioner);
      expect(transitioner.to.position).toEqual(new Vector(0, -1));
      expect(transitioner.from.position).toEqual(new Vector(0, -225));
      expect(mockHero.getPosition()).toEqual(new Vector(88, 23.04));
    });

    it("transitions scenes down", async () => {
      let transitioner = createTransitioner({ x: "0", y: "-1" });
      transitioner.animate();
      finishTransition(transitioner);
      expect(transitioner.to.position).toEqual(new Vector(0, 1));
      expect(transitioner.from.position).toEqual(new Vector(0, 225));
      expect(mockHero.getPosition()).toEqual(new Vector(88, 170.36));
    });

    it("transitions scenes left", async () => {
      let transitioner = createTransitioner({ x: "-1", y: "0" });
      transitioner.animate();
      finishTransition(transitioner);
      expect(transitioner.to.position).toEqual(new Vector(1, 0));
      expect(transitioner.from.position).toEqual(new Vector(225, 0));
      expect(mockHero.getPosition()).toEqual(new Vector(179.44, 84));
    });

    it("transitions scenes right", async () => {
      let transitioner = createTransitioner({ x: "1", y: "0" });
      transitioner.animate();
      finishTransition(transitioner);
      expect(transitioner.to.position).toEqual(new Vector(-1, 0));
      expect(transitioner.from.position).toEqual(new Vector(-225, 0));
      expect(mockHero.getPosition()).toEqual(new Vector(21.96, 84));
    });
  });
});

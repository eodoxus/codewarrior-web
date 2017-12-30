import entities from "../entities/index";
import Scene from "./Scene";
import Vector from "./Vector";

const mockHero = {
  setMap: jest.fn(),
  setPosition: jest.fn(),
  getPosition: () => new Vector(100, 100),
  getVelocity: () => new Vector(100, 100),
  hasIntent: () => false,
  intersects: () => false
};

describe("Scene", () => {
  it("instantiates without crashing", () => {
    const scene = new Scene(mockHero);
  });

  describe("Rendering and Collision Detection", () => {
    let renderOrder;
    let scene;
    let entity1;
    let entity2;

    beforeEach(() => {
      renderOrder = [];
      mockHero.render = () => renderOrder.push("hero");
      scene = new Scene(mockHero);
      entity1 = entities.create(new Vector(10, 1), {
        animation: "underworld",
        behavior: "AnimateSometimes",
        fps: "20",
        frame_set: "firePit",
        graphics: "Animation",
        height: "16",
        movement: "Static",
        width: "16"
      });
      entity1.render = () => renderOrder.push("entity1");
      scene.addEntity(entity1);
      entity2 = entities.create(new Vector(10, 2), {
        animation: "underworld",
        behavior: "AnimateSometimes",
        fps: "20",
        frame_set: "firePit",
        graphics: "Animation",
        height: "16",
        movement: "Static",
        width: "16"
      });
      entity2.render = () => renderOrder.push("entity2");
      scene.addEntity(entity2);
    });

    it("renders entities in order of their y-coord", () => {
      scene.renderEntities();
      expect(renderOrder).toEqual(["entity1", "entity2", "hero"]);
      entity1.setPosition(new Vector(10, 3));
      renderOrder = [];
      scene.renderEntities();
      expect(renderOrder).toEqual(["entity2", "entity1", "hero"]);
    });

    it("doesn't render dead entities", () => {
      entity2.kill();
      scene.renderEntities();
      expect(renderOrder).toEqual(["entity1", "hero"]);
    });

    it("doesn't detect collision on dead entities", () => {
      entity2.kill();
      entity2.getVelocity = jest.fn();
      scene.detectCollisions();
      expect(entity2.getVelocity).not.toHaveBeenCalled();
    });
  });
});

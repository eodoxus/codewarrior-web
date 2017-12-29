import entities from "../entities/index";
import Scene from "./Scene";
import Vector from "./Vector";

const mockHero = {
  setMap: jest.fn(),
  setPosition: jest.fn(),
  getPosition: () => new Vector(100, 100)
};

describe("Scene", () => {
  it("instantiates without crashing", () => {
    const scene = new Scene(mockHero);
  });

  it("renders entities in order of their y-coord", () => {
    let renderOrder = [];
    mockHero.render = () => renderOrder.push("hero");
    const scene = new Scene(mockHero);
    const entity1 = entities.create(new Vector(10, 1), {
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
    const entity2 = entities.create(new Vector(10, 2), {
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
    scene.renderEntities();
    expect(renderOrder).toEqual(["entity1", "entity2", "hero"]);
  });
});

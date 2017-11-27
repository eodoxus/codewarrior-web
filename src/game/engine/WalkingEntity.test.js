import WalkingEntity from "./WalkingEntity";
import Vector from "./Vector";
import Sprite from "./Sprite";
import Size from "./Size";
import Tile from "./map/Tile";

let entity;
const entityId = "entity-id";
const spriteId = "sprite-id";

describe("WalkingEntity", () => {
  describe("walkTo", () => {
    beforeEach(() => {
      const mockMap = {
        getTileAt: jest.fn()
      };
      mockMap.getTileAt.mockReturnValue(new Tile(new Vector(), new Size(1, 1)));
      entity = new WalkingEntity(entityId, new Vector(10, 10));
      entity.setSprite(new Sprite(spriteId, new Size(10, 20)));
      entity.setMap(mockMap);
      entity.pathFinder.findPath = jest.fn();
      entity.walkToNextStep = jest.fn();
    });

    it("finds a path to specified tile and begins walking toward it", () => {
      const startTile = new Tile(new Vector(), new Size(1, 1));
      const endTile = new Tile(new Vector(10, 10), new Size(1, 1));
      entity.walkTo(endTile);
      const origin = entity.getOrigin();
      expect(entity.getMap().getTileAt).toHaveBeenCalledWith(origin);
      expect(entity.pathFinder.findPath).toHaveBeenCalledWith(
        startTile.getPosition(),
        endTile.getPosition()
      );
      expect(entity.walkToNextStep).toHaveBeenCalledTimes(1);
    });
  });

  describe("walkToNextStep", () => {
    beforeEach(() => {
      entity = new WalkingEntity(entityId, new Vector(10, 10));
      entity.setMap({});
    });

    it("updates velocity and moves to next step, if there is a next step", () => {
      entity.pathFinder.getNextStep = jest.fn();
      entity.pathFinder.getNextStep.mockReturnValue({});
      entity.moveTo = jest.fn();
      entity.walkToNextStep();
      expect(entity.getVelocity()).toEqual(new Vector(50, 50));
      expect(entity.moveTo).toHaveBeenCalledWith({});
    });

    it("sets velocity to 0 if there isn't a next step", () => {
      entity.pathFinder.getNextStep = jest.fn();
      entity.setVelocity(new Vector(1, 1));
      entity.walkToNextStep();
      expect(entity.getVelocity().magnitude()).toBe(0);
    });
  });
});

import Size from "./Size";
import Sprite from "./Sprite";
import Tile from "./map/Tile";
import Vector from "./Vector";
import WalkingEntity from "./WalkingEntity";

let entity;
const entityId = "entity-id";
const spriteId = "sprite-id";

describe("WalkingEntity", () => {
  describe("moveTo", () => {
    beforeEach(() => {
      entity = new WalkingEntity(entityId, new Vector(10, 10));
      entity.setSprite(new Sprite(spriteId, new Size(10, 20)));
      entity.setVelocity(new Vector(50, 50));
    });

    it("should offset the destination by entity origin and calculate distance", () => {
      entity.moveTo(new Vector(100, 200));
      const move = entity.getCurrentMove();
      expect(move.distanceRemaining).toEqual(new Vector(85, 180));
      expect(move.prev).toEqual(new Vector(10, 10));
      expect(move.end).toEqual(new Vector(95, 190));
    });

    it("should set the velocity in the direction of the destination", () => {
      entity.moveTo(new Vector(100, 200));
      expect(entity.getVelocity()).toEqual(new Vector(50, 50));

      entity.moveTo(new Vector(0, 0));
      expect(entity.getVelocity()).toEqual(new Vector(-50, -50));

      entity.setVelocity(new Vector(50, 50));
      entity.moveTo(new Vector(15, 0));
      expect(entity.getVelocity()).toEqual(new Vector(0, -50));

      entity.setVelocity(new Vector(50, 50));
      entity.moveTo(new Vector(30, 20));
      expect(entity.getVelocity()).toEqual(new Vector(50, 0));

      entity.setVelocity(new Vector(50, 50));
      entity.moveTo(new Vector(15, 20));
      expect(entity.getVelocity()).toEqual(new Vector(0, 0));
    });
  });

  describe("update", () => {
    beforeEach(() => {
      entity = new WalkingEntity(entityId, new Vector(10, 10));
      entity.setSprite(new Sprite(spriteId, new Size(10, 20)));
      entity.setVelocity(new Vector(50, 50));
      jest.spyOn(entity.getVelocity(), "magnitude");
    });

    it("updates the current move", () => {
      entity.updateMove = jest.fn();
      const dt = 100;
      entity.update(dt);
      expect(entity.updateMove).toHaveBeenCalledTimes(1);
    });

    it("does nothing if moveTo hasn't generated a move", () => {
      entity.updateMove();
      expect(entity.getVelocity().magnitude).not.toHaveBeenCalled();
    });

    it("updates the currentMove, reducing distance by the amount travelled", () => {
      entity.moveTo(new Vector(100, 200));
      const nextPosition = new Vector(20, 20);
      entity.setPosition(nextPosition);
      entity.updateMove();
      const move = entity.getCurrentMove();
      expect(move.distanceRemaining).toEqual(new Vector(75, 170));
      expect(move.prev).toEqual(nextPosition);
    });

    it("stops x direction velocity if travelled the total distance in x direction", () => {
      entity.moveTo(new Vector(100, 200));
      const nextPosition = new Vector(100, 20);
      entity.setPosition(nextPosition);
      entity.updateMove();
      const velocity = entity.getVelocity();
      expect(velocity.x).toEqual(0);
      expect(velocity.y).toEqual(50);
    });

    it("stops x direction velocity if travelled the total distance in x direction", () => {
      entity.moveTo(new Vector(100, 200));
      const nextPosition = new Vector(20, 200);
      entity.setPosition(nextPosition);
      entity.updateMove();
      const velocity = entity.getVelocity();
      expect(velocity.x).toEqual(50);
      expect(velocity.y).toEqual(0);
    });

    it("deletes move when travelled entire distance along both axes", () => {
      entity.moveTo(new Vector(100, 200));
      entity.getVelocity().magnitude = jest.fn();
      entity.getVelocity().magnitude.mockReturnValue(0);
      entity.updateMove();
      const move = entity.getCurrentMove();
      expect(move).toBeUndefined();
    });
  });

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

    it("moves to next step, if there is a next step", () => {
      entity.pathFinder.getNextStep = jest.fn();
      entity.pathFinder.getNextStep.mockReturnValue({});
      entity.moveTo = jest.fn();
      entity.walkToNextStep();
      expect(entity.moveTo).toHaveBeenCalledWith({});
    });
  });
});

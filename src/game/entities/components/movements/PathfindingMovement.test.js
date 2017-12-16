import BehaviorComponent from "../behaviors/BehaviorComponent";
import Entity from "../../../engine/Entity";
import GraphicsComponent from "../graphics/GraphicsComponent";
import PathfindingMovement from "./PathfindingMovement";
import Size from "../../../engine/Size";
import Sprite from "../../../engine/Sprite";
import Tile from "../../../engine/map/Tile";
import Vector from "../../../engine/Vector";

let entity;
let movement;
const entityId = "entity-id";
const spriteId = "sprite-id";

function createEntity(id = entityId, position = new Vector()) {
  const entity = new Entity(id);
  entity.behavior = new BehaviorComponent(entity);
  entity.movement = new PathfindingMovement(entity, new Vector(), position);
  entity.graphics = new GraphicsComponent(entity);
  entity.behavior.start();
  movement = entity.getMovement();
  return entity;
}

describe("PathfindingMovement", () => {
  describe("moveTo", () => {
    beforeEach(() => {
      entity = createEntity(entityId, new Vector(10, 10));
      entity.setSprite(new Sprite(spriteId, new Size(10, 20)));
      entity.setVelocity(new Vector(50, 50));
    });

    it("should set the velocity in the direction of the destination", () => {
      movement.moveTo(new Vector(100, 200));
      expect(entity.getVelocity()).toEqual(new Vector(50, 50));

      movement.moveTo(new Vector(0, 0));
      expect(entity.getVelocity()).toEqual(new Vector(-50, -50));
      let a = entity.setVelocity(new Vector(50, 50));
      movement.moveTo(new Vector(10, 0));
      expect(entity.getVelocity()).toEqual(new Vector(0, -50));

      entity.setVelocity(new Vector(50, 50));
      movement.moveTo(new Vector(30, 10));
      expect(entity.getVelocity()).toEqual(new Vector(50, 0));

      entity.setVelocity(new Vector(50, 50));
      movement.moveTo(new Vector(10, 10));
      expect(entity.getVelocity()).toEqual(new Vector(0, 0));
    });
  });

  describe("update", () => {
    beforeEach(() => {
      entity = createEntity(entityId, new Vector(10, 10));
      entity.setSprite(new Sprite(spriteId, new Size(10, 20)));
      entity.setVelocity(new Vector(50, 50));
      jest.spyOn(entity.getVelocity(), "magnitude");
    });

    it("updates the current move", () => {
      movement.updateMove = jest.fn();
      entity.update();
      expect(movement.updateMove).toHaveBeenCalledTimes(1);
    });

    it("does nothing if moveTo hasn't generated a move", () => {
      movement.updateMove();
      expect(entity.getVelocity().magnitude).not.toHaveBeenCalled();
    });

    it("updates the currentMove, reducing distance by the amount travelled", () => {
      movement.moveTo(new Vector(100, 200));
      const nextPosition = new Vector(20, 20);
      entity.setPosition(nextPosition);
      movement.updateMove();
      const move = movement.getCurrentMove();
      expect(move.distanceRemaining).toEqual(new Vector(80, 180));
      expect(move.prev).toEqual(nextPosition);
    });

    it("stops x direction velocity if travelled the total distance in x direction", () => {
      movement.moveTo(new Vector(100, 200));
      const nextPosition = new Vector(100, 20);
      entity.setPosition(nextPosition);
      movement.updateMove();
      const velocity = entity.getVelocity();
      expect(velocity.x).toEqual(0);
      expect(velocity.y).toEqual(50);
    });

    it("stops x direction velocity if travelled the total distance in x direction", () => {
      movement.moveTo(new Vector(100, 200));
      const nextPosition = new Vector(20, 200);
      entity.setPosition(nextPosition);
      movement.updateMove();
      const velocity = entity.getVelocity();
      expect(velocity.x).toEqual(50);
      expect(velocity.y).toEqual(0);
    });

    it("deletes move when travelled entire distance along both axes", () => {
      movement.moveTo(new Vector(100, 200));
      entity.getVelocity().magnitude = jest.fn();
      entity.getVelocity().magnitude.mockReturnValue(0);
      movement.updateMove();
      const move = movement.getCurrentMove();
      expect(move).toBeUndefined();
    });
  });

  describe("walkTo", () => {
    beforeEach(() => {
      const mockMap = {
        getTileAt: jest.fn()
      };
      mockMap.getTileAt.mockReturnValue(new Tile(new Vector(), new Size(1, 1)));
      entity = createEntity(entityId, new Vector(10, 10));
      entity.setSprite(new Sprite(spriteId, new Size(10, 20)));
      entity.setMap(mockMap);
      movement.pathFinder.findPath = jest.fn();
      movement.walkToNextStep = jest.fn();
    });

    it("finds a path to specified tile and begins walking toward it", () => {
      const startTile = new Tile(new Vector(), new Size(1, 1));
      const endTile = new Tile(new Vector(10, 10), new Size(1, 1));
      movement.walkTo(endTile);
      const origin = entity.getOrigin();
      expect(entity.getMap().getTileAt).toHaveBeenCalledWith(origin);
      expect(movement.pathFinder.findPath).toHaveBeenCalledWith(
        startTile.getPosition(),
        endTile.getPosition()
      );
      expect(movement.walkToNextStep).toHaveBeenCalledTimes(1);
    });
  });

  describe("walkToNextStep", () => {
    beforeEach(() => {
      entity = createEntity(entityId, new Vector(10, 10));
      entity.setMap({});
    });

    it("moves to next step, if there is a next step", () => {
      movement.pathFinder.getNextStep = jest.fn();
      movement.pathFinder.getNextStep.mockReturnValue({});
      movement.moveTo = jest.fn();
      movement.walkToNextStep();
      expect(movement.moveTo).toHaveBeenCalledWith({});
    });
  });
});

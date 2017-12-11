import BehaviorComponent from "../entities/components/behaviors/BehaviorComponent";
import Entity from "./Entity";
import GraphicsComponent from "../entities/components/graphics/GraphicsComponent";
import MovementComponent from "../entities/components/movements/MovementComponent";
import Vector from "./Vector";
import Sprite from "./Sprite";
import Size from "./Size";
import Tile from "./map/Tile";

import outline from "./__mocks__/SpriteOutline.json";
Sprite.prototype.getOutline = jest.fn();
Sprite.prototype.getOutline.mockReturnValue(outline);

let entity;
const entityId = "entity-id";
const spriteId = "sprite-id";

function createEntity(id = entityId, position = new Vector()) {
  const entity = new Entity(id);
  entity.behavior = new BehaviorComponent(entity);
  entity.movement = new MovementComponent(entity, new Vector(), position);
  entity.graphics = new GraphicsComponent(entity);
  entity.behavior.start();
  return entity;
}

afterEach(() => {
  entity = undefined;
});

describe("Entity", () => {
  describe("construction", () => {
    beforeEach(() => {
      entity = createEntity();
    });

    it("instantiates without crashing", () => {
      expect(entity).toBeDefined();
    });

    it("defaults position to 0, 0", () => {
      const position = entity.getPosition();
      expect(position.x).toBe(0);
      expect(position.y).toBe(0);
    });
  });

  describe("getOrigin", () => {
    it("should return a Vector positioned at the center of entity", () => {
      entity = createEntity(entityId, new Vector(10, 10));
      entity.setSprite(new Sprite(new Size(10, 20)));
      expect(entity.getOrigin()).toEqual(new Vector(15, 20));
    });
  });

  describe("intersects", () => {
    beforeEach(() => {
      entity = createEntity(entityId, new Vector(10, 10));
      entity.setSprite(new Sprite(new Size(10, 20)));
      const sprite = entity.getSprite();
      sprite.intersects = jest.fn();
      sprite.intersects.mockReturnValue(true);
    });

    it("should return true if a point intersects the entity", () => {
      expect(entity.intersects(new Vector(11, 11))).toBe(true);
    });

    it("should return false if a point does not intersect the entity", () => {
      expect(entity.intersects(new Vector(9, 11))).toBe(false);
      expect(entity.intersects(new Vector(21, 31))).toBe(false);
    });

    it("should return true if an entity's outline intersects this entity's outline", () => {
      const collisionEntity = createEntity("test", new Vector(17, 29));
      collisionEntity.setSprite(new Sprite(new Size(10, 20)));
      expect(entity.intersects(collisionEntity)).toBe(true);
    });

    it("should return false if entity rects intersect, but outlines don't", () => {
      const collisionEntity = createEntity("test", new Vector(19, 29));
      collisionEntity.setSprite(new Sprite(new Size(10, 20)));
      expect(entity.intersects(collisionEntity)).toBe(false);
    });

    it("should return false if entity rects don't intersect", () => {
      const collisionEntity = createEntity("test", new Vector(20, 29));
      collisionEntity.setSprite(new Sprite(new Size(10, 20)));
      expect(entity.intersects(collisionEntity)).toBe(false);
    });
  });

  describe("render", () => {
    beforeEach(() => {
      entity = createEntity(entityId, new Vector(10, 10));
      entity.setSprite(new Sprite(new Size(10, 20)));
      entity.getSprite().render = jest.fn();
    });

    it("should render the sprite at entity's position", () => {
      entity.render();
      expect(entity.getSprite().render).toHaveBeenCalledWith(
        entity.getPosition()
      );
    });
  });

  describe("translateToOrigin", () => {
    it("offsets a position to entity's origin", () => {
      entity = createEntity(entityId, new Vector(10, 10));
      entity.setSprite(new Sprite(new Size(10, 20)));
      const position = entity.translateToOrigin(new Vector(20, 30));
      expect(position).toEqual(new Vector(15, 20));
    });
  });

  describe("update", () => {
    beforeEach(() => {
      entity = createEntity(entityId, new Vector(10, 10));
      entity.setVelocity(new Vector(100, 300));
    });

    it("increments position by velocity over the time differential", () => {
      const dt = 100;
      entity.update(dt);
      expect(entity.getPosition().round()).toEqual(new Vector(13, 38));
    });
  });
});

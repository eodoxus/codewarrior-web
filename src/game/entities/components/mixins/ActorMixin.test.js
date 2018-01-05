import ActorMixin from "./ActorMixin";
import entities from "../../";
import Vector from "../../../engine/Vector";

let entity;

function createEntity(name) {
  const entity = entities.create(new Vector(), {
    name,
    graphics: "No",
    width: "10",
    height: "10"
  });
  entity.getGraphics().updateAnimation = jest.fn();
  return entity;
}

describe("ActorMixin", () => {
  beforeEach(() => {
    entity = createEntity("e1");
    ActorMixin.applyTo(entity);
  });

  describe("faceEntity", () => {
    it("causes entity to face another entity", () => {
      expect(entity.getOrientation()).toEqual(new Vector());
      const otherEntity = createEntity("e2");
      entity.getMovement().faceEntity(otherEntity);
      expect(entity.getOrientation()).toEqual(new Vector(1, 0));
    });
  });

  describe("getDialog", () => {
    it("it returns dialog, creating a new one if it doesn't exist yet", () => {
      expect(entity.dialog).toBeUndefined();
      expect(entity.getBehavior().getDialog()).toBeDefined();
    });
  });

  describe("getFaceTowardDirection", () => {
    it("returns an orientation vector pointing toward a point", () => {
      const movement = entity.getMovement();

      // Above
      let orientation = movement.getFaceTowardDirection(new Vector(0, -20));
      expect(orientation).toEqual(new Vector(0, -1));
      // Above-left
      orientation = movement.getFaceTowardDirection(new Vector(-20, -20));
      expect(orientation).toEqual(new Vector(-1, -1));
      // Above-right
      orientation = movement.getFaceTowardDirection(new Vector(11, -11));
      expect(orientation).toEqual(new Vector(1, -1));

      // Below
      orientation = movement.getFaceTowardDirection(new Vector(0, 20));
      expect(orientation).toEqual(new Vector(0, 1));
      // Below-left
      orientation = movement.getFaceTowardDirection(new Vector(-1, 20));
      expect(orientation).toEqual(new Vector(-1, 1));
      // Below-right
      orientation = movement.getFaceTowardDirection(new Vector(11, 20));
      expect(orientation).toEqual(new Vector(1, 1));

      // Left
      orientation = movement.getFaceTowardDirection(new Vector(-20, 0));
      expect(orientation).toEqual(new Vector(-1, 0));

      // Right
      orientation = movement.getFaceTowardDirection(new Vector(20, 0));
      expect(orientation).toEqual(new Vector(1, 0));
    });
  });

  describe("intersectsEntity", () => {
    let otherEntity;
    let graphics;

    beforeEach(() => {
      otherEntity = createEntity("e2");
      graphics = entity.getGraphics();
      graphics.outlinesIntersect = jest.fn();
    });

    it("returns false if entity rects don't overlap", () => {
      otherEntity.setPosition(new Vector(11, 0));
      expect(graphics.intersectsEntity(otherEntity)).toBe(false);
    });

    it("returns true if entity rects overlap and entity is an npc", () => {
      otherEntity.setProperty("npc", true);
      otherEntity.setPosition(new Vector(9, 0));
      expect(graphics.intersectsEntity(otherEntity)).toBe(true);
    });

    it("returns true if entity rects overlap and outlines intersect when entity is not an npc", () => {
      graphics.outlinesIntersect.mockReturnValue(true);
      otherEntity.setPosition(new Vector(9, 0));
      expect(graphics.intersectsEntity(otherEntity)).toBe(true);
    });

    it("returns false if entity rects overlap but outlines don't intersect when entity is not an npc", () => {
      graphics.outlinesIntersect.mockReturnValue(false);
      otherEntity.setPosition(new Vector(9, 0));
      expect(graphics.intersectsEntity(otherEntity)).toBe(false);
    });
  });
});

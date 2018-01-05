import EnemyMixin from "./EnemyMixin";
import Entity from "../../../engine/Entity";
import Time from "../../../engine/Time";

jest.useFakeTimers();

let entity;
let updateSpy;

describe("EnemyMixin", () => {
  beforeEach(() => {
    entity = new Entity("test");
    updateSpy = jest.fn();
    entity.update = updateSpy;
    EnemyMixin.applyTo(entity);
  });

  it("sets a default magic regeneration rate", () => {
    expect(entity.getMagicRegenRate()).toBe(512);
  });

  describe("etters & Setters", () => {
    it("allows user to get & set health", () => {
      entity.setHealth(12);
      expect(entity.getHealth()).toBe(12);
    });

    it("allows user to get & set magic", () => {
      entity.setMagic(12);
      expect(entity.getMagic()).toBe(12);
    });
  });

  describe("spendMagic", () => {
    it("it reduces magic by number of points, constraining minimum to 0", () => {
      entity.setMagic(1000);
      entity.spendMagic(500);
      expect(entity.hasMagic()).toBe(true);
      expect(entity.getMagic()).toBe(500);
      entity.spendMagic(1000);
      expect(entity.hasMagic()).toBe(false);
      expect(entity.getMagic()).toBe(0);
    });
  });

  describe("update", () => {
    it("updates entity, then regenerates magic", () => {
      Time.timestamp = jest.fn().mockReturnValue(0);

      entity.setMagic(10);
      entity.spendMagic(8);
      entity.update();
      expect(entity.getMagic()).toBe(2);
      expect(updateSpy).toHaveBeenCalledTimes(1);

      Time.timestamp.mockReturnValue(100);
      entity.update();
      expect(entity.getMagic()).toBe(2);
      expect(updateSpy).toHaveBeenCalledTimes(2);

      Time.timestamp.mockReturnValue(512);
      entity.update();
      expect(entity.getMagic()).toBe(3);
      expect(updateSpy).toHaveBeenCalledTimes(3);
    });
  });
});

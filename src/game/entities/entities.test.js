import entities from "./";
import Vector from "../engine/Vector";
import Time from "../engine/Time";

describe("BookOfEcmaScript", () => {
  let book;

  beforeEach(async () => {
    book = entities.create(new Vector(0, 0), {
      name: "BookOfEcmaScript",
      end_x: "0",
      end_y: "-5",
      graphics: "ShadowedSprite",
      height: "20",
      movement: "Pacing",
      shadow: "3",
      texture: "items",
      velocity_x: "0",
      velocity_y: "-1",
      width: "32"
    });
    book.start();
  });

  function updateNumTimes(num) {
    for (let i = 0; i < num; i++) {
      book.update();
    }
  }

  let origFrameStep = Time.FRAME_STEP_SEC;
  beforeAll(() => {
    Time.FRAME_STEP_SEC = 1;
  });

  afterAll(() => {
    Time.FRAME_STEP_SEC = origFrameStep;
  });

  describe("construction", () => {
    it("should not crash when instantiated", () => {
      expect(book).toBeDefined();
    });
  });

  describe("update", () => {
    it("should make book float up and down, constrained to 2px range", () => {
      // Float up 5px max
      updateNumTimes(5);
      expect(book.getPosition().y).toBe(-5);
      // Float down 3px
      updateNumTimes(3);
      expect(book.getPosition().y).toBe(-2);
      // Float down to minimum of original y position, 0
      updateNumTimes(2);
      expect(book.getPosition().y).toBe(0);
      // Float up 2px
      updateNumTimes(2);
      expect(book.getPosition().y).toBe(-2);
      // Float up to a max of 2px from original y position, 0
      updateNumTimes(3);
      expect(book.getPosition().y).toBe(-5);
    });
  });
});

import PacingMovement from "../../components/movements/PacingMovement";
import Time from "../../../engine/Time";
import Vector from "../../../engine/Vector";
import CrestfallenMage from "./CrestfallenMage";

import plist from "../../../../../public/animations/npcs.json";

let mage;

function makePositive(velocity) {
  if (velocity.x < 0) {
    velocity.x *= -1;
  }
  return velocity;
}

function updateNumTimes(num) {
  for (let i = 0; i < num; i++) {
    mage.update();
  }
}

let origFrameStep = Time.FRAME_STEP_SEC;
beforeAll(() => {
  Time.FRAME_STEP_SEC = 1;
});

afterAll(() => {
  Time.FRAME_STEP_SEC = origFrameStep;
});

beforeEach(async () => {
  fetch.mockResponse(JSON.stringify(plist));
  mage = new CrestfallenMage("test", {
    end_x: 40,
    velocity_x: 10
  });
  mage.getSprite().loadAnimations(plist);
  mage.setMovement(PacingMovement.create(mage, new Vector(0, 0)));
  mage.getBehavior().start();
});

describe("CrestfallenMage", () => {
  describe("construction", () => {
    it("should not crash when instantiated", () => {
      expect(mage).toBeDefined();
    });
  });

  describe("update", () => {
    it("should make mage walk left and right, constrained to 40px range", () => {
      // Walk right 30px;
      mage.setVelocity(makePositive(mage.getVelocity()));
      updateNumTimes(3);
      expect(mage.getPosition().x).toBe(30);
      // Walk right more constrained to 40px;
      mage.update();
      expect(mage.getPosition().x).toBe(40);
      // Turn around and walk left 10px
      mage.update();
      expect(mage.getPosition().x).toBe(30);
      // Walk left 10 more px
      mage.update();
      expect(mage.getPosition().x).toBe(20);
      // Walk left more constrained to 0px;
      updateNumTimes(2);
      expect(mage.getPosition().x).toBe(0);
      // Turn around and walk right 10px
      mage.update();
      expect(mage.getPosition().x).toBe(10);
    });
  });
});

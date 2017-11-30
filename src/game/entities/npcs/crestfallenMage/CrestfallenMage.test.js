import CrestfallenMage from "./CrestfallenMage";

import plist from "../../../../../public/animations/npcs.json";
let mage;
let Entity = CrestfallenMage.__proto__.prototype;

beforeEach(async () => {
  fetch.mockResponse(JSON.stringify(plist));
  mage = new CrestfallenMage();
  await mage.loadAssets();
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
      mage.update(3000);
      expect(mage.getPosition().x).toBe(30);
      // Walk right more constrained to 40px;
      mage.update(2000);
      expect(mage.getPosition().x).toBe(40);
      // Turn around and walk left 10px
      mage.update(1000);
      expect(mage.getPosition().x).toBe(30);
      // Walk left 10 more px
      mage.update(1000);
      expect(mage.getPosition().x).toBe(20);
      // Walk left more constrained to -40px;
      mage.update(10000);
      expect(mage.getPosition().x).toBe(-40);
      // Turn around and walk right 10px
      mage.update(1000);
      expect(mage.getPosition().x).toBe(-30);
    });
  });
});

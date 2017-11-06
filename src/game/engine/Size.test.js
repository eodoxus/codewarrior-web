import Size from "./Size";

let size;

describe("Size", () => {
  beforeEach(function() {
    size = new Size(10, 20);
  });

  describe("scale", () => {
    it("it increases the width and height by a factor", () => {
      size.scale(2);
      expect(size.width).toBe(20);
      expect(size.height).toBe(40);
    });
  });
});

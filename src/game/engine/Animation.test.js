import Animation from "./Animation";

const dt = 101;
let animation;

describe("Animation", () => {
  beforeEach(() => {
    animation = new Animation("test", "", 100, 100, 100, [
      { id: 1 },
      { id: 2 }
    ]);
  });

  afterEach(() => {
    animation = undefined;
  });

  describe("addFrame", () => {
    it("adds a new frame to frames list", () => {
      animation.addFrame();
      expect(animation.frames.length).toBe(3);
    });
  });

  describe("getFrame", () => {
    it("gets the current frame", () => {
      expect(animation.getFrame().id).toBe(1);
    });
  });

  describe("reset", () => {
    it("adds sets current frame back to 0", () => {
      animation.curFrame = 1;
      animation.reset();
      expect(animation.curFrame).toBe(0);
    });
  });

  describe("update", () => {
    it("does nothing if the animation is not running", () => {
      animation.update(dt);
      expect(animation.getFrame().id).toBe(1);
    });

    it("does nothing if not enough time has passed to change frames", () => {
      animation.update(100);
      expect(animation.getFrame().id).toBe(1);
    });

    it("changes to next frame if it is running and more time has passed than its framerate", () => {
      animation.start();
      animation.update(dt);
      expect(animation.getFrame().id).toBe(2);
    });

    it("resets to first frame when it has run through all frames", () => {
      animation.start();
      animation.update(dt);
      animation.update(dt);
      expect(animation.getFrame().id).toBe(1);
    });
  });
});

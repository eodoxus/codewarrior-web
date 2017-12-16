import Animation from "./Animation";
import Vector from "./Vector";
import Size from "./Size";
import Texture from "./Texture";
import Time from "./Time";

let animation;

function updateNumTimes(num) {
  for (let i = 0; i < num; i++) {
    animation.update();
  }
}

let origFrameStep = Time.FRAME_STEP_SEC;
beforeAll(() => {
  Time.FRAME_STEP = 10;
});

afterAll(() => {
  Time.FRAME_STEP = origFrameStep;
});

describe("Animation", () => {
  beforeEach(() => {
    const fps = 20;
    const frames = [
      { x: 48, y: 32, w: 24, h: 27 },
      { x: 72, y: 32, w: 24, h: 27 }
    ];
    animation = new Animation("test", "tex", fps, frames);
  });

  afterEach(() => {
    animation = undefined;
  });

  describe("addFrame", () => {
    it("adds a new frame to frames list", () => {
      animation.addFrame({ x: 96, y: 32, w: 24, h: 27 });
      expect(animation.frames.length).toBe(3);
    });
  });

  describe("getFrame", () => {
    it("gets the current frame", () => {
      const frame = animation.getCurrentFrame();
      expect(frame).toEqual(
        new Texture("tex", new Vector(48, 32), new Size(24, 27))
      );
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
    beforeEach(() => {
      animation.start();
    });

    it("does nothing if the animation is not running", () => {
      animation.stop();
      animation.update();
      const frame = animation.getCurrentFrame();
      expect(frame.getPosition()).toEqual(new Vector(48, 32));
    });

    it("does nothing if not enough time has passed to change frames", () => {
      animation.update();
      const frame = animation.getCurrentFrame();
      expect(frame.getPosition()).toEqual(new Vector(48, 32));
    });

    it("changes to next frame if it is running and more time has passed than its framerate", () => {
      updateNumTimes(5);
      const frame = animation.getCurrentFrame();
      expect(frame.getPosition()).toEqual(new Vector(72, 32));
    });

    it("resets to first frame when it has run through all frames", () => {
      updateNumTimes(1);
      const frame = animation.getCurrentFrame();
      expect(frame.getPosition()).toEqual(new Vector(48, 32));
    });
  });
});

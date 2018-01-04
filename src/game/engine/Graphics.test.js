import Canvas from "./__mocks__/Canvas";
import Graphics from "./Graphics";
import Rect from "./Rect";
import Size from "./Size";
import Texture from "./Texture";
import Vector from "./Vector";

const TWO_PI = 6.283185307179586;

let canvas;
let context;

beforeEach(() => {
  Graphics.reset();
  canvas = new Canvas();
  context = canvas.getContext("2d");
  Graphics.setDrawingSurface(canvas);
  Graphics.setSize(new Size(100, 100));
  Graphics.scale(1.5);
});

describe("Graphics", () => {
  describe("isReady", () => {
    it("returns false if Graphics doesn't have a renderer yet", () => {
      Graphics.reset();
      expect(Graphics.isReady()).toBe(false);
    });

    it("returns true if Graphics has a renderer", () => {
      expect(Graphics.isReady()).toBe(true);
    });
  });

  describe("clear", () => {
    it("clears the canvas, used between frame draws to clear before drawing", () => {
      Graphics.clear();
      expect(context.clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
      expect(context.beginPath).toHaveBeenCalled();
    });
  });

  describe("buffers", () => {
    it("allows multiple buffers to be rendered to their own canvas during the course of a tree render operation", () => {
      const rect = new Rect(0, 0, 10, 10);
      Graphics.openBuffer();
      Graphics.drawRect(rect);
      expect(context.rect).not.toHaveBeenCalled();
      Graphics.openBuffer();
      Graphics.drawRect(rect);
      expect(context.rect).not.toHaveBeenCalled();
      expect(Graphics.closeBuffer()).toBe("canvas5");
      Graphics.drawBuffer();
      expect(context.drawImage).toHaveBeenCalled();
      expect(Graphics.closeBuffer()).toBe("canvas4");
      Graphics.drawRect(rect);
      expect(context.rect).toHaveBeenCalled();
    });
  });

  describe("drawRect", () => {
    it("draws a rectangle (stroke) on canvas", () => {
      const rect = new Rect(0, 0, 10, 10);
      Graphics.drawRect(rect);
      expect(context.rect).toHaveBeenCalledWith(0, 0, 10, 10);
      expect(context.stroke).toHaveBeenCalled();
    });
  });

  describe("drawEllipse", () => {
    it("draws an ellipse (stroke) on canvas", () => {
      Graphics.drawEllipse(new Vector(0, 0), new Size(10, 10));
      expect(context.ellipse).toHaveBeenCalledWith(0, 0, 5, 5, 0, 0, TWO_PI);
      expect(context.stroke).toHaveBeenCalled();
    });
  });

  describe("drawPoint", () => {
    it("draws a point on canvas", () => {
      Graphics.drawPoint(new Vector(10, 10));
      expect(context.fillRect).toHaveBeenCalledWith(10, 10, 1, 1);
      expect(context.fillStyle).toBe("white");
    });
  });

  describe("drawShadow", () => {
    it("draws a shadow on canvas, defaulting color", () => {
      Graphics.drawShadow(new Vector(10, 10), new Size(20, 20));
      expect(context.ellipse).toHaveBeenCalledWith(
        10,
        10,
        10,
        10,
        0,
        0,
        TWO_PI
      );
      expect(context.fillStyle).toBe(Graphics.COLORS.shadow);
    });

    it("allows user to set shadow color", () => {
      Graphics.drawShadow(new Vector(10, 10), new Size(20, 20), "red");
      expect(context.ellipse).toHaveBeenCalledWith(
        10,
        10,
        10,
        10,
        0,
        0,
        TWO_PI
      );
      expect(context.fill).toHaveBeenCalled();
      expect(context.fillStyle).toBe("red");
    });
  });

  describe("drawTexture", () => {
    it("draws a texture image on canvas", () => {
      const tex = new Texture("test", new Vector(), new Size(10, 10));
      tex.getImage = () => "test";
      Graphics.drawTexture(
        tex.getImage(),
        tex.getSize(),
        tex.getPosition(),
        new Vector(100, 100)
      );
      expect(context.drawImage).toHaveBeenCalledWith(
        "test",
        0,
        0,
        10,
        10,
        100,
        100,
        10,
        10
      );
    });
  });

  describe("getPixel", () => {
    it("pulls a pixel from canvas", () => {
      const pixel = Graphics.getPixel(new Vector(10, 10));
      expect(pixel[0]).toBe(255);
      expect(pixel[1]).toBe(255);
      expect(pixel[2]).toBe(255);
    });
  });

  describe("isTransparent", () => {
    it("returns true if RGB values are all 0", () => {
      expect(Graphics.isTransparent([0, 0, 0])).toBe(true);
    });

    it("returns false if any RGB values are not 0", () => {
      expect(Graphics.isTransparent([1, 0, 0])).toBe(false);
      expect(Graphics.isTransparent([0, 1, 0])).toBe(false);
      expect(Graphics.isTransparent([0, 0, 1])).toBe(false);
    });
  });

  describe("scale", () => {
    beforeEach(() => {
      Graphics.scale(2);
    });

    it("scales the canvas by the scale factor", () => {
      expect(context.scale).toHaveBeenCalledWith(2, 2);
    });

    it("allows user to get the current scale of the canvas", () => {
      expect(Graphics.getScale()).toBe(0.5);
    });

    it("allows user to get the current inverse scale of the canvas", () => {
      expect(Graphics.getInverseScale()).toBe(2);
    });
  });

  describe("colorize", () => {
    it("draws a semi-transparent shade around a rectangle on the canvas", () => {
      Graphics.colorize(new Rect(10, 10, 100, 100), "red");
      expect(context.fillRect).toHaveBeenCalledWith(10, 10, 100, 100);
      expect(context.fillStyle).toBe("red");
    });
  });
});

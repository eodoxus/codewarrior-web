let canvasCount = 0;
export default class Canvas {
  style = {};

  constructor() {
    this.id = canvasCount++;
    this.context = new CanvasContext(this);
  }

  cloneNode = () => new Canvas();
  getContext = type => {
    if (type !== "2d") {
      throw new Error("Expected Canvas.getContext to receive a request for 2d");
    }
    return this.context;
  };
  toDataURL = () => "canvas" + this.id;
  remove = jest.fn();
}

class CanvasContext {
  constructor(canvas) {
    this.canvas = canvas;
  }
  beginPath = jest.fn();
  canvas = this;
  clearRect = jest.fn();
  drawImage = jest.fn();
  ellipse = jest.fn();
  fill = jest.fn();
  getImageData = () => {
    return {
      data: [255, 255, 255]
    };
  };
  rect = jest.fn();
  rect = jest.fn();
  scale = jest.fn();
  stroke = jest.fn();
  fillRect = jest.fn();
  clearRect = jest.fn();
  clearRect = jest.fn();
  clearRect = jest.fn();
}

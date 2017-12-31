export default class Graphics {
  static COLORS = {
    shadow: "#282828",
    shadowBrown: "#493d30",
    shadowBorder: "#1e1e1e"
  };
  static debug = false;
  static debugTile;

  static _renderer;
  static _scale = 1;

  static isReady() {
    return !!Graphics._renderer;
  }

  static clear() {
    Graphics._renderer.clear();
  }

  static openBuffer() {
    Graphics._renderer.openBuffer();
  }

  static drawBuffer() {
    Graphics._renderer.drawBuffer();
  }

  static closeBuffer() {
    return Graphics._renderer.closeBuffer();
  }

  static drawRect(position, size) {
    Graphics._renderer.drawRect(position, size);
  }

  static drawEllipse(position, size, color) {
    Graphics._renderer.drawEllipseStroke(position, size, color);
  }

  static drawPoint(position) {
    const rect = {
      x: position.x,
      y: position.y,
      width: 1,
      height: 1
    };
    Graphics._renderer.colorize(rect, "white", 1.0);
  }

  static drawShadow(position, size, color = Graphics.COLORS.shadow) {
    Graphics._renderer.drawEllipseFilled(position, size, color, 0.7);
  }

  static drawTexture(tex, size, sPos, dPos, alpha = 1.0) {
    Graphics._renderer.drawTexture(tex, size, sPos, dPos, alpha);
  }

  static getPixel(position) {
    return Graphics._renderer.getPixel(position);
  }

  static isTransparent(pixel) {
    for (let iDx = 0; iDx < 3; iDx++) {
      if (pixel[iDx] !== 0) {
        return false;
      }
    }
    return true;
  }

  static setDrawingSurface(surface) {
    if (!Graphics._renderer) {
      Graphics._renderer = new CanvasRenderer(surface);
    } else {
      Graphics._renderer.setSurface(surface);
    }
  }

  static setSize(size) {
    Graphics._renderer.setSize(size);
  }

  static scale(factor) {
    Graphics._scale = 1 / factor;
    Graphics._renderer.scale(factor);
  }

  static getScale() {
    return Graphics._scale;
  }

  static getInverseScale() {
    return 1 / Graphics._scale;
  }

  static colorize(rect, color) {
    Graphics._renderer.colorize(rect, color);
  }
}

class CanvasRenderer {
  canvas;
  context;
  size;

  constructor(canvas) {
    this.canvas = canvas;
    this.setSurface(this.canvas);
  }

  clear() {
    this.context.clearRect(0, 0, this.size.width, this.size.height);
    this.context.beginPath();
  }

  drawEllipseFilled(position, size, color = "#fff", alpha = 1.0) {
    this.context.globalAlpha = alpha;
    this.context.ellipse(
      position.x,
      position.y,
      size.width / 2,
      size.height / 2,
      0,
      0,
      2 * Math.PI
    );
    this.context.fillStyle = color;
    this.context.fill();
    this.context.globalAlpha = 1.0;
  }

  drawEllipseStroke(position, size, color = "#fff", alpha = 1.0) {
    this.context.globalAlpha = alpha;
    this.context.ellipse(
      position.x,
      position.y,
      size.width / 2,
      size.height / 2,
      0,
      0,
      2 * Math.PI
    );
    this.context.strokeStyle = color;
    this.context.stroke();
    this.context.globalAlpha = 1.0;
  }

  drawRect(position, size) {
    this.context.rect(position.x, position.y, size.width, size.height);
    this.context.stroke();
  }

  drawTexture(tex, size, sPos, dPos, alpha) {
    this.context.globalAlpha = alpha;
    this.context.drawImage(
      tex,
      sPos.x,
      sPos.y,
      size.width,
      size.height,
      dPos.x,
      dPos.y,
      size.width,
      size.height
    );
    this.context.globalAlpha = 1.0;
  }

  openBuffer() {
    this.buffer = this.context.canvas.cloneNode();
    this.setSurface(this.buffer);
  }

  drawBuffer() {
    this.canvas.getContext("2d").drawImage(this.buffer, 0, 0);
  }

  closeBuffer() {
    const data = this.buffer.toDataURL();
    this.buffer.remove();
    delete this.buffer;
    this.setSurface(this.canvas);
    return data;
  }

  getPixel(position) {
    return this.context.getImageData(position.x, position.y, 1, 1).data;
  }

  setSurface(canvas) {
    this.context = canvas.getContext("2d");
  }

  setSize(size) {
    this.size = size;
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
  }

  scale(factor) {
    this.context.scale(factor, factor);
  }

  colorize(rect, color, alpha = 0.2) {
    this.context.globalAlpha = alpha;
    this.context.fillStyle = color;
    this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
    this.context.globalAlpha = 1.0;
  }
}

import Size from "./Size";

export default class Graphics {
  static debug = false;

  static _renderer;
  static _scale = 1;

  static init(surface) {
    Graphics._renderer = new CanvasRenderer(surface);
  }

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

  static drawPoint(position) {
    Graphics._renderer.drawRect(position, new Size(1, 1));
  }

  static drawTexture(tex, size, sPos, dPos, alpha = 1.0) {
    Graphics._renderer.drawTexture(tex, size, sPos, dPos, alpha);
  }

  static setDrawingSurface(surface) {
    Graphics._renderer.setSurface(surface);
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

  colorize(rect, color) {
    this.context.globalAlpha = 0.2;
    this.context.fillStyle = color;
    this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
    this.context.globalAlpha = 1.0;
  }
}
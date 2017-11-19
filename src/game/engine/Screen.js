export default class Screen {
  static _renderer;
  static _scale = 1;

  static init(surface) {
    Screen._renderer = new CanvasRenderer(surface);
  }

  static isReady() {
    return !!Screen._renderer;
  }

  static clear() {
    Screen._renderer.clear();
  }

  static openBuffer() {
    Screen._renderer.openBuffer();
  }

  static drawBuffer() {
    Screen._renderer.drawBuffer();
  }

  static closeBuffer() {
    return Screen._renderer.closeBuffer();
  }

  static drawTexture(tex, size, sPos, dPos) {
    Screen._renderer.drawTexture(tex, size, sPos, dPos);
  }

  static setDrawingSurface(surface) {
    Screen._renderer.setSurface(surface);
  }

  static setSize(size) {
    Screen._renderer.setSize(size);
  }

  static scale(factor) {
    Screen._scale = 1 / factor;
    Screen._renderer.scale(factor);
  }

  static getScale() {
    return Screen._scale;
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

  drawTexture(tex, size, sPos, dPos) {
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
}

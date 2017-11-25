export default class Animation {
  curFrame = 0;
  frames;
  height;
  name;
  delay;
  url;
  width;

  _dt = 0;
  _isRunning = false;

  constructor(name, url, width, height, delay, frames = []) {
    this.name = name;
    this.url = url;
    this.width = width;
    this.height = height;
    this.delay = delay;
    this.frames = frames;
  }

  addFrame(frame) {
    this.frames.push(frame);
    return this;
  }

  getFrame() {
    return this.frames[this.curFrame];
  }

  getUrl() {
    return this.url;
  }

  start() {
    this._isRunning = true;
    return this;
  }

  stop() {
    this._isRunning = false;
    return this;
  }

  reset() {
    this.curFrame = 0;
    return this;
  }

  update(dt) {
    if (!this._isRunning) {
      return;
    }
    this._dt += dt;
    if (this._dt > this.delay) {
      this.curFrame++;
      if (this.curFrame === this.frames.length) {
        this.curFrame = 0;
      }
      this._dt = 0;
    }
    return this;
  }
}

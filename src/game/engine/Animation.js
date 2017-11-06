export default class Animation {
  curFrame = 0;
  frames;
  height;
  name;
  speed;
  url;
  width;

  _isRunning = false;
  _dt = 0;

  constructor(name, url, width, height, speed, frames = []) {
    this.name = name;
    this.url = url;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.frames = frames;
  }

  addFrame(frame) {
    this.frames.push(frame);
    return this;
  }

  getFrame() {
    return this.frames[this.curFrame];
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
    if (this._dt > this.speed) {
      this.curFrame++;
      if (this.curFrame === this.frames.length) {
        this.curFrame = 0;
      }
      this._dt = 0;
    }
    return this;
  }
}

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
  _speed = 1;

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

  start(speed = 1) {
    this._speed = speed;
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
    if (this._dt > this.delay * this._speed) {
      this.curFrame++;
      if (this.curFrame === this.frames.length) {
        this.curFrame = 0;
      }
      this._dt = 0;
    }
    return this;
  }
}

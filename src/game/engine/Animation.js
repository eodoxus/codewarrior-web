import Size from "./Size";
import Texture from "./Texture";
import Time from "./Time";
import Vector from "./Vector";

export default class Animation {
  curFrame;
  dt;
  fpsDelay;
  frames;
  isRunning;
  name;
  texture;

  constructor(name, texture, fps, frames = []) {
    this.curFrame = 0;
    this.dt = 0;
    this.fpsDelay = Time.SECOND / fps;
    this.frames = frames;
    this.isRunning = false;
    this.name = name;
    this.texture = texture;
  }

  addFrame(frame) {
    this.frames.push(frame);
    return this;
  }

  getCurrentFrame() {
    const frame = this.frames[this.curFrame];
    return new Texture(
      this.texture,
      new Vector(frame.x, frame.y),
      new Size(frame.w, frame.h)
    );
  }

  getFrames() {
    return this.frames;
  }

  getName() {
    return this.name;
  }

  start() {
    this.isRunning = true;
    return this;
  }

  stop() {
    this.isRunning = false;
    this.dt = 0;
    return this;
  }

  reset() {
    this.curFrame = 0;
    return this;
  }

  update() {
    if (!this.isRunning) {
      return;
    }

    this.dt += Time.FRAME_STEP;
    if (this.dt >= this.fpsDelay) {
      this.curFrame++;
      if (this.curFrame === this.frames.length) {
        this.curFrame = 0;
      }
      this.dt -= this.fpsDelay;
    }
    return this;
  }
}

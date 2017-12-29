export default class Time {
  static SECOND = 1000;
  static FPS = 60;
  static FRAME_STEP = 16;
  static FRAME_STEP_SEC = Time.FRAME_STEP / Time.SECOND;

  static timer() {
    return new Timer();
  }

  static timestamp() {
    return window.performance && window.performance.now
      ? window.performance.now()
      : new Date().getTime();
  }
}

class Timer {
  dt;
  time;

  constructor() {
    this.dt = 0;
    this.time = Time.timestamp();
  }

  elapsed() {
    const now = Time.timestamp();
    this.dt += now - this.time;
    this.time = now;
    return this.dt;
  }
}

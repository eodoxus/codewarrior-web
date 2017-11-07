export default class Time {
  static SECOND = 1000;
  static FPS = 60;

  static getFPSInterval() {
    return Time.SECOND / Time.FPS;
  }
}

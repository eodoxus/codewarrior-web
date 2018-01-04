export default class MockAudio {
  static EFFECTS = {};
  static play = jest.fn();
  static stop = jest.fn();
  static stopAll = jest.fn();
  static stopTrack = jest.fn();
  static load = jest.fn();
}

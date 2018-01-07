export default class MockAudio {
  static EFFECTS = {};
  static play = jest.fn();
  static playEffect = jest.fn();
  static stop = jest.fn();
  static stopAll = jest.fn();
  static stopTrack = jest.fn();
  static load = jest.fn();
  static loadEffect = jest.fn();
  static loadSoundEffects = jest.fn();
}

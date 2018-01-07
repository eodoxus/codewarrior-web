export default class MockAudio {
  static EFFECTS = {};
  static isCurrentlyPlaying = jest.fn();
  static load = jest.fn();
  static loadEffect = jest.fn();
  static loadSoundEffects = jest.fn();
  static loadMusic = jest.fn();
  static play = jest.fn();
  static stop = jest.fn();
  static stopAll = jest.fn();
  static stopTrack = jest.fn();
}

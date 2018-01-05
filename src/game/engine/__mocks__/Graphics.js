export default class Graphics {
  static init = jest.fn();
  static isReady = jest.fn();
  static clear = jest.fn();
  static openBuffer = jest.fn();
  static drawBuffer = jest.fn();
  static closeBuffer = jest.fn();
  static drawPoint = jest.fn();
  static drawTexture = jest.fn();
  static drawRect = jest.fn();
  static setDrawingSurface = jest.fn();
  static setSize = jest.fn();
  static scale = jest.fn();
  static getScale = jest.fn().mockReturnValue(1);
  static getInverseScale = jest.fn().mockReturnValue(1);
  static colorize = jest.fn();
  static getPixel = jest.fn();
  static isTransparent = jest.fn();
}

export default class Util {
  static overwriteMethod(property, name, method) {
    let proto = property.__proto__;
    while (true) {
      if (proto[name]) {
        proto[name] = method;
        break;
      }
      proto = proto.__proto__;
      if (!proto) {
        break;
      }
    }
  }
}

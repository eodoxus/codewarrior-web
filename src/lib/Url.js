export default class Url {
  static BASE = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL
    : "/";

  static PUBLIC = process.env.NODE_ENV === "development"
    ? "/"
    : process.env.PUBLIC_URL;

  static ANIMATIONS = Url.PUBLIC + "animations/";
}

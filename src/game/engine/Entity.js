import Point from "./Point";

export default class Entity {
  position;
  rotation;
  scale;

  constructor(position = new Point(0, 0), rotation = 0, scale = 1) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}

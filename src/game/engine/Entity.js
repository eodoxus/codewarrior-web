import ActorMixin from "../entities/components/mixins/ActorMixin";
import Tile from "./map/Tile";

export default class Entity {
  static makeActor(entity) {
    ActorMixin.applyTo(entity);
  }

  behavior;
  id;
  graphics;
  movement;
  properties;

  constructor(id, properties = {}) {
    this.id = id;
    this.properties = properties;
  }

  getBehavior() {
    return this.behavior;
  }

  getGraphics() {
    return this.graphics;
  }

  getId() {
    return this.id;
  }

  getMap() {
    return this.movement.getMap();
  }

  setMap(map) {
    this.movement.setMap && this.movement.setMap(map);
  }

  getMovement() {
    return this.movement;
  }

  getOrigin() {
    return this.graphics.getOrigin();
  }

  getPosition() {
    return this.movement.getPosition();
  }

  setPosition(p) {
    this.movement.setPosition(p);
  }

  getProperties() {
    return this.properties;
  }

  getProperty(name) {
    return this.properties[name];
  }

  setProperties(properties) {
    this.properties = properties;
  }

  getRect() {
    return this.graphics.getRect();
  }

  getSprite() {
    return this.graphics.getSprite();
  }

  setSprite(s) {
    this.graphics.setSprite(s);
  }

  getState() {
    return this.behavior.getState();
  }

  setState(state) {
    this.behavior.setState(state);
  }

  getVelocity() {
    return this.movement.getVelocity();
  }

  setVelocity(v) {
    this.movement.setVelocity(v);
  }

  getZIndex() {
    return this.graphics.getZIndex();
  }

  handleEvent(event) {
    this.behavior.handleEvent(event);
  }

  hasIntent() {
    return this.behavior.hasIntent();
  }

  intersects(obj) {
    return this.graphics.intersects(obj);
  }

  isIntent(type) {
    return this.behavior.isIntent(type);
  }

  async init() {
    await this.graphics.init();
    this.start();
  }

  isHero(entity) {
    return this.id === "hero";
  }

  isNpc() {
    return !!this.getProperty(Tile.PROPERTIES.NPC);
  }

  render() {
    this.graphics.render();
  }

  start() {
    this.behavior.start();
  }

  stop() {
    this.behavior.stop();
  }

  translateToOrigin(point) {
    return this.graphics.translateToOrigin(point);
  }

  update(dt) {
    this.behavior.update(dt);
  }
}

import ActorMixin from "../entities/components/mixins/ActorMixin";
import Tile from "./map/Tile";
import EnemyMixin from "../entities/components/mixins/EnemyMixin";

export default class Entity {
  static makeActor(entity) {
    ActorMixin.applyTo(entity);
  }

  static makeEnemy(entity) {
    EnemyMixin.applyTo(entity);
  }

  _isDead;
  behavior;
  id;
  graphics;
  movement;
  properties;

  constructor(id, properties = {}) {
    this.id = id;
    this.properties = properties;
  }

  die() {
    this._isDead = true;
  }

  getApi() {
    // Override this
  }

  getBehavior() {
    return this.behavior;
  }

  setBehavior(behavior) {
    this.behavior = behavior;
  }

  getBoundingBox() {
    return this.getGraphics().getOutline().rect;
  }

  getGraphics() {
    return this.graphics;
  }

  setGraphics(graphics) {
    this.graphics = graphics;
  }

  getId() {
    return this.id;
  }

  getMap() {
    return this.movement.getMap();
  }

  setMap(map) {
    this.movement.setMap(map);
  }

  getMovement() {
    return this.movement;
  }

  setMovement(movement) {
    this.movement = movement;
  }

  getOrigin() {
    return this.graphics.getOrigin();
  }

  getOrientation() {
    return this.movement.getOrientation();
  }

  setOrientation(orientation) {
    this.movement.setOrientation(orientation);
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

  setProperty(name, value) {
    this.properties[name] = value;
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

  handleEvent(event) {
    this.behavior.handleEvent(event);
  }

  hasIntent() {
    return this.behavior.hasIntent();
  }

  async init() {
    await this.graphics.init();
    this.start();
  }

  intersects(obj) {
    return this.graphics.intersects(obj);
  }

  isDead() {
    return this._isDead;
  }

  isHero(entity) {
    return this.id === "hero";
  }

  isIntent(type) {
    return this.behavior.isIntent(type);
  }

  isNpc() {
    return !!this.getProperty(Tile.PROPERTIES.NPC);
  }

  isWalkable() {
    return false;
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

  update() {
    this.behavior.update();
  }
}

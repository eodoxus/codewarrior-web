import React from "react";
import PathFinder from "./map/PathFinder";
import Time from "./Time";
import Vector from "./Vector";
import Tile from "./map/Tile";

export default class Entity {
  static DEFAULT_MOVEMENT_VELOCITY = 50;

  currentMove;
  id;
  map;
  pathFinder;
  position;
  sprite;
  state;
  velocity;

  constructor(position = new Vector()) {
    this.position = position;
    this.dt = 0;
    this.state = 0;
    this.velocity = new Vector();
  }

  getCurrentMove() {
    return this.currentMove;
  }

  getMap() {
    return this.map;
  }

  setMap(map) {
    this.map = map;
    this.pathFinder = new PathFinder(this.map);
  }

  getOrigin() {
    return Tile.getOrigin(this.position, this.sprite.getSize());
  }

  getPosition() {
    return this.position;
  }

  setPosition(p) {
    this.position = p;
  }

  getSprite() {
    return this.sprite;
  }

  setSprite(s) {
    this.sprite = s;
  }

  getState() {
    return this.state;
  }

  getVelocity() {
    return this.velocity;
  }

  setVelocity(v) {
    this.velocity = v;
  }

  getStateVelocity() {
    return new Vector(
      Entity.DEFAULT_MOVEMENT_VELOCITY,
      Entity.DEFAULT_MOVEMENT_VELOCITY
    );
  }

  intersects(position) {
    const point = Tile.point(position);
    const spriteRect = new Tile(this.getPosition(), this.sprite.getSize());
    return spriteRect.intersects(point);
  }

  moveTo(position) {
    position = this.translateToOrigin(position);
    //console.log("moving to", position);
    this.currentMove = {
      distanceRemaining: this.position.distanceBetween(position),
      prev: new Vector(this.position.x, this.position.y),
      end: position
    };

    // Set velocity in the direction of the move
    let vx = Math.abs(this.velocity.x);
    let vy = Math.abs(this.velocity.y);
    if (this.position.x === position.x) {
      vx = 0;
    }
    if (this.position.x > position.x) {
      vx *= -1;
    }
    if (this.position.y === position.y) {
      vy = 0;
    }
    if (this.position.y > position.y) {
      vy *= -1;
    }
    this.velocity = new Vector(vx, vy);
  }

  renderDebug() {
    const size = this.sprite.getSize();
    return (
      <div
        className="debug"
        key={this.id}
        style={{
          top: this.position.y + size.height,
          left: this.position.x + size.width
        }}
      >
        position: {this.position.render()}
        <br />
        velocity: {this.velocity.render()}
      </div>
    );
  }

  render() {
    this.sprite.render(this.position);
  }

  stop() {
    delete this.currentMove;
    this.pathFinder.clear();
    this.velocity = new Vector();
  }

  translateToOrigin(position) {
    const size = this.sprite.getSize();
    return Vector.subtract(
      position,
      new Vector(Math.floor(size.width / 2), Math.floor(size.height / 2))
    );
  }

  update(dt) {
    this.dt += dt;
    const velocity = Vector.multiply(this.velocity, Time.toSeconds(dt));
    velocity.multiply(Vector.normalize(this.velocity));
    this.position.add(velocity);
    this.updateMove();
  }

  updateMove() {
    if (!this.currentMove) {
      return;
    }

    const position = new Vector(this.position.x, this.position.y);
    const distance = this.currentMove.prev.distanceBetween(position);
    this.currentMove.distanceRemaining.subtract(distance);
    this.currentMove.prev = position;

    if (this.currentMove.distanceRemaining.x <= 0) {
      this.velocity.x = 0;
    }

    if (this.currentMove.distanceRemaining.y <= 0) {
      this.velocity.y = 0;
    }

    if (this.velocity.magnitude() === 0) {
      delete this.currentMove;
    }
  }

  walkTo(tile) {
    const curTile = this.map.getTileAt(this.getOrigin());
    this.pathFinder.findPath(curTile.getPosition(), tile.getPosition());
    this.walkToNextStep();
  }

  walkToNextStep() {
    const step = this.pathFinder.getNextStep();
    if (step) {
      this.velocity = this.getStateVelocity();
      this.moveTo(step);
    } else {
      this.velocity = new Vector();
    }
  }
}

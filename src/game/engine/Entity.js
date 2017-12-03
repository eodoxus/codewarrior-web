import Rect from "./Rect";
import Tile from "./map/Tile";
import Time from "./Time";
import Vector from "./Vector";

export default class Entity {
  static DEFAULT_MOVEMENT_VELOCITY = 50;

  currentMove;
  id;
  map;
  position;
  properties;
  sprite;
  state;
  velocity;
  zIndex;

  constructor(id, position = new Vector()) {
    this.id = id;
    this.position = position;
    this.dt = 0;
    this.properties = {};
    this.state = 0;
    this.velocity = new Vector();
    this.zIndex = 0;
  }

  getCurrentMove() {
    return this.currentMove;
  }

  getId() {
    return this.id;
  }

  getMap() {
    return this.map;
  }

  setMap(map) {
    this.map = map;
  }

  getOrigin() {
    return Tile.getOrigin(this.position, this.sprite.getSize());
  }

  getOutline() {
    const outline = this.getSprite().getOutline();
    const translatedRows = [];
    const rowIndexes = Object.keys(outline.rows);
    const top = parseInt(rowIndexes[0], 10);
    rowIndexes.forEach(y => {
      const newY = Math.floor(parseInt(y, 10) + this.position.y);
      const row = outline.rows[y];
      translatedRows[newY] = {
        start: row.start + this.position.x,
        end: row.end + this.position.x
      };
    });
    return {
      rows: translatedRows,
      rect: new Rect(
        this.position.x + outline.min,
        this.position.y + top,
        outline.max - outline.min,
        rowIndexes.length
      )
    };
  }

  getPosition() {
    return this.position;
  }

  setPosition(p) {
    this.position = p;
  }

  getProperties() {
    return this.properties;
  }

  setProperties(p) {
    this.properties = p;
  }

  getRect() {
    const p = this.getPosition();
    const s = this.getSprite().getSize();
    return new Rect(p.x, p.y, s.width, s.height);
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

  setState(state) {
    this.state = state;
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

  getZIndex() {
    return this.zIndex;
  }

  handleCollision(entity) {
    this.stop();
  }

  intersects(obj) {
    return obj.getSprite
      ? this.intersectsEntity(obj)
      : this.intersectsPoint(Rect.point(obj));
  }

  intersectsEntity(entity) {
    if (!this.getRect().intersects(entity.getRect())) {
      return false;
    }
    return this.outlinesIntersect(entity.getOutline());
  }

  intersectsPoint(point) {
    if (!this.getRect().intersects(point)) {
      return false;
    }
    return this.getSprite().intersects(point, this.getPosition());
  }

  isEnemy() {
    return this.properties[Tile.PROPERTIES.ENEMY];
  }

  isHero(entity) {
    return this.id === "hero";
  }

  isNpc() {
    return this.properties[Tile.PROPERTIES.NPC];
  }

  async loadAssets() {
    if (!this.sprite) {
      return Promise.resolve();
    }
    return this.sprite.loadAssets();
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

  outlinesIntersect(outline) {
    const thisOutline = this.getOutline();
    if (!thisOutline.rect.intersects(outline.rect)) {
      return false;
    }

    const rows = Object.keys(thisOutline.rows);
    const numRows = rows.length;
    for (let iDx = 0; iDx < numRows; iDx++) {
      const row = rows[iDx];
      if (!outline.rows[row]) {
        continue;
      }
      if (
        thisOutline.rows[row].start < outline.rows[row].end &&
        thisOutline.rows[row].end > outline.rows[row].start
      ) {
        return true;
      }
    }

    return false;
  }

  render() {
    this.sprite.render(this.position);
  }

  start() {
    // Override this
  }

  stop() {
    delete this.currentMove;
    this.velocity = new Vector();
  }

  translateToOrigin(position) {
    if (!this.sprite) {
      return position;
    }
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
}

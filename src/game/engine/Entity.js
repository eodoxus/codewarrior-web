import Rect from "./Rect";
import Tile from "./map/Tile";
import Time from "./Time";
import Vector from "./Vector";

export default class Entity {
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

  getFaceTowardDirection(entity) {
    const pos = this.getPosition();
    const size = this.getSprite().getSize();
    const entityOrigin = entity.getOrigin();

    // Is entity directly left or right?
    if (entityOrigin.y >= pos.y && entityOrigin.y <= pos.y + size.height) {
      // Is entity to the left?
      if (entityOrigin.x < pos.x) {
        // Face left
        return new Vector(-1, 0);
      }
      // Face right
      return new Vector(1, 0);
    }

    // Is entity directly above or below?
    if (entityOrigin.x >= pos.x && entityOrigin.x <= pos.x + size.width) {
      // Is entity above?
      if (entityOrigin.y < pos.y) {
        // Face up
        return new Vector(0, -1);
      }
      // Face down
      return new Vector(0, 1);
    }

    // Is entity above ?
    if (entityOrigin.y < pos.y) {
      // Is entity to the left?
      if (entityOrigin.x < pos.x) {
        // Face up/left
        return new Vector(-1, -1);
      }
      // Face up/right
      return new Vector(1, -1);
    }

    // Entity must be below
    // Is entity to the left?
    if (entityOrigin.x < pos.x) {
      // Face down/left
      return new Vector(-1, 1);
    }
    // Face down/right
    return new Vector(1, 1);
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

  setProperties(properties) {
    this.properties = properties;
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

  getZIndex() {
    return this.zIndex;
  }

  handleEvent(event) {
    this.state = this.state.handleEvent(this, event);
  }

  hasIntent() {
    return false;
  }

  isIntent(type) {
    return false;
  }

  async init() {
    return this.sprite.init();
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

  isHero(entity) {
    return this.id === "hero";
  }

  isNpc() {
    return this.properties[Tile.PROPERTIES.NPC];
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
  }
}

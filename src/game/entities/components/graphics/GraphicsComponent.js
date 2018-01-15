import Graphics from "../../../engine/Graphics";
import Rect from "../../../engine/Rect";
import Size from "../../../engine/Size";
import Tile from "../../../engine/map/Tile";
import Vector from "../../../engine/Vector";

export default class GraphicsComponent {
  static create(entity) {
    return new GraphicsComponent(entity);
  }

  entity;
  shadow;
  sprite;

  constructor(entity) {
    this.entity = entity;
  }

  getOrigin() {
    return Tile.getOrigin(this.entity.getPosition(), this.sprite.getSize());
  }

  getOutline() {
    const outline = this.sprite.getOutline();
    if (!outline) {
      return;
    }
    const translatedRows = [];
    const rowIndexes = Object.keys(outline.rows);
    const top = parseInt(rowIndexes[0], 10);
    const pos = this.entity.movement.getPosition();
    rowIndexes.forEach(y => {
      const newY = Math.floor(parseFloat(y) + pos.y);
      const row = outline.rows[y];
      translatedRows[newY] = {
        start: row.start + pos.x,
        end: row.end + pos.x
      };
    });
    return {
      rows: translatedRows,
      rect: new Rect(
        pos.x + outline.min,
        pos.y + top,
        outline.max - outline.min,
        rowIndexes.length
      )
    };
  }

  getRect() {
    const p = this.entity.getPosition();
    const s = this.getSprite().getSize();
    return new Rect(p.x, p.y, s.width, s.height);
  }

  getSprite() {
    return this.sprite;
  }

  setSprite(s) {
    this.sprite = s;
  }

  async init() {
    await this.sprite.init();
    this._isReady = true;
  }

  intersects(obj) {
    return obj.getSprite
      ? this.intersectsEntity(obj)
      : this.intersectsPoint(Rect.point(obj));
  }

  intersectsEntity(entity) {
    if (!this.getRect().intersects(entity.graphics.getRect())) {
      return false;
    }
    return this.outlinesIntersect(entity.graphics.getOutline());
  }

  intersectsPoint(point) {
    if (!this.getRect().intersects(point)) {
      return false;
    }
    return this.sprite.intersects(point, this.entity.getPosition());
  }

  isReady() {
    return this._isReady;
  }

  outlinesIntersect(outline) {
    const thisOutline = this.getOutline();
    if (!thisOutline || !thisOutline.rect.intersects(outline.rect)) {
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
    this.sprite.render(this.entity.getPosition());

    if (Graphics.debug) {
      Graphics.drawRect(this.getOutline().rect);
    }

    if (this.shadow) {
      this.renderShadow();
    }
  }

  renderShadow() {
    const size = this.getSprite().getSize();
    const width = size.width / 2;
    const position = this.entity.getMovement().getPosition();
    const shadowPosition = new Vector(
      position.x + width,
      position.y + size.height - 2
    );
    Graphics.drawShadow(shadowPosition, new Size(width, 5));
  }

  toggleShadow(isOn = true) {
    this.shadow = isOn;
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

  start() {}

  stop() {}

  update() {}
}

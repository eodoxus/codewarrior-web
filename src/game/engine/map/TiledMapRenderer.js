import Screen from "../../engine/Screen";
import Size from "../../engine/Size";
import TextureCache from "../../engine/TextureCache";
import Vector from "../../engine/Vector";

export default class TiledMapRenderer {
  map;

  constructor(tiledMap) {
    this.map = tiledMap;
  }

  render() {
    this.map.getLayers().forEach(layer => {
      this.renderLayer(layer);
    });
  }

  renderLayer(layer) {
    const textureName = "layer-" + layer.id;
    const texture = TextureCache.get(textureName);
    if (texture) {
      const size = new Size(texture.width, texture.height);
      const position = new Vector(0, 0);
      Screen.drawTexture(texture, size, position, position);
    } else {
      Screen.openBuffer();
      layer.tiles.forEach((tileGid, iDx) => {
        if (!tileGid) {
          return;
        }
        this.renderTile(this.map.tileset, layer, tileGid, iDx);
      });
      Screen.drawBuffer();
      TextureCache.put(textureName, Screen.closeBuffer());
    }
  }

  renderTile(tileset, layer, gid, iDx) {
    gid--;
    const tileSize = tileset.tileSize.width;
    const sourceX = (gid % (tileset.size.width / tileSize)) * tileSize;
    const sourceY = ~~(gid / (tileset.size.width / tileSize)) * tileSize;
    const destX = (iDx % layer.size.width) * tileSize;
    const destY = ~~(iDx / layer.size.width) * tileSize;

    Screen.drawTexture(
      TextureCache.get(tileset.texture),
      tileset.tileSize,
      new Vector(sourceX, sourceY),
      new Vector(destX, destY)
    );
  }
}

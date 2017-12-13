import AnimatedSpriteGraphics from "./AnimatedSpriteGraphics";
import AnimationGraphics from "./AnimationGraphics";
import GraphicsComponent from "./GraphicsComponent";
import Tile from "../../../engine/map/Tile";
import Size from "../../../engine/Size";

const graphics = {
  AnimatedSpriteGraphics,
  AnimationGraphics,
  BaseGraphics: GraphicsComponent
};

graphics.create = entity => {
  const name =
    (entity.getProperty(Tile.PROPERTIES.GRAPHICS) || "Base") + "Graphics";
  if (!graphics[name]) {
    throw new Error(`GraphicsComponent ${name} does not exist`);
  }
  switch (name) {
    case "AnimationGraphics":
      return new AnimationGraphics(
        entity,
        entity.getProperty(Tile.PROPERTIES.ANIMATION),
        entity.getProperty(Tile.PROPERTIES.FRAME_SET),
        new Size(
          entity.getProperty(parseInt(Tile.PROPERTIES.WIDTH, 10)),
          entity.getProperty(parseInt(Tile.PROPERTIES.HEIGHT, 10))
        ),
        entity.getProperty(Tile.PROPERTIES.FPS)
      );
    default:
      return new graphics[name](entity);
  }
};

export default graphics;

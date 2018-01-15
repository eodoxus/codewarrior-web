import AnimatedSpriteGraphics from "./AnimatedSpriteGraphics";
import AnimationGraphics from "./AnimationGraphics";
import GraphicsComponent from "./GraphicsComponent";
import NoGraphics from "./NoGraphicsComponent";
import ShadowedSpriteGraphics from "./ShadowedSpriteGraphics";
import SpriteGraphics from "./SpriteGraphicsComponent";
import Tile from "../../../engine/map/Tile";

const graphics = {
  BaseGraphics: GraphicsComponent,
  AnimatedSpriteGraphics,
  AnimationGraphics,
  NoGraphics,
  ShadowedSpriteGraphics,
  SpriteGraphics
};

graphics.create = (entity, position) => {
  const name =
    (entity.getProperty(Tile.PROPERTIES.GRAPHICS) || "Base") + "Graphics";
  if (!graphics[name]) {
    throw new Error(`GraphicsComponent ${name} does not exist`);
  }
  return graphics[name].create(entity, position);
};

export default graphics;

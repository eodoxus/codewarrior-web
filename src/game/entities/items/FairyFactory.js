import entities from "../index";
import FairyBehavior from "./behaviors/FairyBehavior";
import GameEvent from "../../engine/GameEvent";
import GameState from "../../GameState";
import Tile from "../../engine/map/Tile";
import Vector from "../../engine/Vector";

let count = 0;
export default class FairyFactory {
  static async spawnFairy() {
    const position = getRandomSpawnPoint();
    if (!!!position) {
      return;
    }
    const fairy = entities.create(new Vector(), {
      name: "fairy" + count++,
      behavior: "Fairy",
      graphics: "AnimatedSprite",
      animation: "items",
      fps: "10",
      width: "16",
      height: "16"
    });
    fairy.setMap(getMap());
    fairy.setPosition(fairy.translateToOrigin(position));
    fairy.setVelocity(FairyBehavior.getRandomVelocity());
    fairy.isWalkable = () => true;
    await fairy.init();
    fairy.getGraphics().start();
    GameEvent.fire(GameEvent.ADD_ENTITY, fairy);
    return fairy;
  }

  static remove(entity) {
    GameEvent.fire(GameEvent.REMOVE_ENTITY, entity);
  }
}

function getRandomSpawnPoint() {
  const map = getMap();
  if (!rollForFairy(map.getProperty(Tile.PROPERTIES.FAIRY_CHANCE))) {
    return;
  }

  const mapSize = map.getSize();
  const position = new Vector(
    Math.floor(Math.random() * mapSize.width),
    Math.floor(Math.random() * mapSize.height)
  );
  const tile = map.getClosestWalkableTile(position);
  if (tile) {
    return tile.getOrigin();
  }
}

function rollForFairy(chance) {
  if (!!!chance) {
    return false;
  }
  return Math.random() >= 1 - parseFloat(chance);
}

function getMap() {
  return GameState.getHero().getMap();
}

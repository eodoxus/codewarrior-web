import BookOfEcmaScript from "./items/bookOfEcmaScript/BookOfEcmaScript";
import CrestfallenMage from "./npcs/crestfallenMage/CrestfallenMage";
import Hero from "./hero/Hero";
import UnderworldFirepit from "./underworld/firePit/FirePit";
import Tile from "../engine/map/Tile";

const entities = {
  BookOfEcmaScript,
  CrestfallenMage,
  Hero,
  UnderworldFirepit
};

entities.createEntity = (position, properties) => {
  const entityName = properties[Tile.PROPERTIES.ENTITY];
  if (!entities[entityName]) {
    throw new Error(`Entity ${entityName} does not exist`);
  }
  const entity = new entities[entityName](
    properties[Tile.PROPERTIES.NAME],
    position,
    properties
  );
  return entity;
};

export default entities;

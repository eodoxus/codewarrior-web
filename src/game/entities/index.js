import behaviors from "../entities/components/behaviors";
import graphics from "../entities/components/graphics";
import movements from "../entities/components/movements";

import CrestfallenMage from "./npcs/crestfallenMage/CrestfallenMage";
import Entity from "../engine/Entity";
import Hero from "./hero/Hero";
import Tile from "../engine/map/Tile";

const entities = {
  BaseEntity: Entity,
  CrestfallenMage,
  Hero
};

entities.create = (position, properties) => {
  const name = properties[Tile.PROPERTIES.ENTITY] || "BaseEntity";
  if (!entities[name]) {
    throw new Error(`Entity ${name} does not exist`);
  }
  const entity = new entities[name](
    properties[Tile.PROPERTIES.NAME],
    properties,
    position
  );
  if (!entity.getBehavior()) {
    entity.setBehavior(behaviors.create(entity));
  }
  if (!entity.getGraphics()) {
    entity.setGraphics(graphics.create(entity, position));
  }
  if (!entity.getMovement()) {
    entity.setMovement(movements.create(entity, position));
  }
  if (entity.getProperty("actor")) {
    Entity.makeActor(entity);
  }
  return entity;
};

export default entities;

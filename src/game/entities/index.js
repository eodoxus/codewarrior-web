import behaviors from "../entities/components/behaviors";
import graphics from "../entities/components/graphics";
import movements from "../entities/components/movements";
import Tile from "../engine/map/Tile";

import Barrier from "./items/Barrier";
import Entity from "../engine/Entity";
import Hero from "./hero/Hero";
import TatteredPageHint from "./hints/TatteredPageHint";

const entities = {
  BaseEntity: Entity,
  Barrier,
  Hero,
  TatteredPageHint
};

entities.create = (position, properties) => {
  const name = properties[Tile.PROPERTIES.ENTITY] || "BaseEntity";
  if (!entities[name]) {
    throw new Error(`Entity ${name} does not exist`);
  }
  const entity = new entities[name](
    properties[Tile.PROPERTIES.NAME],
    properties
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
  if (entity.isNpc()) {
    Entity.makeActor(entity);
  }
  return entity;
};

export default entities;

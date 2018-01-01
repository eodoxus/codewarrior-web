import Sprite from "../../engine/Sprite";
import Vector from "../../engine/Vector";

const HEALTH_PER_HEART = 4;
const HEALTH_POSITION = new Vector(22, 2);
const HEART_WIDTH = 10;
const HEART_PADDING = 1;
const MAGIC_POSITION = new Vector(22, 14);

export default class HeroHud {
  hero;
  sprites;

  constructor(hero) {
    this.hero = hero;
    this.isVisible = false;
    this.sprites = {
      emptyHeart: createHeart("empty"),
      halfHeart: createHeart("half"),
      quarterHeart: createHeart("quarter"),
      threeQuarterHeart: createHeart("threeQuarter"),
      wholeHeart: createHeart("whole"),
      currentMagicBar: createMagicBar("current"),
      totalMagicBar: createMagicBar("total")
    };
  }

  async init() {
    return Promise.all([
      this.sprites.emptyHeart.init(),
      this.sprites.halfHeart.init(),
      this.sprites.quarterHeart.init(),
      this.sprites.threeQuarterHeart.init(),
      this.sprites.wholeHeart.init(),
      this.sprites.currentMagicBar.init(),
      this.sprites.totalMagicBar.init()
    ]);
  }

  render() {
    this.renderHealth();
    this.renderMagic();
  }

  renderHealth() {
    const totalHearts = Math.floor(this.hero.totalHealth / HEALTH_PER_HEART);
    const wholeHearts = Math.floor(this.hero.health / HEALTH_PER_HEART);

    let iDx = 0;
    let offset = 0;

    for (iDx = 0; iDx < totalHearts; iDx++) {
      HeroHud.HEART_EMPTY.render(getHeartPosition(offset++));
    }

    offset = 0;
    for (iDx = 0; iDx < wholeHearts; iDx++) {
      HeroHud.HEART_WHOLE.render(getHeartPosition(offset++));
    }

    const partialHeart = this.hero.health % HEALTH_PER_HEART;
    if (partialHeart) {
      const position = getHeartPosition(offset++);
      switch (partialHeart) {
        case 1:
          this.sprites.quarterHeart.render(position);
          break;
        case 2:
          this.sprites.halfHeart.render(position);
          break;
        default:
          this.sprites.threeQuarterHeart.render(position);
          break;
      }
    }
  }

  renderMagic() {
    const totalSize = this.sprites.totalMagicBar.getSize();
    totalSize.width = this.hero.totalMagic;
    this.sprites.totalMagicBar.setSize(totalSize);
    this.sprites.totalMagicBar.render(MAGIC_POSITION);

    const currentSize = this.sprites.currentMagicBar.getSize();
    currentSize.width = this.hero.magic;
    this.sprites.currentMagicBar.setSize(currentSize);
    this.sprites.currentMagicBar.render(MAGIC_POSITION);
  }
}

function getHeartPosition(offset) {
  return new Vector(
    HEALTH_POSITION.x + offset * (HEART_WIDTH + HEART_PADDING),
    HEALTH_POSITION.y
  );
}

function createHeart(name) {
  return Sprite.create({
    sprite_collection: "items",
    texture: `hearts/${name}.png`
  });
}

function createMagicBar(name) {
  return Sprite.create({
    sprite_collection: "items",
    texture: `magicBars/${name}.png`
  });
}

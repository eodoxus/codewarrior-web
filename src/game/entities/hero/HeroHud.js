import Sprite from "../../engine/Sprite";
import Vector from "../../engine/Vector";

const HEALTH_PER_HEART = 4;
const HEART_WIDTH = 10;
const HEART_PADDING = 1;
const HEALTH_POSITION = new Vector(22, 2);

export default class HeroHud {
  static EMPTY_HEART = createHeart("empty");
  static HALF_HEART = createHeart("half");
  static QUARTER_HEART = createHeart("quarter");
  static THREE_QUARTER_HEART = createHeart("threeQuarter");
  static WHOLE_HEART = createHeart("whole");

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
      HeroHud.EMPTY_HEART.init(),
      HeroHud.HALF_HEART.init(),
      HeroHud.QUARTER_HEART.init(),
      HeroHud.THREE_QUARTER_HEART.init(),
      HeroHud.WHOLE_HEART.init()
    ]);
  }

  render() {
    this.renderHealth();
  }

  renderHealth() {
    const totalHearts = Math.floor(this.hero.totalHealth / HEALTH_PER_HEART);
    const wholeHearts = Math.floor(this.hero.health / HEALTH_PER_HEART);

    let iDx = 0;
    let offset = 0;

    for (iDx = 0; iDx < totalHearts; iDx++) {
      HeroHud.EMPTY_HEART.render(getHeartPosition(offset++));
    }

    offset = 0;
    for (iDx = 0; iDx < wholeHearts; iDx++) {
      HeroHud.WHOLE_HEART.render(getHeartPosition(offset++));
    }

    const partialHeart = this.hero.health % HEALTH_PER_HEART;
    if (partialHeart) {
      const position = getHeartPosition(offset++);
      switch (partialHeart) {
        case 1:
          HeroHud.QUARTER_HEART.render(position);
          break;
        case 2:
          HeroHud.HALF_HEART.render(position);
          break;
        default:
          HeroHud.THREE_QUARTER_HEART.render(position);
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

const MAX_SPELLS = 2;

export default class TatteredPage {
  static NAME = "tatteredPage";

  spells;

  constructor() {
    this.spells = [];
  }

  addSpell(spell) {
    if (this.spells.length >= MAX_SPELLS) {
      throw new Error("Tattered page can only hold 2 spells");
    }
    this.spells.push(spell);
  }

  getId() {
    return TatteredPage.NAME;
  }

  getSpell(iDx) {
    return this.spells[iDx];
  }

  removeSpell(spell) {
    const iDx = this.spells.findIndex(s => s.getId() === spell.getId());
    if (iDx > -1) {
      this.spells.splice(iDx, 1);
    }
  }
}

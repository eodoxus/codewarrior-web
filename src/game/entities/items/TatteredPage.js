const MAGIC_PER_SPELL = 36;
const MAX_SPELLS = 2;

export default class TatteredPage {
  static NAME = "tatteredPage";

  spells;

  constructor() {
    this.spells = [];
  }

  addSpell(spell) {
    if (this.spells.length < MAX_SPELLS) {
      this.spells.push(spell);
    }
  }

  getId() {
    return TatteredPage.NAME;
  }

  getSpell(iDx) {
    return this.spells[iDx];
  }

  getSpells() {
    return this.spells;
  }

  getTotalMagic() {
    return this.spells.length * MAGIC_PER_SPELL;
  }

  removeSpell(spell) {
    const iDx = this.spells.findIndex(s => s.getId() === spell.getId());
    if (iDx > -1) {
      this.spells.splice(iDx, 1);
    }
  }
}

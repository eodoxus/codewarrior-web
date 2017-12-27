export default class HeroInventory {
  static TYPE_GENERIC = "generic";
  static TYPE_SPELL = "spell";

  items;

  constructor() {
    this.items = [];
  }

  add(id, item) {
    if (!this.has(id)) {
      this.items.push(item);
    }
  }

  get(id) {
    return this.items.find(i => i.getId() === id);
  }

  getItems() {
    return this.items;
  }

  has(id) {
    return this.items.some(i => i.getId() === id);
  }

  remove(id) {
    const iDx = this.items.findIndex(i => i.getId() === id);
    if (iDx > -1) {
      this.items.splice(iDx, 1);
    }
  }
}

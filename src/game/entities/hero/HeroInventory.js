import Spell from "../items/Spell";

export default class HeroInventory {
  static TYPE_GENERIC = "generic";
  static TYPE_SPELL = "spell";
  items;

  constructor() {
    this.items = [];
  }

  add(item) {
    const isInList = this.items.some(
      i => i.getItem().getName() === item.getName()
    );
    if (!isInList) {
      this.items.push(new InventoryItem(item));
    }
  }

  getItems() {
    return this.items;
  }

  remove(name) {
    const iDx = this.items.findIndex(i => i.getItem().getName() === name);
    if (iDx > -1) {
      this.items.splice(iDx, 1);
    }
  }
}

class InventoryItem {
  item;
  type;

  constructor(item) {
    this.item = item;
    if (this.item instanceof Spell) {
      this.type = HeroInventory.TYPE_SPELL;
    } else {
      this.type = HeroInventory.TYPE_GENERIC;
    }
  }

  getItem() {
    return this.item;
  }

  isA(type) {
    return type === this.type;
  }
}

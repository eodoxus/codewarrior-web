import Time from "../../../engine/Time";

const MAGIC_REGENERATION_RATE = 512;

export default class EnemyMixin {
  static applyTo(entity) {
    entity.getMagicRegenRate = getMagicRegenRate;
    entity.setMagicRegenRate = setMagicRegenRate;
    entity.getHealth = getHealth;
    entity.setHealth = setHealth;
    entity.getMagic = getMagic;
    entity.setMagic = setMagic;
    entity.hasMagic = hasMagic;
    entity.spendMagic = spendMagic;
    entity.origUpdate = entity.update;
    entity.update = update;
    entity.updateMagic = updateMagic;

    entity.setMagicRegenRate(MAGIC_REGENERATION_RATE);
  }
}

function getHealth() {
  return this.health;
}

function setHealth(health) {
  this.health = health;
  this.totalHealth = health;
}

function getMagic() {
  return this.magic;
}

function setMagic(magic) {
  this.magic = magic;
  this.totalMagic = magic;
}

function getMagicRegenRate() {
  return this.magicRegenRate;
}

function setMagicRegenRate(rate) {
  this.magicRegenRate = rate;
}

function hasMagic() {
  return this.magic > 0;
}

function spendMagic(points) {
  this.magic -= points;
  if (this.magic <= 0) {
    this.magic = 0;
  }
}

function update() {
  this.origUpdate();
  this.updateMagic();
}

function updateMagic() {
  if (!this._magicTimer) {
    this._magicTimer = Time.timer();
  }
  if (this._magicTimer.elapsed() >= MAGIC_REGENERATION_RATE) {
    this.magic += 1;
    if (this.magic > this.totalMagic) {
      this.magic = this.totalMagic;
    }
    this._magicTimer.reset();
  }
}

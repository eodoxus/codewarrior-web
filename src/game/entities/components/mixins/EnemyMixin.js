import Time from "../../../engine/Time";
import Audio from "../../../engine/Audio";

const HEART_SOUND_DURATION = 120;
const MAGIC_REGENERATION_RATE = 512;

export default class EnemyMixin {
  static applyTo(entity) {
    entity.getMagicRegenRate = getMagicRegenRate;
    entity.setMagicRegenRate = setMagicRegenRate;
    entity.getHealth = getHealth;
    entity.setHealth = setHealth;
    entity.heal = heal;
    entity.takeDamage = takeDamage;
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

function heal(points) {
  if (this.isHero()) {
    playHeal(points);
  }
  this.health += points;
  if (this.health > this.totalHealth) {
    this.health = this.totalHealth;
  }
}

function takeDamage(dmg) {
  if (this.isHero()) {
    Audio.play(Audio.EFFECTS.TAKE_DAMAGE);
  }
  this.health -= dmg;
  if (this.health <= 0) {
    this.kill();
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

function playHeal(points) {
  const totalHearts = Math.ceil(points / 4);
  let count = 1;
  Audio.play(Audio.EFFECTS.HEART);
  let interval = setInterval(() => {
    count++;
    Audio.play(Audio.EFFECTS.HEART);
    if (count >= totalHearts) {
      clearInterval(interval);
    }
  }, HEART_SOUND_DURATION);
}

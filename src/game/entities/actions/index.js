import Action from "./Action";
import GiveChargeSpell from "./GiveChargeSpell";
import GiveTatteredPage from "./GiveTatteredPageAction";

const actions = {
  BaseAction: Action,
  GiveChargeSpell,
  GiveTatteredPage
};

actions.create = (entity, name) => {
  if (!actions[name]) {
    throw new Error(`Action ${name} does not exist`);
  }
  return new actions[name](entity);
};

export default actions;

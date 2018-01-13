import Action from "./Action";
import GiveTatteredPage from "./GiveTatteredPageAction";

const actions = {
  BaseAction: Action,
  GiveTatteredPage
};

actions.create = (entity, name) => {
  if (!actions[name]) {
    throw new Error(`Action ${name} does not exist`);
  }
  return new actions[name](entity);
};

export default actions;

const state = {
  scenes: {}
};

export default class GameState {
  static getSceneState(sceneName) {
    return state.scenes[sceneName];
  }

  static restoreBehavior(behavior, state) {
    const dialog = behavior.getDialog && behavior.getDialog();
    if (dialog) {
      dialog.setState(state.dialog);
    }
  }

  static restoreEntity(entity, state) {
    if (!state) {
      return;
    }

    Object.keys(state).forEach(key => {
      if (key === "behavior") {
        GameState.restoreBehavior(entity.getBehavior(), state.behavior);
      }
    });
  }

  static restoreHero(hero) {}

  static restoreScene(scene) {
    const sceneState = state.scenes[scene.getName()];
    if (!sceneState) {
      return;
    }

    Object.keys(sceneState).forEach(key => {
      if (key === "entities") {
        sceneState.entities.forEach(entityState => {
          scene.getEntities().forEach(entity => {
            if (entityState.id === entity.getId()) {
              GameState.restoreEntity(entity, entityState);
            }
          });
        });
      }
    });
  }

  static storeHero() {}

  static storeScene(scene) {
    const sceneState = {};
    const entities = [];
    scene.getEntities().forEach(entity => {
      if (!entity.isHero()) {
        const entityState = GameState.getEntityState(entity);
        if (entityState) {
          entityState.id = entity.getId();
          entities.push(entityState);
        }
      }
    });
    if (entities.length) {
      sceneState.entities = entities;
    }
    state.scenes[scene.getName()] = sceneState;
  }

  static getEntityState(entity) {
    const behaviorState = GameState.getBehaviorState(entity.getBehavior());
    if (behaviorState) {
      return {
        behavior: behaviorState
      };
    }
  }

  static getBehaviorState(behavior) {
    const dialog = behavior.getDialog && behavior.getDialog();
    if (dialog) {
      return {
        dialog: dialog.getState()
      };
    }
  }
}

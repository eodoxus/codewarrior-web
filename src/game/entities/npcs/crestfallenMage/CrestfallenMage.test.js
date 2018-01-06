import Dialog from "../../../engine/Dialog";
import entities from "../../../entities";
import GameEvent from "../../../engine/GameEvent";
import GameState from "../../../GameState";
import PacingMovement from "../../components/movements/PacingMovement";
import Sprite from "../../../engine/Sprite";
import StoppedState from "../behaviors/states/StoppedState";
import { MageTalkingState } from "./CrestfallenMage";
import Time from "../../../engine/Time";
import Vector from "../../../engine/Vector";
import WalkingState from "../behaviors/states/WalkingState";

import plist from "../../../../../public/animations/npcs.json";
import dialog from "../../../../../public/dialog.json";

let mage;

function makePositive(velocity) {
  if (velocity.x < 0) {
    velocity.x *= -1;
  }
  return velocity;
}

function updateNumTimes(num) {
  for (let i = 0; i < num; i++) {
    mage.update();
  }
}

let origFrameStep = Time.FRAME_STEP_SEC;
beforeAll(async () => {
  Time.FRAME_STEP_SEC = 1;
  fetch.mockResponse(JSON.stringify(dialog));
  Dialog.load();
});

afterAll(() => {
  Time.FRAME_STEP_SEC = origFrameStep;
});

beforeEach(async () => {
  fetch.mockResponse(JSON.stringify(plist));
  mage = entities.create(new Vector(0, 0), {
    animation: "npcs",
    behavior: "CrestfallenMage",
    dialog: "CrestfallenHome.CrestfallenMage",
    endX: "40",
    endY: "0",
    fps: "10",
    graphics: "AnimatedSprite",
    movement: "Pacing",
    npc: "true",
    width: "24",
    height: "32",
    velocityX: "10",
    velocityY: "0"
  });

  mage.getSprite().loadAnimations(plist);
  mage.getBehavior().start();
});

describe("CrestfallenMage", () => {
  describe("construction", () => {
    it("should not crash when instantiated", () => {
      expect(mage).toBeDefined();
    });
  });

  describe("update", () => {
    it("should make mage walk left and right, constrained to 40px range", () => {
      // Walk right 30px;
      mage.setVelocity(makePositive(mage.getVelocity()));
      updateNumTimes(3);
      expect(mage.getPosition().x).toBe(30);
      // Walk right more constrained to 40px;
      mage.update();
      expect(mage.getPosition().x).toBe(40);
      // Turn around and walk left 10px
      mage.update();
      expect(mage.getPosition().x).toBe(30);
      // Walk left 10 more px
      mage.update();
      expect(mage.getPosition().x).toBe(20);
      // Walk left more constrained to 0px;
      updateNumTimes(2);
      expect(mage.getPosition().x).toBe(0);
      // Turn around and walk right 10px
      mage.update();
      expect(mage.getPosition().x).toBe(10);
    });
  });

  describe("stopped state", () => {
    it("restarts movement after a time between 1-5 seconds", () => {
      mage.stop();
      let state = mage.getBehavior().getState();
      expect(state instanceof StoppedState).toBe(true);
      expect(state.restartTime).toBeGreaterThanOrEqual(1 * Time.SECOND);
      expect(state.restartTime).toBeLessThanOrEqual(5 * Time.SECOND);
      state.timer.elapsed = jest.fn();

      state.timer.elapsed.mockReturnValue(999);
      mage.update();
      state = mage.getBehavior().getState();
      expect(state instanceof StoppedState).toBe(true);

      state.timer.elapsed.mockReturnValue(state.restartTime + 1);
      mage.update();
      state = mage.getBehavior().getState();
      expect(state instanceof WalkingState).toBe(true);
    });
  });

  describe("talking state", () => {
    let entity;

    beforeEach(() => {
      entity = entities.create(new Vector(0, 0), {
        name: "entity"
      });
      entity.getGraphics().setSprite(new Sprite());
      mage.getBehavior().setIntent(GameEvent.talk(mage));
      mage.stop();
      mage.handleEvent(GameEvent.collision(entity));
    });

    it("starts talking on a collision event with an entity if it has TALK intent", () => {
      const state = mage.getBehavior().getState();
      expect(state instanceof MageTalkingState).toBe(true);
    });

    it("goes back to stopped after 2 seconds when not intersecting entity", () => {
      let state = mage.getBehavior().getState();
      state.timer.elapsed = jest.fn();

      state.timer.elapsed.mockReturnValue(999);
      mage.update();
      state = mage.getBehavior().getState();
      expect(state instanceof MageTalkingState).toBe(true);

      state.timer.elapsed.mockReturnValue(2001);
      mage.update();
      state = mage.getBehavior().getState();
      expect(state instanceof MageTalkingState).toBe(true);

      entity.setPosition(new Vector(30, 0));
      state.timer.elapsed.mockReturnValue(999);
      mage.update();
      state = mage.getBehavior().getState();
      expect(state instanceof MageTalkingState).toBe(true);

      state.timer.elapsed.mockReturnValue(2001);
      mage.update();
      state = mage.getBehavior().getState();
      expect(state instanceof StoppedState).toBe(true);
    });

    it("cycles through talking states as entity interacts with it", () => {
      const mageDialog = dialog["CrestfallenHome.CrestfallenMage"];
      let dialogStateExpectation = 0;

      GameEvent.on(GameEvent.DIALOG, dialog => {
        expect(dialog).toEqual(mageDialog[dialogStateExpectation]);
      });

      // Trigger dialog handler defined above. If HomeCaveScene hasn't
      // been visited yet, dialog state shouldn't advance
      mage.handleEvent(GameEvent.collision(entity));
      mage.handleEvent(GameEvent.collision(entity));

      visitHomeCaveScene();

      dialogStateExpectation = 1;
      mage.handleEvent(GameEvent.collision(entity));

      dialogStateExpectation = 2;
      mage.handleEvent(GameEvent.collision(entity));

      GameEvent.on(GameEvent.NPC_INTERACTION, event => {
        expect(event.getType()).toEqual(
          mageDialog[dialogStateExpectation].action
        );
      });
      GameEvent.fire(GameEvent.CONFIRM, {
        dialog: mageDialog[dialogStateExpectation]
      });
    });
  });

  describe("walking state", () => {});
});

function visitHomeCaveScene() {
  const mockScene = {
    getName: () => "HomeCaveScene",
    getEntities: () => []
  };
  GameState.storeScene(mockScene);
}

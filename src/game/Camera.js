import Vector from "./engine/Vector";
import Graphics from "./engine/Graphics";
import GameMenusComponent from "./menus/GameMenusComponent";

export default class Camera {
  sceneDirector;

  constructor(sceneDirector) {
    this.sceneDirector = sceneDirector;
  }

  update() {
    if (!this.sceneDirector.container) {
      return;
    }

    if (GameMenusComponent.hasOpenMenus()) {
      return;
    }

    const sceneBoundingRect = this.sceneDirector.container.getBoundingClientRect();
    const heroPosition = Vector.multiply(
      this.sceneDirector.hero.getPosition(),
      Graphics.getInverseScale()
    );
    const heroScreenPosition = new Vector(
      sceneBoundingRect.left + heroPosition.x,
      sceneBoundingRect.top + heroPosition.y
    );
    const screenCenter = new Vector(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    const distanceToScreenCenter = heroScreenPosition.distanceTo(screenCenter);
    const top = window.scrollY + distanceToScreenCenter.y;
    const left = window.scrollX + distanceToScreenCenter.x;
    if (top !== window.scrollY || left !== window.scrollX) {
      window.scroll({
        top,
        left
      });
    }
  }
}

import Vector from "./engine/Vector";
import Graphics from "./engine/Graphics";
import GameMenusComponent from "./menus/GameMenusComponent";

export default class Camera {
  sceneDirector;

  constructor(sceneDirector) {
    this.sceneDirector = sceneDirector;
  }

  update() {
    if (GameMenusComponent.hasOpenMenus()) {
      return;
    }

    const sceneBoundingRect = this.sceneDirector.container.getBoundingClientRect();
    const heroPosition = Vector.multiply(
      this.sceneDirector.hero.getPosition(),
      Graphics.getInverseScale()
    );
    const heroScreenPosition = new Vector(
      sceneBoundingRect.x + heroPosition.x,
      sceneBoundingRect.y + heroPosition.y
    );
    const screenCenter = new Vector(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    const distanceToScreenCenter = heroScreenPosition.distanceTo(screenCenter);
    window.scroll({
      top: window.scrollY + distanceToScreenCenter.y,
      left: window.scrollX + distanceToScreenCenter.x
    });
  }
}

import Url from "../../../lib/Url";
import animationData from "./animations.json";

export default {
  id: "hero",
  width: 24,
  height: 32,
  walkingVelocity: 60,
  runningVelocity: 120,
  animations: {
    image: Url.ANIMATIONS + animationData.meta.image,
    data: animationData,
    delay: 30
  }
};

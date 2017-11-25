import Url from "../../../lib/Url";
import animationData from "./animations.json";

export default {
  id: "hero",
  width: 24,
  height: 32,
  walkingVelocity: 70,
  runningVelocity: 140,
  animations: {
    image: Url.ANIMATIONS + animationData.meta.image,
    data: animationData,
    delay: 30
  }
};

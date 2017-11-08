import Url from "../../../lib/Url";
import animationData from "./animations.json";

export default {
  id: "hero",
  width: 24,
  height: 32,
  scale: 2.5,
  walkingVelocity: 120,
  runningVelocity: 240,
  animations: {
    image: Url.ANIMATIONS + animationData.meta.image,
    data: animationData,
    delay: 30
  }
};

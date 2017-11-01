import Url from "../../../lib/Url";
import animationData from "./animations.json";

export default {
  id: "hero",
  width: 24,
  height: 32,
  scale: 2.5,
  animations: {
    image: Url.ANIMATIONS + animationData.meta.image,
    data: animationData,
    speed: 50
  }
};

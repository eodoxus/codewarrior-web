import React from "react";

export default ({ animation, frame, scale }) => {
  return (
    <div
      style={{
        top: 0,
        left: 0,
        backgroundImage: `url("${animation.url}")`,
        backgroundRepeat: "no-repeat",
        backgroundPositionX: -(frame.x * scale),
        backgroundPositionY: -(frame.y * scale),
        backgroundSize: `${animation.width * scale}px`,
        width: frame.width * scale,
        height: frame.height * scale
      }}
    />
  );
};

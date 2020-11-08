import React from "react";
import styles from "./GameMovie.scss";
import Url from "../lib/Url";

export default () => {
  const videoUrl = Url.BASE + "video/Codewarrior03.mp4";
  const posterUrl = Url.BASE + "video/Codewarrior03.png";
  return (
    <div className={styles.container}>
      <h1>CodeWarrior</h1>
      <h2>Learn to code playing an RPG</h2>
      <video controls width="100%" autoPlay preload="auto" poster={posterUrl}>
        <source src={videoUrl} type="video/mp4" />
        Sorry, your browser doesn't support embedded videos.
      </video>
      <p>
        This web game doesn't work well on mobile quite yet, but here's a video.
        To play, open this site on your desktop computer.
      </p>
    </div>
  );
};

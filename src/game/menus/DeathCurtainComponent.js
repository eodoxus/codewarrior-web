import React, { Component } from "react";
import cx from "classnames";
import styles from "./DeathCurtainComponent.scss";
import Audio from "../engine/Audio";
import GameEvent from "../engine/GameEvent";

const ANIMATION_DURATION = 1500;

export default class DeathCurtainComponent extends Component {
  listener;

  constructor(props) {
    super(props);
    this.state = { isHeroDead: false, isAnimationDone: false };
  }

  async componentDidMount() {
    this.listener = GameEvent.on(GameEvent.HERO_DEATH, this.onHeroDeath);
  }

  componentWillUnmount() {
    delete this.listener;
  }

  onHeroDeath = () => {
    this.setState({ isHeroDead: true });
    setTimeout(() => {
      Audio.playEffect(Audio.EFFECTS.GAME_OVER);
      this.setState({ isAnimationDone: true });
    }, ANIMATION_DURATION);
  };

  render() {
    return (
      <div
        className={cx(
          styles.curtain,
          this.state.isHeroDead ? styles.closed : ""
        )}
      >
        <h1
          className={cx(
            styles.msg,
            this.state.isAnimationDone ? styles.visible : ""
          )}
        >
          You Died
        </h1>
      </div>
    );
  }
}

import React, { Component } from "react";
import cx from "classnames";
import styles from "./DeathCurtainComponent.scss";
import Audio from "../engine/Audio";
import GameEvent from "../engine/GameEvent";

const CURTAIN_ANIMATION_DURATION = 1500;
const DIED_TEXT_ANIMATION_DURATION = CURTAIN_ANIMATION_DURATION + 2000;

export default class DeathCurtainComponent extends Component {
  listener;

  constructor(props) {
    super(props);
    this.state = {
      isHeroDead: false,
      isAnimationDone: false,
      isSequenceOver: false
    };
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
    }, CURTAIN_ANIMATION_DURATION);
    setTimeout(() => {
      this.setState({ isSequenceOver: true });
    }, DIED_TEXT_ANIMATION_DURATION);
  };

  onTryAgainClicked = () => {
    this.setState({
      isHeroDead: false,
      isAnimationDone: false,
      isSequenceOver: false
    });
    GameEvent.fire(GameEvent.RESTART);
  };

  render() {
    const youDied = this.state.isHeroDead ? (
      <h1
        className={cx(
          styles.msg,
          this.state.isAnimationDone ? styles.visible : ""
        )}
      >
        You Died
      </h1>
    ) : (
      ""
    );
    const tryAgain = this.state.isSequenceOver ? (
      <div className={styles.tryAgain} onClick={this.onTryAgainClicked}>
        try again?
      </div>
    ) : (
      ""
    );
    return (
      <div
        className={cx(
          styles.curtain,
          this.state.isHeroDead ? styles.closed : ""
        )}
      >
        {youDied}
        {tryAgain}
      </div>
    );
  }
}

import React from "react";
import styles from "./TatteredPageComponent.scss";
import GameEvent from "../engine/GameEvent";
import MenuComponent from "./MenuComponent";
import Url from "../../lib/Url";
import TextureCache from "../engine/TextureCache";
import { Button } from "../../components/forms/controls/buttons";

export default class TatteredPageComponent extends MenuComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: `${Url.PUBLIC}/images/tattered-page.png`
    };
  }

  componentDidMount() {
    this.listeners = [
      GameEvent.on(GameEvent.OPEN_TATTERED_PAGE, this.onOpen),
      GameEvent.on(GameEvent.CLOSE_TATTERED_PAGE, this.onClose)
    ];
    TextureCache.fetch(this.state.image);
  }

  onExecuteIncantation = e => {
    GameEvent.absorbClick(e);
    const onError = e => {
      setTimeout(() => {
        GameEvent.fire(GameEvent.DIALOG, e.message);
      }, 200);
    };
    this.editor.contentWindow.execute(onError);
  };

  onOpen = () => {
    if (this.isOpen()) {
      return;
    }
    this.setState({ isOpen: true });
  };

  render() {
    if (!this.state.isOpen) {
      return "";
    }

    return (
      <div
        className={styles.container}
        style={{
          backgroundImage: `url(${this.state.image})`
        }}
      >
        <div className={styles.close + " close"} onClick={this.onClose}>
          <span>x</span>
        </div>
        <iframe
          src={Url.PUBLIC + "/tatteredPage.html"}
          title="Tattered Page"
          ref={editor => (this.editor = editor)}
        />
        <div className={styles.executeButton}>
          <Button
            onClick={this.onExecuteIncantation}
            text="Execute Incantation"
          />
        </div>
      </div>
    );
  }
}

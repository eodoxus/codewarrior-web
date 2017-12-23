import React from "react";
import cx from "classnames";
import styles from "./TatteredPageComponent.scss";
import GameEvent from "../engine/GameEvent";
import MenuComponent from "./MenuComponent";
import Url from "../../lib/Url";
import TextureCache from "../engine/TextureCache";
import SandboxedEditor from "./SandboxedEditorComponent";

const DEFAULT_CODE = `// Hint: type alt+space to see what you can do
var position = hero.pickTarget();
hero.jump();`;

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

  onOpen = api => {
    if (this.isOpen()) {
      return;
    }
    this.setState({ isOpen: true, api });
  };

  render() {
    if (!this.state.isOpen) {
      return "";
    }

    return (
      <div
        className={cx(styles.container, "tattered-page")}
        style={{
          backgroundImage: `url(${this.state.image})`
        }}
      >
        <div
          className={styles.close + " close"}
          onClick={() => GameEvent.fire(GameEvent.CLOSE_TATTERED_PAGE)}
        >
          <span>x</span>
        </div>
        <div className={styles.sandbox}>
          <SandboxedEditor code={DEFAULT_CODE} api={this.state.api} />
        </div>
      </div>
    );
  }
}

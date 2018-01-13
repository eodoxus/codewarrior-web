import React from "react";
import cx from "classnames";
import styles from "./TatteredPageComponent.scss";
import GameEvent from "../engine/GameEvent";
import GameState from "../GameState";
import MenuComponent from "./MenuComponent";
import Url from "../../lib/Url";
import TextureCache from "../engine/TextureCache";
import SandboxedEditor from "./SandboxedEditorComponent";
import Audio from "../engine/Audio";

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

  onClose = e => {
    if (!this.isOpen()) {
      return;
    }
    GameState.setIsReading(false);
    Audio.play(Audio.EFFECTS.CLOSE_BOOK);
    GameEvent.fire(GameEvent.CLOSE_DIALOG);
    this.spell.setCode(this.editor.getCode());
    this.setState({ isOpen: false });
  };

  onOpen = spell => {
    this.spell = spell;
    if (this.isOpen()) {
      return;
    }
    GameState.setIsReading(true);
    Audio.play(Audio.EFFECTS.OPEN_BOOK);
    GameEvent.fire(GameEvent.CLOSE_HERO_MENU);
    this.setState({
      isOpen: true,
      spell
    });
  };

  onSpellClick = spell => {
    this.setState({ spell });
    const code = spell.getCode();
    this.editor.setCode(code);
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
        onClick={GameEvent.absorbClick}
      >
        <div
          className={styles.close + " close"}
          onClick={() => GameEvent.fire(GameEvent.CLOSE_TATTERED_PAGE)}
        >
          <span>x</span>
        </div>
        <div className={styles.buttons}>{this.renderButtons()}</div>
        <div className={styles.sandbox}>
          <SandboxedEditor
            code={this.state.spell.getCode()}
            api={this.state.spell.getApi()}
            ref={editor => (this.editor = editor)}
          />
        </div>
      </div>
    );
  }

  renderButtons() {
    const tatteredPage = GameState.getHero().getSpellEditor();
    return tatteredPage.getSpells().map((spell, iDx) => {
      const isActive = this.state.spell.getScript().id === spell.getScript().id;
      return (
        <div
          className={styles.spellButton}
          onClick={() => this.onSpellClick(spell)}
          key={iDx}
        >
          <span>{iDx + 1}</span>
          <div
            className={cx(
              styles.spellButtonOverlay,
              isActive ? styles.activeSpell : ""
            )}
          />
        </div>
      );
    });
  }
}

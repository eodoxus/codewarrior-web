import React, { Component } from "react";
import styles from "./SandboxedEditorComponent.scss";
import cx from "classnames";
import CodeMirror from "react-codemirror";
import GameEvent from "../engine/GameEvent";
import { Button } from "../../components/forms/controls/buttons/index";
import Indicators from "../../components/indicators";
import SandboxedEditorHint from "./SandboxedEditorHint";
import Spell from "../entities/items/Spell";

require("codemirror/mode/javascript/javascript");
require("codemirror/addon/hint/show-hint");
require("codemirror/lib/codemirror.css");
require("codemirror/addon/hint/show-hint.css");

export default class SandboxedEditorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.code
    };
  }

  componentDidMount() {
    // Initialize code hints. Must do it on next cycle so refs are resolved
    // and available.
    setTimeout(() => this.initCodeHints());
  }

  getCode() {
    return this.state.code;
  }

  initCodeHints() {
    const hint = new SandboxedEditorHint(
      this.codemirror.getCodeMirrorInstance()
    );
    const spell = new Spell("hints", this.props.api, "");
    const interpreter = spell.createInterpreter();
    hint.init(this.props.api, interpreter);
  }

  onClick = e => {
    if (this.state.isLoading) {
      GameEvent.absorbClick(e);
    }
  };

  onExecute = async e => {
    GameEvent.absorbClick(e);
    this.setState({ isLoading: true });
    try {
      const spell = new Spell("edit", this.props.api, this.state.code);
      await spell.cast();
      this.setState({ isLoading: false });
      GameEvent.fire(GameEvent.EDITOR_SUCCESS);
    } catch (e) {
      this.setState({ isLoading: false });
      GameEvent.fire(GameEvent.EDITOR_FAILURE);
    }
  };

  onUpdateCode = code => {
    this.setState({ code });
  };

  render() {
    const config = {
      extraKeys: { "Alt-Space": "autocomplete" },
      lineWrapping: true,
      mode: "javascript",
      tabSize: 2
    };

    const loader = this.state.isLoading ? <Indicators.Loader /> : "";
    const button = !this.state.isLoading ? (
      <div className={styles.executeButton}>
        <Button onClick={this.onExecute} text="Execute Incantation" />
      </div>
    ) : (
      ""
    );

    return (
      <div
        className={cx(styles.container, this.state.isLoading ? "loading" : "")}
        onClick={this.onClick}
      >
        {loader}
        <CodeMirror
          value={this.state.code}
          onChange={this.onUpdateCode}
          options={config}
          ref={codemirror => {
            this.codemirror = codemirror;
          }}
        />
        {button}
      </div>
    );
  }
}

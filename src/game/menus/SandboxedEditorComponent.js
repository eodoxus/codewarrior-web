import React, { Component } from "react";
import styles from "./SandboxedEditorComponent.scss";
import CodeMirror from "react-codemirror";
import GameEvent from "../engine/GameEvent";
import Interpreter from "js-interpreter";
import { Button } from "../../components/forms/controls/buttons/index";

require("codemirror/mode/javascript/javascript");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/javascript-hint");
require("codemirror/lib/codemirror.css");
require("codemirror/addon/hint/show-hint.css");

let output = "";

export default class SandboxedEditorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.code
    };
  }

  onExecute = async e => {
    GameEvent.absorbClick(e);
    try {
      output = "";
      const apiSandbox = sandboxApi(this.props.api);
      const interpreter = new Interpreter(this.state.code, apiSandbox);
      await executeCode(interpreter);
      GameEvent.fire(GameEvent.DIALOG, output);
      GameEvent.fire(GameEvent.EDITOR_SUCCESS);
    } catch (e) {
      GameEvent.fire(GameEvent.EDITOR_FAILURE);
      GameEvent.fireAfterClick(GameEvent.DIALOG, {
        error: true,
        msg: e.message
      });
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

    return (
      <div className={styles.container} onClick={GameEvent.absorbClick}>
        <CodeMirror
          value={this.state.code}
          onChange={this.onUpdateCode}
          options={config}
        />
        <div className={styles.executeButton}>
          <Button onClick={this.onExecute} text="Execute Incantation" />
        </div>
      </div>
    );
  }
}

function sandboxApi(api) {
  return (interpreter, scope) => {
    Object.keys(api).forEach(objName => {
      const obj = api[objName];
      const apiObj = interpreter.createObject(Interpreter.OBJECT);
      interpreter.setProperty(scope, objName, apiObj);
      obj.getFunctions().forEach(functionName => {
        const wrapper = (...pseudoArgs) => {
          let nativeArgs = [];
          for (var i = 0; i < pseudoArgs.length; i++) {
            nativeArgs[i] = interpreter.pseudoToNative(pseudoArgs[i]);
          }
          return interpreter.nativeToPseudo(obj[functionName](...nativeArgs));
        };
        interpreter.setProperty(
          apiObj,
          functionName,
          interpreter.createNativeFunction(wrapper),
          Interpreter.NONENUMERABLE_DESCRIPTOR
        );
      });
    });
    interpreter.setProperty(
      scope,
      "log",
      interpreter.createNativeFunction((...pseudoArgs) => {
        let nativeArgs = [];
        for (var i = 0; i < pseudoArgs.length; i++) {
          nativeArgs[i] = JSON.stringify(
            interpreter.pseudoToNative(pseudoArgs[i])
          );
        }
        if (output) {
          output += "\n";
        }
        output += nativeArgs.join(" ");
      })
    );
  };
}

function executeCode(interpreter) {
  return new Promise((resolve, reject) => {
    (async function step() {
      try {
        await interpreter.run();
        resolve();
      } catch (e) {
        reject(e);
      }
    })();
  });
}

import React, { Component } from "react";
import styles from "./SandboxedEditorComponent.scss";
import cx from "classnames";
import CodeMirror from "react-codemirror";
import GameEvent from "../engine/GameEvent";
import Interpreter from "js-interpreter";
import { Button } from "../../components/forms/controls/buttons/index";
import Indicators from "../../components/indicators";
import SandboxedEditorHint from "./SandboxedEditorHint";

require("codemirror/mode/javascript/javascript");
require("codemirror/addon/hint/show-hint");
require("codemirror/lib/codemirror.css");
require("codemirror/addon/hint/show-hint.css");

const MAX_EXECUTION_STEPS = 9999;
const MEMORY_CHECK_INTERVAL = 100;
const MAX_MEMORY = 1000000;

let output = "";

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

  createInterpreter(code) {
    const apiSandbox = sandboxApi(this.props.api);
    return new Interpreter(code, apiSandbox);
  }

  initCodeHints() {
    const hint = new SandboxedEditorHint(
      this.codemirror.getCodeMirrorInstance()
    );
    const interpreter = this.createInterpreter("");
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
      output = "";
      const interpreter = this.createInterpreter(this.state.code);
      await executeCode(interpreter);
      this.setState({ isLoading: false });
      GameEvent.fire(GameEvent.DIALOG, output);
      GameEvent.fire(GameEvent.EDITOR_SUCCESS);
    } catch (e) {
      this.setState({ isLoading: false });
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
    let numSteps = 0;
    (function step() {
      try {
        if (numSteps++ > MAX_EXECUTION_STEPS) {
          throw new Error("Infinite loop detected, incantation will halt");
        }
        if (numSteps % MEMORY_CHECK_INTERVAL === 0) {
          limitMemory(interpreter);
        }
        if (interpreter.step()) {
          setTimeout(step);
        } else {
          resolve();
        }
      } catch (e) {
        reject(e);
      }
    })();
  });
}

function limitMemory(interpreter) {
  const json = serialize(interpreter);
  if (json.length > MAX_MEMORY) {
    throw new Error("The incantation has grown too large, halting");
  }
}

function serialize(interpreter) {
  let cache = [];
  const serialized = JSON.stringify(interpreter, function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null;
  return serialized;
}

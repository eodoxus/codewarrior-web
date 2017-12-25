import Interpreter from "js-interpreter";
import GameEvent from "../../engine/GameEvent";

const MAX_EXECUTION_STEPS = 9999;
const MEMORY_CHECK_INTERVAL = 100;
const MAX_MEMORY = 1000000;

export default class Spell {
  static results = "";

  api;
  code;

  constructor(name, api, code) {
    this.name = name;
    this.api = api;
    this.code = code;
  }

  async cast() {
    Spell.results = "";
    try {
      const interpreter = this.createInterpreter();
      await executeCode(interpreter);
      GameEvent.fire(GameEvent.DIALOG, Spell.results);
    } catch (e) {
      GameEvent.fireAfterClick(GameEvent.DIALOG, {
        error: true,
        msg: e.message
      });
      throw new Error("Spell cast failure");
    }
  }

  createInterpreter() {
    const apiSandbox = sandboxApi(this.api);
    return new Interpreter(this.code, apiSandbox);
  }

  getApi() {
    return this.api;
  }

  getCode() {
    return this.code;
  }

  setCode(code) {
    this.code = code;
  }

  getName() {
    return this.name;
  }

  edit() {
    GameEvent.fire(GameEvent.OPEN_TATTERED_PAGE, this);
  }

  save() {
    GameEvent.fire(GameEvent.CLOSE_TATTERED_PAGE, this);
  }

  onDoneEditing(callback) {
    this.listener = GameEvent.on(GameEvent.CLOSE_TATTERED_PAGE, () => {
      callback();
      this.listener.remove();
      delete this.listener;
    });
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
        if (Spell.results) {
          Spell.results += "\n";
        }
        Spell.results += nativeArgs.join(" ");
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

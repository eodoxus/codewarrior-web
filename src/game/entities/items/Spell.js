import GameEvent from "../../engine/GameEvent";
import GameScriptModel from "../../../data/GameScriptModel";
import GameState from "../../GameState";
import HeroBehavior from "../hero/HeroBehavior";
import Interpreter from "js-interpreter";

const MAX_EXECUTION_STEPS = 9999;
const MAX_MEMORY = 1000000;
const MAX_STACK_SIZE = 99;
const SANITY_CHECK_INTERVAL = 100;

export default class Spell {
  static results = "";
  static log(...args) {
    if (Spell.results) {
      Spell.results += "\n";
    }
    Spell.results += args.join(" ");
  }

  script;

  constructor(code = "") {
    this.script = new GameScriptModel({
      data: code
    });
  }

  async cast() {
    Spell.results = "";
    try {
      const interpreter = this.createInterpreter(this.getApi());
      await executeCode(interpreter);
      HeroBehavior.isReading()
        ? GameEvent.fireAfterClick(GameEvent.DIALOG, Spell.results)
        : GameEvent.fire(GameEvent.SPELL_CAST, this);
    } catch (e) {
      GameEvent.fireAfterClick(GameEvent.DIALOG, {
        error: true,
        msg: Spell.results + "\n" + e.message
      });
      throw new Error("Spell cast failure");
    }
  }

  createInterpreter(api) {
    const apiSandbox = sandboxApi(api);
    return new Interpreter(this.getCode(), apiSandbox);
  }

  getApi() {
    return GameState.getSceneApi();
  }

  getCode() {
    return this.script.data;
  }

  setCode(code) {
    this.script.data = code;
  }

  setScript(script) {
    this.script = script;
  }

  edit() {
    GameEvent.fire(GameEvent.OPEN_TATTERED_PAGE, this);
    this.onDoneEditing(this.save);
  }

  save = async () => {
    const gameSave = await GameState.getGameSave();
    this.script.game_save_id = gameSave.id;
    return this.script.save();
  };

  onDoneEditing(callback) {
    let listener = GameEvent.on(GameEvent.CLOSE_TATTERED_PAGE, () => {
      callback();
      listener.remove();
      listener = null;
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
        if (functionName[0] === "~") {
          functionName = functionName.substr(1);
          wrapAsyncFn(interpreter, apiObj, obj, functionName);
        } else {
          wrapFn(interpreter, apiObj, obj, functionName);
        }
      });
    });
    addLogFn(interpreter, scope);
  };
}

function wrapFn(interpreter, scope, obj, functionName) {
  const wrapper = (...pseudoArgs) => {
    const nativeArgs = pseudoToNativeArgs(interpreter, pseudoArgs);
    return interpreter.nativeToPseudo(obj[functionName](...nativeArgs));
  };
  interpreter.setProperty(
    scope,
    functionName,
    interpreter.createNativeFunction(wrapper),
    Interpreter.NONENUMERABLE_DESCRIPTOR
  );
}

function wrapAsyncFn(interpreter, scope, obj, functionName) {
  const wrapper = (...pseudoArgs) => {
    const callback = pseudoArgs.pop();
    const nativeArgs = pseudoToNativeArgs(interpreter, pseudoArgs);
    nativeArgs.push((...args) => {
      callback(interpreter.nativeToPseudo(...args));
    });
    obj[functionName](...nativeArgs);
  };
  interpreter.setProperty(
    scope,
    functionName,
    interpreter.createAsyncFunction(wrapper),
    Interpreter.NONENUMERABLE_DESCRIPTOR
  );
}

function pseudoToNativeArgs(interpreter, pseudoArgs) {
  const nativeArgs = [];
  for (var i = 0; i < pseudoArgs.length; i++) {
    nativeArgs[i] = interpreter.pseudoToNative(pseudoArgs[i]);
  }
  return nativeArgs;
}

function addLogFn(interpreter, scope) {
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
      console.log(nativeArgs);
      Spell.log(nativeArgs);
    })
  );
}

function executeCode(interpreter) {
  return new Promise((resolve, reject) => {
    let numSteps = 0;
    (function step() {
      try {
        executionSanityChecks(interpreter, numSteps++);
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

function executionSanityChecks(interpreter, numSteps) {
  if (numSteps % SANITY_CHECK_INTERVAL === 0) {
    limitMemory(interpreter);
    limitRunTime(numSteps);
    limitStackSize(interpreter);
  }
}

function limitMemory(interpreter) {
  const json = serialize(interpreter);
  if (json.length > MAX_MEMORY) {
    throw new Error("The incantation has grown too large, halting");
  }
}

function limitRunTime(numSteps) {
  if (numSteps > MAX_EXECUTION_STEPS) {
    throw new Error("It's taking too long, incantation will halt");
  }
}

function limitStackSize(interpreter) {
  const stackSize = interpreter.stateStack.length;
  if (stackSize > MAX_STACK_SIZE) {
    throw new Error("Infinite recursion detected, halting");
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

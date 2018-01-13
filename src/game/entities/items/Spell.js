import GameEvent from "../../engine/GameEvent";
import GameScriptModel from "../../../data/GameScriptModel";
import GameState from "../../GameState";
import Interpreter from "js-interpreter";
import Audio from "../../engine/Audio";

const MAX_EXECUTION_STEPS = 9999;
const MAX_MEMORY = 1000000;
const MAX_STACK_SIZE = 99;
const SANITY_CHECK_INTERVAL = 100;
const OUT_OF_MAGIC = "Out of magic";

export default class Spell {
  static _log = "";

  static getLog() {
    return Spell._log;
  }

  static log(...args) {
    if (Spell._log) {
      Spell._log += "\n";
    }
    Spell._log += args.join(" ");
  }

  static setLog(log) {
    Spell._log = log;
  }

  script;
  restults;

  constructor(code = "") {
    this.script = new GameScriptModel({
      data: code
    });
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

  getCost() {
    return this.cost;
  }

  getScript() {
    return this.script;
  }

  setScript(script) {
    this.script = script;
  }

  isMockMode() {
    return GameState.getHero()
      .getBehavior()
      .isReading();
  }

  async cast() {
    Spell.setLog("");
    this.cost = 0;
    try {
      const interpreter = this.createInterpreter(this.getApi());
      await executeCode(interpreter);
      if (this.isMockMode()) {
        return GameEvent.fireAfterClick(GameEvent.DIALOG, Spell.getLog());
      }
      GameEvent.fire(GameEvent.SPELL_CAST, this);
    } catch (e) {
      if (e.message === OUT_OF_MAGIC) {
        return;
      }
      Spell.log(e.message);
      GameEvent.fireAfterClick(GameEvent.DIALOG, {
        error: true,
        msg: Spell.getLog()
      });
      throw new Error("Spell cast failure");
    }
  }

  createInterpreter(api) {
    const apiSandbox = this.sandboxApi(api);
    return new Interpreter(this.getCode(), apiSandbox);
  }

  sandboxApi(api) {
    return (interpreter, scope) => {
      Object.keys(api).forEach(objName => {
        const obj = api[objName];
        const apiObj = interpreter.createObject(Interpreter.OBJECT);
        interpreter.setProperty(scope, objName, apiObj);
        obj.getFunctions().forEach(functionName => {
          if (functionName[0] === "~") {
            functionName = functionName.substr(1);
            this.wrapAsyncFn(interpreter, apiObj, obj, functionName);
          } else {
            this.wrapFn(interpreter, apiObj, obj, functionName);
          }
        });
      });
      this.addLogFn(interpreter, scope);
    };
  }

  wrapFn(interpreter, scope, obj, functionName) {
    const wrapper = (...pseudoArgs) => {
      const nativeArgs = pseudoToNativeArgs(interpreter, pseudoArgs);
      this.accumulateMagicCost(obj, functionName);
      return interpreter.nativeToPseudo(obj[functionName](...nativeArgs));
    };
    interpreter.setProperty(
      scope,
      functionName,
      interpreter.createNativeFunction(wrapper),
      Interpreter.NONENUMERABLE_DESCRIPTOR
    );
  }

  wrapAsyncFn(interpreter, scope, obj, functionName) {
    const wrapper = (...pseudoArgs) => {
      const callback = pseudoArgs.pop();
      const nativeArgs = pseudoToNativeArgs(interpreter, pseudoArgs);
      nativeArgs.push((...args) => {
        callback(interpreter.nativeToPseudo(...args));
      });
      this.accumulateMagicCost(obj, functionName);
      obj[functionName](...nativeArgs);
    };
    interpreter.setProperty(
      scope,
      functionName,
      interpreter.createAsyncFunction(wrapper),
      Interpreter.NONENUMERABLE_DESCRIPTOR
    );
  }

  accumulateMagicCost(obj, functionName) {
    if (this.isMockMode()) {
      return;
    }
    this.cost += obj.getCost(functionName);
    if (GameState.getHero().magic < this.cost) {
      Audio.play(Audio.EFFECTS.OUT_OF_MAGIC);
      throw new Error(OUT_OF_MAGIC);
    }
  }

  addLogFn(interpreter, scope) {
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
        this.log(nativeArgs);
      })
    );
  }

  edit() {
    GameEvent.fire(GameEvent.OPEN_TATTERED_PAGE, this);
    this.onDoneEditing(this.save);
  }

  onDoneEditing(callback) {
    let listener = GameEvent.on(GameEvent.CLOSE_TATTERED_PAGE, () => {
      callback();
      listener.remove();
      listener = null;
    });
  }

  save = async () => {
    const gameSave = await GameState.getGameSave();
    this.script.game_save_id = gameSave.id;
    return this.script.save();
  };
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

function pseudoToNativeArgs(interpreter, pseudoArgs) {
  const nativeArgs = [];
  for (var i = 0; i < pseudoArgs.length; i++) {
    nativeArgs[i] = interpreter.pseudoToNative(pseudoArgs[i]);
  }
  return nativeArgs;
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

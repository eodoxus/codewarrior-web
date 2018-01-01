const JAVASCRIPT_KEYWORDS = ("break case catch continue debugger default delete do else false finally for function " +
  "if in instanceof new null return switch throw true try typeof var void while with"
).split(" ");
const STRING_KEYWORDS = ("charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight " +
  "toUpperCase toLowerCase split concat match replace search"
).split(" ");
const ARRAY_KEYWORDS = ("length concat join splice push pop shift unshift slice reverse sort indexOf " +
  "lastIndexOf every some filter forEach map reduce reduceRight "
).split(" ");
const FUNCTION_KEYWOARDS = "prototype apply call bind".split(" ");

export default class SandboxedEditorHint {
  codemirror;
  constructor(codemirror) {
    this.codemirror = codemirror;
  }

  init(api, interpreter) {
    const apiScope = parseScope(api);
    const interpreterScope = parseScope(interpreter.global.properties);
    const options = {
      globalScope: Object.assign({}, apiScope, interpreterScope)
    };
    this.codemirror.registerHelper(
      "hint",
      "javascript",
      (editor, innerOptions) => {
        Object.assign(innerOptions, options);
        const keywords = Object.keys(api).concat(JAVASCRIPT_KEYWORDS);
        const getToken = (e, cur) => e.getTokenAt(cur);
        return sandboxHint(
          editor,
          keywords,
          getToken,
          innerOptions,
          this.codemirror
        );
      }
    );
  }
}

function parseScope(obj) {
  const scope = {};
  if (obj.functions) {
    obj.getFunctions().forEach(key => {
      scope[key] = "";
    });
  } else {
    Object.keys(obj).forEach(key => {
      const node = obj[key];
      if (key === "window" || key === "self") {
        return;
      }
      if (!node) {
        return;
      }
      if (node.functions) {
        scope[key] = parseScope(node);
        return;
      }
      if (node.type && node.type === "Program") {
        return;
      }
      if (key.endsWith("_")) {
        return;
      }
      if (node.properties) {
        scope[key] = parseScope(node.properties);
        return;
      }
      scope[key] = "";
    });
  }
  return scope;
}

/**
 * This section plagiarized from javascript-hint.js:
 * https://github.com/codemirror/CodeMirror/blob/master/addon/hint/javascript-hint.js
 */
function sandboxHint(editor, keywords, getToken, options, CodeMirror) {
  const Pos = CodeMirror.Pos;
  // Find the token at the cursor
  const cur = editor.getCursor();
  let token = getToken(editor, cur);
  if (/\b(?:string|comment)\b/.test(token.type)) return;
  token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;

  // If it's not a 'word-style' token, ignore the token.
  if (!/^[\w$_]*$/.test(token.string)) {
    token = {
      start: cur.ch,
      end: cur.ch,
      string: "",
      state: token.state,
      type: token.string === "." ? "property" : null
    };
  } else if (token.end > cur.ch) {
    token.end = cur.ch;
    token.string = token.string.slice(0, cur.ch - token.start);
  }

  let tprop = token;
  const context = [];
  // If it is a property, find out what it is a property of.
  while (tprop.type === "property") {
    tprop = getToken(editor, Pos(cur.line, tprop.start));
    if (tprop.string !== ".") return;
    tprop = getToken(editor, Pos(cur.line, tprop.start));
    context.push(tprop);
  }
  return {
    list: getCompletions(token, context, keywords, options),
    from: Pos(cur.line, token.start),
    to: Pos(cur.line, token.end)
  };
}

function getCompletions(token, context, keywords, options) {
  var found = [],
    start = token.string,
    global = (options && options.globalScope) || window;

  function maybeAdd(str) {
    if (str.lastIndexOf(start, 0) === 0 && !found.includes(str))
      found.push(str);
  }

  function gatherCompletions(obj) {
    if (typeof obj === "string")
      STRING_KEYWORDS.forEach(keyword => maybeAdd(keyword));
    else if (obj instanceof Array)
      ARRAY_KEYWORDS.forEach(keyword => maybeAdd(keyword));
    else if (obj instanceof Function)
      FUNCTION_KEYWOARDS.forEach(keyword => maybeAdd(keyword));
    Object.keys(obj).forEach(key => maybeAdd(key));
  }

  if (context && context.length) {
    // If this is a property, see if it belongs to some object we can
    // find in the current environment.
    var obj = context.pop(),
      base;
    if (obj.type && obj.type.indexOf("variable") === 0) {
      if (options && options.additionalContext)
        base = options.additionalContext[obj.string];
      if (!options || options.useGlobalScope !== false)
        base = base || global[obj.string];
    } else if (obj.type === "string") {
      base = "";
    } else if (obj.type === "atom") {
      base = 1;
    } else if (obj.type === "function") {
      if (
        global.jQuery !== null &&
        (obj.string === "$" || obj.string === "jQuery") &&
        typeof global.jQuery === "function"
      )
        base = global.jQuery();
      else if (
        global._ !== null &&
        obj.string === "_" &&
        typeof global._ === "function"
      )
        base = global._();
    }
    while (base !== null && context.length) base = base[context.pop().string];
    if (base !== null) gatherCompletions(base);
  } else {
    // If not, just look in the global object and any local scope
    // (reading into JS mode internals to get at the local and global variables)
    let v;
    for (v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
    for (v = token.state.globalVars; v; v = v.next) maybeAdd(v.name);
    if (!options || options.useGlobalScope !== false) gatherCompletions(global);
    keywords.forEach(keyword => maybeAdd(keyword));
  }
  return found;
}

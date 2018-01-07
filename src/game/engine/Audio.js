import "whatwg-fetch";
import Url from "../../lib/Url";

let _context;
let _currentlyPlaying = {};
const _inFlight = [];

export default class Audio {
  static EFFECTS = {
    CLOSE_BOOK: "close-book",
    DIE: "die",
    GAME_OVER: "game-over",
    JUMP: "jump",
    JUMP_COLLIDE: "jump-collide",
    OPEN_BOOK: "open-book",
    OUT_OF_MAGIC: "out-of-magic",
    SECRET: "secret",
    SPLASH: "splash",
    TAKE_DAMAGE: "take-damage"
  };

  static cache = [];

  static isCurrentlyPlaying(name) {
    return !!_currentlyPlaying[name];
  }

  static getCurrentlyPlaying() {
    return Object.keys(_currentlyPlaying).length;
  }

  static async play(name) {
    const url = effectPath(name) || musicPath(name);
    if (!url) {
      return;
    }
    const sound = await Audio.load(url);
    sound.connect(Audio.context().destination);
    sound.start(0);
    sound.onended = () => {
      delete _currentlyPlaying[name];
    };
    _currentlyPlaying[name] = sound;
    return sound;
  }

  static stop(sound) {
    return sound ? Audio.stopTrack(sound) : Audio.stopAll();
  }

  static stopAll() {
    Object.keys(_currentlyPlaying).forEach(name => {
      _currentlyPlaying[name].stop(0);
    });
    _currentlyPlaying = {};
  }

  static stopTrack(name) {
    if (_currentlyPlaying[name]) {
      _currentlyPlaying[name].stop(0);
      delete _currentlyPlaying[name];
    }
  }

  static async loadSoundEffects() {
    const effects = Object.keys(Audio.EFFECTS).map(
      effect => Audio.EFFECTS[effect]
    );
    return Promise.all(effects.map(effect => Audio.loadEffect(effect)));
  }

  static async load(url) {
    const publicUrl = Url.SOUND + url;
    let buffer;
    if (Audio.cache[url]) {
      buffer = Audio.cache[url];
    } else {
      const data = await Audio.fetch(publicUrl);
      buffer = await Audio.context().decodeAudioData(data);
      Audio.cache[url] = buffer;
    }
    const source = Audio.context().createBufferSource();
    source.buffer = buffer;
    return source;
  }

  static async loadEffect(effect) {
    await Audio.load(effectPath(effect));
  }

  static async loadMusic(music) {
    await Audio.load(musicPath(music));
  }

  static async fetch(url) {
    try {
      const request = isInFlight(url);
      const response = request ? await request : await enqueue(url);
      return response;
    } catch (e) {
      console.error(`Audio failed to fetch`, url, e);
      throw e;
    }
  }

  static context(context) {
    if (typeof context !== "undefined") {
      _context = context;
    } else if (!_context) {
      _context = new (window.AudioContext || window.webkitAudioContext)();
    }
    return _context;
  }
}

function enqueue(url) {
  const promise = new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        const iDx = _inFlight.findIndex(request => request.url === url);
        _inFlight.splice(iDx, 1);
        resolve(response.arrayBuffer());
      })
      .catch(e => reject(e));
  });
  _inFlight.push({ url, promise });
  return promise;
}

function isInFlight(key) {
  const request = _inFlight.find(request => request.key === key);
  if (request) {
    return request.promise;
  }
}

function effectPath(effect) {
  if (!Object.keys(Audio.EFFECTS).some(key => Audio.EFFECTS[key] === effect)) {
    return false;
  }
  return "effects/" + effect + ".ogg";
}

function musicPath(music) {
  return music ? "music/" + music + ".ogg" : false;
}

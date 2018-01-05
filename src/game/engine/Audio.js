import "whatwg-fetch";
import Url from "../../lib/Url";

let _context;
let _currentlyPlaying = {};

export default class Audio {
  static EFFECTS = {
    CLOSE_BOOK: "close-book",
    JUMP: "jump",
    JUMP_COLLIDE: "jump-collide",
    OPEN_BOOK: "open-book",
    OUT_OF_MAGIC: "out-of-magic",
    SECRET: "secret"
  };

  static cache = [];

  static getCurrentlyPlaying() {
    return Object.keys(_currentlyPlaying).length;
  }

  static async play(url) {
    const sound = await Audio.load(url);
    sound.connect(Audio.context().destination);
    sound.start(0);
    _currentlyPlaying[url] = sound;
    return sound;
  }

  static async playEffect(effect) {
    Audio.play("effects/" + effect + ".ogg");
  }

  static stop(url) {
    return url ? Audio.stopTrack(url) : Audio.stopAll();
  }

  static stopAll() {
    Object.keys(_currentlyPlaying).forEach(track => {
      _currentlyPlaying[track].stop(0);
    });
    _currentlyPlaying = {};
  }

  static stopTrack(url) {
    if (_currentlyPlaying[url]) {
      _currentlyPlaying[url].stop(0);
      delete _currentlyPlaying[url];
    }
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
    Audio.load("effects/" + effect + ".ogg");
  }

  static async fetch(url) {
    try {
      const response = await fetch(url);
      return response.arrayBuffer();
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

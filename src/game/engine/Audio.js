import "whatwg-fetch";
import Url from "../../lib/Url";

export default class Audio {
  static EFFECTS = {
    CLOSE_BOOK: "effects/close-book.ogg",
    JUMP: "effects/jump.ogg",
    JUMP_COLLIDE: "effects/jump-collide.ogg",
    OPEN_BOOK: "effects/open-book.ogg"
  };

  static cache = [];
  static _context;
  static _currentlyPlaying = {};

  static async play(url) {
    const sound = await Audio.load(url);
    sound.connect(Audio.context().destination);
    sound.start(0);
    Audio._currentlyPlaying[url] = sound;
  }

  static stop(url) {
    return url ? Audio.stopTrack(url) : Audio.stopAll();
  }

  static stopAll() {
    Object.keys(Audio._currentlyPlaying).forEach(track => {
      Audio._currentlyPlaying[track].stop(0);
    });
    Audio._currentlyPlaying = {};
  }

  static stopTrack(url) {
    if (Audio._currentlyPlaying[url]) {
      Audio._currentlyPlaying[url].stop(0);
      delete Audio._currentlyPlaying[url];
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

  static async fetch(url) {
    try {
      const response = await fetch(url);
      return response.arrayBuffer();
    } catch (e) {
      console.error(`Audio failed to fetch`, url, e);
      throw e;
    }
  }

  static context() {
    if (!Audio._context) {
      Audio._context = new (window.AudioContext || window.webkitAudioContext)();
    }
    return Audio._context;
  }
}

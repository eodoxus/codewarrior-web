import Audio from "./Audio";

const mockSong = new ArrayBuffer(1);
const mockUrl = "test/url";

beforeEach(() => {
  fetch.mockClear();

  const mockContext = {
    isPlaying: false,
    destination: "speakers",
    decodeAudioData: () => "audio data",
    createBufferSource: () => {
      return {
        connect: jest.fn(),
        start: () => (Audio.context().isPlaying = true),
        stop: () => (Audio.context().isPlaying = false)
      };
    }
  };

  window.AudioContext = function() {
    return Object.assign({ name: "AudioContext" }, mockContext);
  };
  window.webkitAudioContext = function() {
    return Object.assign({ name: "webkitAudioContext" }, mockContext);
  };

  fetch.mockResponse(mockSong);
});

describe("Audio", () => {
  describe("play", () => {
    it("connects sound to speakers and starts its", async () => {
      const sound = await Audio.play(mockUrl);
      const context = Audio.context();
      expect(context.isPlaying).toBe(true);
      expect(sound.connect).toHaveBeenCalledTimes(1);
      expect(sound.connect).toHaveBeenCalledWith(context.destination);
    });
  });

  describe("stop", () => {
    it("stops track specified by URL, or all if URL not specified", async () => {
      await Audio.play("test1");
      await Audio.play("test2");
      // Should be 3 songs playing, these 2 plus the 1 from previous test
      expect(Audio.getCurrentlyPlaying()).toBe(3);
      Audio.stop("test1");
      expect(Audio.getCurrentlyPlaying()).toBe(2);
      Audio.stop();
      expect(Audio.getCurrentlyPlaying()).toBe(0);
    });

    it("stops playing of sound", async () => {
      const context = Audio.context();
      await Audio.play(mockUrl);
      expect(context.isPlaying).toBe(true);
      Audio.stop(mockUrl);
      expect(context.isPlaying).toBe(false);
    });

    it("does nothing if sound isn't playing", async () => {
      const context = Audio.context();
      await Audio.play(mockUrl);
      expect(context.isPlaying).toBe(true);
      Audio.stop("test5");
      expect(context.isPlaying).toBe(true);
    });
  });

  describe("load", () => {
    beforeEach(() => {
      Audio.fetch = jest.fn(Audio.fetch);
    });

    it("fetches song data and caches it", async () => {
      const url = "test3";
      const sound = await Audio.load(url);
      expect(Audio.cache[url]).toEqual(sound.buffer);
      expect(Audio.fetch).toHaveBeenCalledTimes(1);
      expect(Audio.fetch).toHaveBeenCalledWith("/sound/" + url);
    });

    it("uses song from cache if it exists alreadys", async () => {
      const sound = await Audio.load(mockUrl);
      expect(Audio.fetch).not.toHaveBeenCalled();
      expect(Audio.cache[mockUrl]).toEqual(sound.buffer);
    });
  });

  describe("fetch", () => {
    it("returns song data from endpoint", async () => {
      const data = await Audio.fetch(mockUrl);
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0][0]).toBe(mockUrl);
      expect(data).toEqual(mockSong);
    });

    it("logs error on failure", async () => {
      console.error = jest.fn();
      fetch.mockReject();
      try {
        const data = await Audio.fetch(mockUrl);
        fail("Expected fetch fail");
      } catch (e) {
        expect(console.error.mock.calls.length).toBe(1);
        expect(console.error.mock.calls[0][0]).toBe("Audio failed to fetch");
        expect(console.error.mock.calls[0][1]).toBe(mockUrl);
        expect(console.error.mock.calls[0][3]).toBe(e);
      }
      console.error.mockClear();
    });
  });

  describe("context", () => {
    it("uses window.AudioContext if it exists, and falls back to window.webkitAudioContext", () => {
      let context = Audio.context();
      expect(context.name).toEqual("AudioContext");

      window.AudioContext = null;
      Audio.context(window.AudioContext);
      context = Audio.context();
      expect(context.name).toEqual("webkitAudioContext");
    });
  });
});

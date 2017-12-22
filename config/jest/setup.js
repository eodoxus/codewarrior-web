global.fetch = require("jest-fetch-mock");

global.crypto = {
  getRandomValues: () => 1
};

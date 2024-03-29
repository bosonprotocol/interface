// File introduced to fix the problem "Textdecoder is not defined" while running the tests
// Ref: https://github.com/jsdom/jsdom/issues/2524

/* eslint-disable @typescript-eslint/no-var-requires */
const Environment = require("jest-environment-jsdom");

module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === "undefined") {
      const { TextEncoder, TextDecoder } = require("util");
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
};

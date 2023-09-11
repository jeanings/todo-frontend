/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(js|ts)x?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      "tsconfig": "<rootDir>/tsconfig.json",
      "isolatedModules": true,
      "useESM": true
    }
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "\\.(css|sass)$": "identity-obj-proxy",
  },
  resetMocks: true,
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"]
};
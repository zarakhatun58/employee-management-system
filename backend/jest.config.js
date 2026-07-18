module.exports = {
  preset: "ts-jest",

  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  moduleFileExtensions: [
    "ts",
    "js"
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },

  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json"
    }
  }
};
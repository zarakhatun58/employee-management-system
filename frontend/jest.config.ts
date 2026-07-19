import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  roots: ["<rootDir>/src"],

  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
  ],

 testMatch: [
  "**/__tests__/**/*.test.ts",
  "**/__tests__/**/*.test.tsx",
  "**/*.test.ts",
  "**/*.test.tsx",
],

  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setup.ts",
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",

    "\\.(css|less|scss|sass)$":
      "identity-obj-proxy",

    "\\.(jpg|jpeg|png|gif|svg|webp|avif)$":
      "<rootDir>/src/tests/__mocks__/fileMock.ts",
  },

 transform: {
  "^.+\\.(ts|tsx)$": [
    "ts-jest",
    {
      tsconfig: "tsconfig.app.json",
    },
  ],
},

  transformIgnorePatterns: [
    "/node_modules/",
  ],

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/tests/**",
  ],

  coverageDirectory: "coverage",

  coverageReporters: [
    "text",
    "lcov",
    "html",
  ],

  clearMocks: true,
};

export default config;
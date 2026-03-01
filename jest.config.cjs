/** @type {import('jest').Config} */
/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@components/(.*)$": "<rootDir>/app/components/$1",
    "^@hooks/(.*)$": "<rootDir>/app/hooks/$1",
    "^@interactive/(.*)$": "<rootDir>/app/Interactive_Modules/$1",
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
};

module.exports = createJestConfig(customJestConfig);

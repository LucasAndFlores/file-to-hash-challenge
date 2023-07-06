/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  bail: true,
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: "coverage",
  preset: "ts-jest",
  coverageProvider: "v8",
  testMatch: ["**/tests/unit/*.ts", "**/tests/integration/*.ts"],
};

export default config;

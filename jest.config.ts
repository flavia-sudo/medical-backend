import type { Config } from 'jest';

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/drizzle/db.ts",
    "src/drizzle/schema.ts",
    "src/email/email.service.ts"
  ]
};

export default config;
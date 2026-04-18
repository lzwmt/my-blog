import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@blog/shared/db",
        replacement: path.resolve(__dirname, "packages/shared/src/db/index.ts")
      },
      {
        find: "@blog/shared",
        replacement: path.resolve(__dirname, "packages/shared/src/index.ts")
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "apps/web")
      }
    ]
  },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    setupFiles: ["./tests/integration/setup.ts"],
    testTimeout: 30000,
    hookTimeout: 30000
  }
});

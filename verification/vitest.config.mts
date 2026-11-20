import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(here, ".."),
  test: {
    environment: "node",
    include: ["verification/**/*.verify.ts"],
    testTimeout: 120_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(here, "../src"),
    },
  },
});

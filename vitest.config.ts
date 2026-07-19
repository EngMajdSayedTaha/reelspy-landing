import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// jsdom (not the dashboard's node environment) because the landing's value is
// almost entirely in its rendered sections — these tests exist to catch a
// section that throws, loses a link, or drops a responsive tier during a
// re-skin, which only a DOM render can see.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.{ts,tsx}"],
    setupFiles: ["test/setup.ts"],
  },
});

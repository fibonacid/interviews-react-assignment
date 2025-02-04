/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    root: "./src",
    include: ["./**/*.test.ts", "./**/*.test.tsx"],
    setupFiles: ["./setupTests.ts"],
  },
});

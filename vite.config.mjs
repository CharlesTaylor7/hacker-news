import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";

export default defineConfig({
  base: "/hacker-news/",
  plugins: [react()],
  esbuild: {
    keepNames: true,
  },
  css: {
    postcss: {
      plugins: [tailwind],
    },
  },
  optimizeDeps: {
    force: true,
  },
});

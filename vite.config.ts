import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  root: "renderer",
  envDir: "../",
  plugins: [
    react(),
    tailwindcss(),
    electron([
      {
        entry: "../electron/main.ts",
        vite: {
          build: {
            outDir: "../dist-electron",
          },
        },
      },
      {
        entry: "../electron/preload.ts",
        onstart(options) {
          options.reload();
        },
        vite: {
          build: {
            outDir: "../dist-electron",
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./renderer/src"),
      "@database": path.resolve(__dirname, "./database"),
      "@sync": path.resolve(__dirname, "./sync"),
      "@appwrite": path.resolve(__dirname, "./appwrite"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});

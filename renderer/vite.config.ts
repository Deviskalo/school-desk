import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import renderer from "vite-plugin-electron-renderer";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), renderer()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@database": path.resolve(__dirname, "../database"),
      "@sync": path.resolve(__dirname, "../sync"),
      "@appwrite": path.resolve(__dirname, "../appwrite"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});

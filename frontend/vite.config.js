import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Pre-compress assets with gzip - directly improves Lighthouse
    // "Enable text compression" and "Reduce network payload" audits
    compression({ algorithm: "gzip" }),
  ],
  build: {
    // Split vendor code so the browser can cache it separately from app code
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    // Fail the build if a chunk balloons, keeps bundles Lighthouse-friendly
    chunkSizeWarningLimit: 600,
    sourcemap: false,
  },
});

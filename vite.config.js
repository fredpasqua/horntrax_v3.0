import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({
  mode,
}) => {
  // For GitHub Pages: set BASE_PATH to "/<repo-name>/" if deploying to /<repo>/
  const base = process.env.BASE_PATH || "/";
  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg"],
        manifest: {
          name: "HornTrax",
          short_name: "HornTrax",
          description: "Loaner instrument inventory with barcode scan + QR export",
          start_url: ".",
          display: "standalone",
          background_color: "#0b0b0e",
          theme_color: "#0b0b0e",
          icons: [
            {
              src: "pwa-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    define: {
      __API_BASE__: JSON.stringify(process.env.VITE_API_BASE || "https://horntrax-api.herokuapp.com"),
    },
  };
});

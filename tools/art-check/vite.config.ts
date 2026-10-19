import { defineConfig } from "vite";

// Bundles the pixel modules for Node so the art can be rendered to PNG without
// a browser. Nothing here is part of the site build.
export default defineConfig({
  define: { "import.meta.env.VITE_LOCAL_ASSETS": JSON.stringify("1") },
  build: {
    ssr: "tools/art-check/entry.ts",
    outDir: "tools/art-check/.out",
    emptyOutDir: true,
    target: "node20",
    minify: false,
  },
});

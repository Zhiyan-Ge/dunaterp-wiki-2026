import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// Import the config-safe utility directly. The utils barrel also exports
// browser-only route components and assets, which Vite must not bundle while
// loading its Node configuration.
import { stringToSlug } from "./src/utils/stringToSlug";

// https://vitejs.dev/config/
export default () => {
  const env = loadEnv("dev", process.cwd());
  return defineConfig({
    base: `/${stringToSlug(env.VITE_TEAM_NAME)}/`,
    plugins: [react()],
  });
};

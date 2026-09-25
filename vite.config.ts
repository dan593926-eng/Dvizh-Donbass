import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

/**
 * Базовый путь сайта.
 * - Локально (npm run dev) — "/".
 * - На GitHub Pages сайт живёт по адресу https://<логин>.github.io/<репозиторий>/,
 *   поэтому base должен быть "/<репозиторий>/". GitHub Actions сам передаёт
 *   имя репозитория в переменной GITHUB_REPOSITORY — ничего настраивать не нужно.
 * - Репозиторий вида <логин>.github.io или свой домен — base "/".
 *   Для своего домена задайте переменную BASE_PATH=/ (см. README).
 */
function resolveBase(): string {
  if (process.env.BASE_PATH) return process.env.BASE_PATH;
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (repo && !repo.endsWith(".github.io")) return `/${repo}/`;
  return "/";
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-motion": ["framer-motion"],
          "vendor-react": ["react", "react-dom"],
        },
      },
    },
  },
});

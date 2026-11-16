import type { NextConfig } from "next";

/**
 * Exportación estática para GitHub Pages.
 * PAGES_BASE_PATH lo define el workflow de despliegue (p. ej. "/webapp").
 * En local queda vacío y la app se sirve desde la raíz.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

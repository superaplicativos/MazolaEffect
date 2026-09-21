import type { NextConfig } from "next";

const isGHPages = process.env.GH_PAGES === "true";

const nextConfig: NextConfig = {
  // For GitHub Pages we use static export; for dev/standalone preview keep standalone.
  output: isGHPages ? "export" : "standalone",
  // Repo is at https://github.com/superaplicativos/MazolaEffect
  // Pages URL: https://superaplicativos.github.io/MazolaEffect/
  basePath: isGHPages ? "/MazolaEffect" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

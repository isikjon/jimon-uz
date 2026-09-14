import type { NextConfig } from "next";
import path from "node:path";

/**
 * STATIC_EXPORT=1 → fully static build for shared hosting (Apache + PHP):
 * pages are pre-rendered to /out, routing rules live in deploy/.htaccess, leads go to deploy/lead.php.
 * Without the flag the app builds as a regular Next.js server (Node hosting / Vercel).
 */
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(process.cwd()),
  ...(isStatic ? { output: "export" as const, trailingSlash: false } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1440, 1920],
    unoptimized: isStatic,
  },
  transpilePackages: ["three"],
  ...(isStatic
    ? {}
    : {
        async rewrites() {
          return [
            { source: "/", destination: "/ru" },
            { source: "/privacy", destination: "/ru/privacy" },
          ];
        },
        async redirects() {
          return [
            { source: "/ru", destination: "/", permanent: true },
            { source: "/ru/privacy", destination: "/privacy", permanent: true },
          ];
        },
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              ],
            },
            {
              source: "/(images|video|catalog)/(.*)",
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
          ];
        },
      }),
};

export default nextConfig;

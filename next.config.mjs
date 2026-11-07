/** @type {import('next').NextConfig} */

// Supabase Storage host, so next/image can optimise uploaded gallery photos.
// Derived from the env var so nothing is hard-coded.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

// Where the browser may load things from. Scripts and styles need 'unsafe-inline' because Next.js writes small inline
// ones into every page; everything else is limited to this site, Supabase (photos, forms) and Google Maps (the map frames).
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabaseOrigin}`.trim(),
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin}`.trim(),
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Uploaded photos get a new file name every time, so optimised copies can be kept for a month
    // (the default re-checks every minute). Fewer sizes = fewer variants to generate and cache.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 640, 828, 1080, 1280, 1920],
    imageSizes: [96, 160, 256, 384],
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  poweredByHeader: false,
  // The Kindergarten page used to be at /nursery: keep old links and bookmarks working.
  async redirects() {
    return [
      { source: "/nursery", destination: "/kindergarten", permanent: true },
      { source: "/ta/nursery", destination: "/ta/kindergarten", permanent: true },
    ];
  },
  // Basic hardening headers for every page.
  async headers() {
    const longCache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return [
      { source: "/logo.png", headers: longCache },
      { source: "/placeholders/:file*", headers: longCache },
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;

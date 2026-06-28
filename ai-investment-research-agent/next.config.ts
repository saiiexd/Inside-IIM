import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Security headers ────────────────────────────────────────────────────
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            // Next.js RSC / Framer Motion inline scripts
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            // Google Fonts via next/font (self-hosted) — no external needed
            "font-src 'self'",
            // External API calls (Tavily, Gemini) go server-side only
            "connect-src 'self'",
            "img-src 'self' data:",
          ].join("; "),
        },
      ],
    },
  ],

  // ── Compiler options ────────────────────────────────────────────────────
  // Remove console.log in production (but keep warn and error)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["warn", "error"] }
      : false,
  },
};

export default nextConfig;

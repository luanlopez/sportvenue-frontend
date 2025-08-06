import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
          {
            source: "/(.*)",
            headers: [
              {
                key: "Content-Security-Policy",
                value: `
                  default-src 'self';
                  script-src 'self' 'unsafe-eval' https://js.stripe.com;
                  style-src 'self' 'unsafe-inline';
                  connect-src *;
                  frame-src https://js.stripe.com https://hooks.stripe.com;
                  img-src * blob: data:;
                  font-src 'self';
                `.replace(/\s{2,}/g, ' ').trim()
              }
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.topsporteng.com.br",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

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
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.stripe.com https://maps.googleapis.com https://*.googleapis.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              connect-src * https://maps.googleapis.com https://*.googleapis.com;
              frame-src https://js.stripe.com https://*.stripe.com https://checkout.stripe.com;
              img-src * blob: data:;
              font-src 'self' https://fonts.gstatic.com;
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

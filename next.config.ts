import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.stripe.com https://checkout.stripe.com",
              "frame-src 'self' https://js.stripe.com https://*.stripe.com https://checkout.stripe.com https://*.stripe.network",
              "connect-src 'self' https://api.stripe.com https://*.stripe.com https://*.stripe.network wss://*.stripe.com https://staging.api.sportvenue.com.br",
              "img-src 'self' data: https: blob: https://*.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.stripe.com",
              "font-src 'self' https://fonts.gstatic.com https://*.stripe.com",
              "object-src 'none'",
              "base-uri 'self'"
            ].join('; '),
          },
        ],
      },
    ]
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

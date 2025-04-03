import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns:[
      {
        protocol:"https",
        hostname: "d12hk4zd0jmtng.cloudfront.net"
      }
    ]
  },
};

export default nextConfig;

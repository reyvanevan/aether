import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict mode in dev — it double-renders every component,
  // which is catastrophic for Three.js (double scene init, double RAF loops).
  // Production is unaffected either way.
  reactStrictMode: false,

  // Optimise production bundle
  experimental: {
    optimizePackageImports: ["three", "@react-three/drei", "@react-three/fiber", "framer-motion"],
  },
};

export default nextConfig;

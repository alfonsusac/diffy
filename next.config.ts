import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // useLightningcss: false,
    lightningCssFeatures: {
      exclude: [ "light-dark" ],
      // Why do i have to add this if useLightningcss is false by default??
      // docs says its false but then my CSS broke without this AAAAAAA
    },
  }
};

export default nextConfig;

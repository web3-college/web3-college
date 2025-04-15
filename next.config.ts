import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 配置 SWC 在生产环境中移除 console 语句
  compiler: {
    // 移除 console.*，除了 console.error
    removeConsole: {
      exclude: ['error'],
    },
  },
};

export default nextConfig;

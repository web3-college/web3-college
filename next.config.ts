import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 配置 SWC 在生产环境中移除 console 语句
  compiler: {
    // 移除 console.*，除了 console.error
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : undefined,
  },

  // 配置webpack处理worker文件
  // webpack: (config, { isServer }) => {
  //   // Only apply Web Worker configuration on client-side
  //   if (!isServer) {
  //     config.module.rules.push({
  //       test: /\.worker\.ts$/,
  //       use: {
  //         loader: 'worker-loader',
  //         options: {
  //           // Optional: Configure worker output filename
  //           filename: 'static/[name].[contenthash].worker.js',
  //           // Optional: Make workers work with Next.js public path
  //           publicPath: '/_next/',
  //         },
  //       },
  //     });
  //   }
  //   return config;
  // },
};

export default nextConfig;

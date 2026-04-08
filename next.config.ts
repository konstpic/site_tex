import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /**
   * Иначе при открытии dev по LAN (http://192.168.x.x:3000) WebSocket HMR блокируется
   * и в консоли сыпятся ошибки ws://…/_next/webpack-hmr — см. allowedDevOrigins в доке Next.js.
   */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
};

export default nextConfig;

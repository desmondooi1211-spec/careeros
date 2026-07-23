import type { NextConfig } from "next";
import os from "os";

// Dynamically discover all active local IPv4 addresses to permit HMR hot-reloading on local network testing
const getLocalDevOrigins = (): string[] => {
  const interfaces = os.networkInterfaces();
  const origins = ["localhost", "127.0.0.1", "localhost:3000", "127.0.0.1:3000"];
  for (const name of Object.keys(interfaces)) {
    const networks = interfaces[name];
    if (networks) {
      for (const net of networks) {
        if (net.family === "IPv4" && !net.internal) {
          origins.push(net.address);
          origins.push(`${net.address}:3000`);
        }
      }
    }
  }
  return origins;
};

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Allow unoptimized images for static export compatibility
    unoptimized: true,
  },
  // Permit HMR connections from any detected local network interfaces
  allowedDevOrigins: getLocalDevOrigins(),
};

export default nextConfig;

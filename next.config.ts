import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import { searchIndexingEnabled } from "./src/utils/config/indexing";

const nextConfig: NextConfig = {
  async headers() {
    return searchIndexingEnabled
      ? []
      : [
          {
            source: "/:path*",
            headers: [{ key: "X-Robots-Tag", value: "noindex" }],
          },
        ];
  },
};

export default nextConfig;

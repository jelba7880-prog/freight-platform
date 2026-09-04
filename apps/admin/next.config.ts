import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 auto-generates AGENTS.md/CLAUDE.md on `dev`/`build`; opt out
  // to keep the scaffold free of generated docs across three app dirs.
  agentRules: false,
  // @freight/ui and @freight/database ship raw TS/TSX source (no build
  // step) — both need Next's own compiler to process them, which only
  // happens for packages listed here.
  transpilePackages: ["@freight/ui", "@freight/database"],
  experimental: {
    serverActions: {
      // uploadDocument (document-actions.ts) submits the file through this
      // server action. Next's default 1MB cap is well under what a real
      // shipment document (a scanned bill of lading, a multi-page customs
      // declaration PDF) commonly runs, so the default would silently
      // reject legitimate uploads.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;

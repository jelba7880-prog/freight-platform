import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 auto-generates AGENTS.md/CLAUDE.md on `dev`/`build`; opt out
  // to keep the scaffold free of generated docs across three app dirs.
  agentRules: false,
  // @freight/ui and @freight/database ship raw TS/TSX source (no build
  // step) — both need Next's own compiler to process them, which only
  // happens for packages listed here.
  transpilePackages: ["@freight/ui", "@freight/database"],
};

export default nextConfig;

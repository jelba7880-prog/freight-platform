import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 auto-generates AGENTS.md/CLAUDE.md on `dev`/`build`; opt out
  // to keep the scaffold free of generated docs across three app dirs.
  agentRules: false,
  // @freight/ui ships raw TSX source (no build step) and calls next/font
  // internally — both need Next's own compiler to process them, which
  // only happens for packages listed here.
  transpilePackages: ["@freight/ui"],
};

export default nextConfig;

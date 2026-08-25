import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 auto-generates AGENTS.md/CLAUDE.md on `dev`/`build`; opt out
  // to keep the scaffold free of generated docs across three app dirs.
  agentRules: false,
};

export default nextConfig;

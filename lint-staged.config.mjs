// Per-package flat ESLint configs (see packages/config/eslint/base.mjs)
// don't map onto lint-staged's per-file command model, so this just
// re-runs the (turbo-cached) full lint + typecheck whenever a relevant
// file is staged, ignoring the staged file list itself.
export default {
  "**/*.{ts,tsx,js,jsx,mjs,cjs}": () => ["pnpm lint", "pnpm typecheck"],
};

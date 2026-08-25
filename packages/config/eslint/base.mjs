// Shared flat ESLint config consumed by every app and package.
//
// `baseConfig` is plain JS rules only — safe to combine with anything.
// `typescriptConfig` adds typescript-eslint's recommended rules and is meant
// for packages that don't already get TypeScript linting from elsewhere
// (packages/database, packages/lib, packages/ui). Apps get their TypeScript
// setup from eslint-config-next's "next/typescript" instead: layering
// typescript-eslint's plugin on top of that again trips ESLint's "cannot
// redefine plugin" flat-config check, since the two would register the
// @typescript-eslint plugin twice.
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export const baseConfig = [
  js.configs.recommended,
  {
    ignores: [
      "**/.next/**",
      "**/.turbo/**",
      "**/dist/**",
      "**/node_modules/**",
    ],
  },
];

export const typescriptConfig = tseslint.config(
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
);

export default baseConfig;

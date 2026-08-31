import { baseConfig, typescriptConfig } from "@freight/config/eslint/base.mjs";

export default [
  ...baseConfig,
  ...typescriptConfig,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { process: "readonly", console: "readonly" },
    },
  },
];

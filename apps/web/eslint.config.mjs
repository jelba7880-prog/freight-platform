import nextConfig from "eslint-config-next";
import { baseConfig } from "@freight/config/eslint/base.mjs";

const config = [...baseConfig, ...nextConfig];

export default config;

import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "docs/**",
    "digital-architect/**",
    "node_modules/**",
    "dist/**",
    "**/dist/**",
    "packages/shared/generated/**",
    ".next/**",
    "**/.next/**",
    ".next-prod/**",
    "**/.next-prod/**",
    ".umi/**",
    ".umi-production/**",
    "**/.umi/**",
    "**/.umi-production/**",
    "**/next-env.d.ts"
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
      }
    }
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    settings: {
      next: {
        rootDir: [".", "apps/web"]
      },
      react: {
        version: "19.2"
      }
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off"
    }
  }
]);

import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import pluginVue from "eslint-plugin-vue"
import globals from "globals"

export default [
  // Vue 推荐规则集
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["src/**/*.{ts,tsx,d.ts}"],
      ignores: ["dist", "node_modules"],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
            project: "./tsconfig.json",
        },
        globals: {
            ...globals.browser,
        },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
        semi: ["error", "never"], // 禁止分号
    },
  },
]

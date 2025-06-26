// vite.config.ts
// -------------------- Vue 相关插件 --------------------
import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import vueJsx from "@vitejs/plugin-vue-jsx"

// -------------------- Vite 核心与工具插件 --------------------
import { defineConfig } from "vite"
import viteTsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // --- Vue 相关 ---
    vue(), // Vue 单文件组件支持
    vueJsx(), // Vue JSX 支持
    Components({
      dts: "./src/types/components.d.ts", // 组件自动导入类型声明输出目录
      resolvers: [NaiveUiResolver()],
    }),
    AutoImport({
      dts: "./src/types/auto-imports.d.ts", // 自动导入类型声明输出目录
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
    }),
    // --- Vite 工具 ---
    viteTsconfigPaths(), // 自动识别 tsconfig 路径别名
  ],
  define: {
    // 生产环境下启用 hydration mismatch 详细信息
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
  },
})

import { createRouter, createWebHashHistory } from "vue-router"
import { setupRouterGuard } from "./guard"
import authRoutes from "./routes/auth"
import errorRoutes from "./routes/error"
import mainRoutes from "./routes/main"

// 合并所有路由
const routes = [...authRoutes, ...mainRoutes, ...errorRoutes]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

// 注册路由守卫
setupRouterGuard(router)

export default router

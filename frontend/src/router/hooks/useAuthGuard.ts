// 登录鉴权的路由守卫 hook，推荐结合 Pinia
import useColorLogOutPut from "@/utils/color_log"
import { useAuthStore } from "@/utils/stores/auth"
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router"

export function useAuthGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const log = useColorLogOutPut()
  const authStore = useAuthStore()
  const urlPath = to.path.toLowerCase()
  const isLogin = authStore.isLogin

  if (urlPath === "/login" || urlPath === "/register") {
    log.info("用户访问登录|注册")
    next()
    return
  }
  if (urlPath !== "/" && !isLogin) {
    log.warning(`用户无权但是访问了:> ${urlPath}`)
    next("/login")
    return
  }
  log.success(`正常访问了: ${urlPath}`)
  next()
}

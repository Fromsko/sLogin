// 设置页面标题的路由守卫 hook
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router"

export function useTitleGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const { meta: { title } = {} } = to
  document.title = (title as string) || "自定义名称"
  next()
}

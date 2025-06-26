// 路由守卫逻辑抽离
import { Router } from "vue-router"

// 动态加载 hooks 目录下所有守卫
const guardModules = import.meta.glob("./hooks/*.ts", { eager: true })
const guardHooks = Object.values(guardModules)
  .map((mod) => Object.values(mod as Record<string, unknown>) as any[])
  .flat()
  .filter((fn): fn is (...args: any[]) => void => typeof fn === "function")

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    let idx = 0
    // 递归执行所有 hook，支持异步
    const run = () => {
      if (idx < guardHooks.length) {
        guardHooks[idx++](to, from, (param?: any) => {
          if (param === false || typeof param === "string") {
            next(param)
          } else {
            run()
          }
        })
      } else {
        next()
      }
    }
    run()
  })
}

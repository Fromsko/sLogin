// 错误页相关路由
export default [
  {
    name: "404",
    path: "/:catchAll(.*)",
    component: () => import("@/views/error/404.vue"),
  },
]

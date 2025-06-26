// 主功能相关路由（如首页、菜单等）
export default [
  {
    name: "home",
    path: "/home",
    meta: {
      title: "首页",
    },
    component: () => import("@/views/Home.vue"),
  },
  {
    name: "loadingPage",
    path: "/loading",
    component: () => import("@/components/Loading.vue"),
  },
  {
    name: "menuPage",
    path: "/menu",
    component: () => import("@/components/ActionMenu.vue"),
  },
  {
    name: "menuBarPage",
    path: "/menu_bar",
    component: () => import("@/views/Home.vue"),
  },
]

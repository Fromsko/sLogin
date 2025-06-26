// 认证相关路由（如登录、注册等）
export default [
  {
    name: "index",
    path: "/",
    redirect: "login",
    children: [
      {
        name: "login",
        path: "login",
        component: () => import("@/views/Login.vue"),
        meta: {
          title: "登陆页^_^",
        },
      },
    ],
  },
]

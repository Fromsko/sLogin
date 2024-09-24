/** 
  File: index.ts
  Author: Fromsko
  Created At: 2024-09-22
  GitHub: https://github.com/fromsko
  Description: 路由
*/
import { respData } from "@/models/client";
import useColorLogOutPut from "@/utils/color_log";
import storage from "@/utils/storage";
import Home from "@/views/Home.vue";
import { createRouter, createWebHashHistory } from "vue-router";


// NOTE: 路由设置
const routes = [
    {

        name: 'index',
        path: '/',
        redirect: 'login',
        children: [
            {
                name: 'login',
                path: 'login',
                component: () => import("@/views/Login.vue"),
                meta: {
                    title: "登陆页^_^"
                }
            },
        ]
    },
    {
        name: 'home',
        path: '/home',
        meta: {
            title: "首页"
        },
        component: Home,
    },
    {
        name: 'loadingPage',
        path: '/loading',
        component: () => import(`@/components/Loading.vue`)
    },
    {
        name: 'menuPage',
        path: '/menu',
        component: () => import(`@/components/ActionMenu.vue`)
    },
    {
        name: 'menuBarPage',
        path: '/menu_bar',
        component: () => import(`@/components/MenuBar.vue`)
    },
    {
        name: '404',
        path: '/:catchAll(.*)',
        component: () => import(`@/views/error/404.vue`)
    }
]

const log = useColorLogOutPut()
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: routes
})


// 导航守卫
router.beforeEach((to, from, next) => {
    // 设置标签信息
    const { meta: { title } } = to;
    document.title = title as string || '自定义名称';
    let checkUserInfo: boolean = false
    const urlPath: string = to.path.toLowerCase();
    const loginResp = storage.getItem('loginResp') as respData;

    if (loginResp?.ip && loginResp?.uid) {
        checkUserInfo = true
    }

    // 处理不同路由的逻辑
    switch (urlPath) {
        case '/login':
        case '/register':
            log.info("用户访问登录|注册");
            next();
            break;
        default:
            if (urlPath !== '/' && !checkUserInfo) {
                log.warning(`用户无权但是访问了:> ${urlPath}`);
                next('/login'); // 重定向到登录
            } else {
                log.success(`正常访问了: ${urlPath}`);
                next(); // 允许继续访问
            }
            break;
    }
});

// 全局后置守卫
router.afterEach((to, from, failure) => {
    // console.log('全局后置守卫', to, from, failure)
    // next()
})

// 全局解析守
router.beforeResolve((to, from, next) => {
    next()
})

export default router
import { respData } from "@/models/client";
import useColorLogOutPut from "@/utils/color_log";
import { useStorage } from "@/utils/storage";
import { createRouter, createWebHashHistory } from "vue-router";

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
        component: () => import("@/views/Home.vue"),
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
        component: () => import(`@/views/Home.vue`)
    },
    {
        name: 'setting',
        path: '/setting',
        component: () => import(`@/components/Setting.vue`)
    },
    {
        name: '404',
        path: '/:catchAll(.*)',
        component: () => import(`@/views/error/404.vue`)
    }
]

const storage = useStorage()
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
    const loginResp = storage.getItem("loginResp") as respData;

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

export default router
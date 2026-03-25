import { createRouter, createWebHistory } from 'vue-router'


const router_base = [
    {
        path: '/',
        name: 'Home',
        meta: {
            title: "11",
        },
        component: () =>
            import('@/views/Index.vue')
    },
    {
        path: '/hello',
        name: 'Hello',
        meta: {
            title: "Hello",
        },
        component: () =>
            import('@/components/HelloWorld.vue')
    },
]
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: router_base
})

router.beforeEach((to, from, next) => {
    // 设置页面标题
    document.title = to.meta.title

    next()
})

export default router
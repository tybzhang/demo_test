import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/index.vue'
import ErrorView from '../views/error.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/404',
      name: 'NotFound',
      component: ErrorView
    },
    // 所有未定义路由，全部重定向到404页
    {
      path: "/:catchAll(.*)", // 不识别的path自动匹配404
      redirect: '/404'
    }
  ]
})

export default router

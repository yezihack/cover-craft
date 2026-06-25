import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('@/pages/EditorPage.vue'),
    },
  ],
})

export default router

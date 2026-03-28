import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: import('../views/Main.vue'),
      children: [
        { path: '/', name: 'home', component: import('../views/Home.vue') },
        { path: '/shop', name: 'shop', component: import('../views/Shop.vue') },
        { path: '/cart', name: 'cart', component: import('../views/Cart.vue') },
        { path: '/my', name: 'my', component: import('../views/My.vue') },
      ]
    },
    { path: '/room/:id/:name?', name: 'room', component: import('../views/Room.vue') },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: import('../views/404.vue') },
  ],
})

export default router

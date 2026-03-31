import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: import('../views/Login.vue') },
    { path: '/set-password', name: 'set-password', component: import('../views/SetPassword.vue') },
    { path: '/change-password', name: 'change-password', component: import('../views/ChangePassword.vue') },
    { path: '/forget-password', name: 'forget-password', component: import('../views/ForgetPassword.vue') },
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
    { path: '/check-in', name: 'check-in', component: import('../views/CheckIn.vue') },
    { path: '/ranking', name: 'ranking', component: import('../views/Ranking.vue') },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: import('../views/404.vue') },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 将已登录用户，重定向到首页
  if (token && to.name === 'login') {
    next({ name: 'home' })
  }
  // 将未登录用户，重定向到登录页面
  else if (!token && to.name !== 'login') {
    next({ name: 'login' })
  }
  else {
    next()
  }
})

export default router

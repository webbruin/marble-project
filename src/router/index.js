import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/Main.vue'),
      children: [
        { path: '/', name: 'home', component: () => import('../views/Home.vue') },
        { path: '/shop', name: 'shop', component: () => import('../views/Shop.vue') },
        { path: '/cart', name: 'cart', component: () => import('../views/Cart.vue') },
        { path: '/my', name: 'my', component: () => import('../views/My.vue') },
      ] 
    },
    { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
    { path: '/set-password', name: 'set-password', component: () => import('../views/SetPassword.vue') },
    { path: '/change-password', name: 'change-password', component: () => import('../views/ChangePassword.vue') },
    { path: '/forget-password', name: 'forget-password', component: () => import('../views/ForgetPassword.vue') },
    { path: '/room/:id', name: 'room', component: () => import('../views/Room.vue') },
    { path: '/check-in', name: 'check-in', component: () => import('../views/CheckIn.vue') },
    { path: '/ranking', name: 'ranking', component: () => import('../views/Ranking.vue') },
    { path: '/setting', name: 'setting', component: () => import('../views/Setting.vue') },
    { path: '/account-cancel', name: 'account-cancel', component: () => import('../views/AccountCancel.vue') },
    { path: '/edit-user-info', name: 'edit-user-info', component: () => import('../views/EditUserInfo.vue') },
    { path: '/aggrement/:type', name: 'aggrement', component: () => import('../views/Aggrement.vue') },
    { path: '/bluetooth', name: 'bluetooth', component: () => import('../views/Bluetooth.vue') },
    { path: '/real-name-auth', name: 'real-name-auth', component: () => import('../views/RealNameAuth.vue') },
    { path: '/city', name: 'city', component: () => import('../views/City.vue') },
    { path: '/use-record', name: 'use-record', component: () => import('../views/UseRecord.vue') },
    { path: '/ball-record', name: 'ball-record', component: () => import('../views/BallRecord.vue') },
    { path: '/recharge-record', name: 'recharge-record', component: () => import('../views/RechargeRecord.vue') },
    { path: '/point-card-record', name: 'point-card-record', component: () => import('../views/PointCardRecord.vue') },
    { path: '/invitation', name: 'invitation', component: () => import('../views/Invitation.vue') },
    { path: '/settlement', name: 'settlement', component: () => import('../views/Settlement.vue') },
    { path: '/order/:type?', name: 'order', component: () => import('../views/Order.vue') },
    { path: '/address', name: 'address', component: () => import('../views/Address.vue') },
    { path: '/edit-address/:type', name: 'edit-address', component: () => import('../views/EditAddress.vue') },
    // 404
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/404.vue') },
  ],
})

// 需要做登录校验
const needLoginPage = [
  'main',
  'home',
  'shop',
  'cart',
  'my',
  'set-password',
  'change-password',
  'room',
  'check-in',
  'ranking',
  'setting',
  'account-cancel',
  'edit-user-info',
  'real-name-auth',
  'city',
  'use-record',
  'ball-record',
  'recharge-record',
  'point-card-record',
  'invitation',
  'settlement',
  'order',
  'address',
  'edit-address',
];

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 将已登录用户，重定向到首页
  if (token && to.name === 'login') {
    next({ name: 'home' })
  }
  // 将未登录用户，重定向到登录页面
  else if (!token && to.name !== 'login') {
    // 校验页面登陆
    const needLogin = needLoginPage.some(name => name === to.name)
    if (needLogin) {
      next({ name: 'login' })
    } else {
      next()
    }
  }
  else {
    next()
  }
})

export default router

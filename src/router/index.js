import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue';
import Home from '../views/Home.vue';
import Shop from '../views/Shop.vue';
import Cart from '../views/Cart.vue';
import My from '../views/My.vue';
import Login from '../views/Login.vue';
import SetPassword from '../views/SetPassword.vue';
import ChangePassword from '../views/ChangePassword.vue';
import ForgetPassword from '../views/ForgetPassword.vue';
import Room from '../views/Room.vue';
import CheckIn from '../views/CheckIn.vue';
import Ranking from '../views/Ranking.vue';
import Setting from '../views/Setting.vue';
import AccountCancel from '../views/AccountCancel.vue';
import EditUserInfo from '../views/EditUserInfo.vue';
import Aggrement1 from '../views/Aggrement/Aggrement1.vue';
import Bluetooth from '../views/Bluetooth.vue';
import NotFountView from '../views/404.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [
        { path: '/', name: 'home', component: Home },
        { path: '/shop', name: 'shop', component: Shop },
        { path: '/cart', name: 'cart', component: Cart },
        { path: '/my', name: 'my', component: My },
      ]
    },
    { path: '/login', name: 'login', component: Login },
    { path: '/set-password', name: 'set-password', component: SetPassword },
    { path: '/change-password', name: 'change-password', component: ChangePassword },
    { path: '/forget-password', name: 'forget-password', component: ForgetPassword },
    { path: '/room/:id', name: 'room', component: Room },
    { path: '/check-in', name: 'check-in', component: CheckIn },
    { path: '/ranking', name: 'ranking', component: Ranking },
    { path: '/setting', name: 'setting', component: Setting },
    { path: '/account-cancel', name: 'account-cancel', component: AccountCancel },
    { path: '/edit-user-info', name: 'edit-user-info', component: EditUserInfo },
    { path: '/aggrement1', name: 'aggrement1', component: Aggrement1 },
    { path: '/bluetooth', name: 'bluetooth', component: Bluetooth },
    // 404
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFountView },
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

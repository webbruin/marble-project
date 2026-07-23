<template>
  <main class="setting">
    <Header title="设置"></Header>
    <div class="body">
      <div class="module" v-for="(item, index) in rows" :key="index">
        <template v-for="(childItem, childIndex) in item" :key="childIndex">
          <div class="item" v-if="childItem.show"
            @click="clickRouter(childItem.router, childItem.params, childItem.query)">
            <span class="text">
              <template v-if="childItem.router === 'zfb'">{{ userInfo.alipayBound ? '解绑' : '绑定' }}</template>{{
                childItem.name }}
            </span>
            <i class="icon"></i>
          </div>
        </template>
      </div>
    </div>
    <div class="footer">
      <Button buttonText="退出登陆" @click="loginConfirm"></Button>
    </div>
  </main>

  <!-- 支付宝绑定信息  -->
  <van-popup v-model:show="showAplipayBindInfoPopup" position="bottom" closeable>
    <div class="popup-content">
      <div class="title">支付宝绑定信息</div>
      <div class="info">
        <div class="avatar">
          <img :src="bindInfo.avatar" alt="">
        </div>
        <van-cell title="昵称" :value="bindInfo.nickName" />
        <van-cell title="绑定时间" :value="bindInfo.bindTime" />
        <van-button type="primary" block color="#FFB169" @click="clickUnBound">解绑支付宝</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// alipay资源包
import '@/alipay/alipayjsapi.min'
import Button from '@/components/FormData/Button.vue'


const route = useRoute()
const router = useRouter()

const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')) || {})
const rows = ref([
  [
    { name: '用户协议', show: true, router: 'aggrement', params: { type: 'yhxy' } },
    { name: '充值协议', show: true, router: 'aggrement', params: { type: 'czxy' } },
    { name: '隐私政策', show: true, router: 'aggrement', params: { type: 'ysxy' } },
  ],
  [
    { name: '蓝牙连接', show: true, router: 'bluetooth' },
    { name: '实名认证', show: true, router: 'real-name-auth' },
    { name: '支付宝', show: true, router: 'zfb' },
    { name: '设置登录密码', show: !userInfo.value.hasPassword, router: 'set-password' },
    { name: '修改登录密码', show: userInfo.value.hasPassword, router: 'change-password' },
    { name: '账号注销', show: true, router: 'account-cancel' },
  ],
])
// 支付宝appid
const appId = '2021006143643068'
const bindInfo = ref({})
const showAplipayBindInfoPopup = ref(false)

onMounted(() => {
  // 确保 AlipayJSBridge 已加载
  if (window.AlipayJSBridge) {
    getAuthCode();
  } else {
    document.addEventListener('AlipayJSBridgeReady', getAuthCode, false);
  }

  // 首次进页面，先执行一次
  getUserInfo()

  // 监听用户是否从支付宝切了回来
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      getUserInfo()
    }
  });
})

const clickRouter = (name, params = {}, query = {}) => {
  if (!name) {
    return
  }
  if (name === 'real-name-auth' && userInfo.value.realNameFlag === 1) {
    $toast.info('您已完成实名认证')
    return
  }
  if (name === 'zfb') {
    if (userInfo.value.alipayBound) {
      showAplipayBindInfoPopup.value = true
    } else {
      redirectAlipay()
    }
    return
  }
  router.push({ name, params, query })
}

const getAuthCode = () => {
  ap.getAuthCode({
    appId,
    scopes: ['auth_user'],
  }, function (res) {
    router.push({ name: 'alipay-callback', query: { auth_code: res.authCode } })
  });
}

// 跳转支付宝
const redirectAlipay = () => {
  const url = encodeURIComponent(window.location.href)
  window.location.href = `alipays://platformapi/startapp?appId=20000067&url=${url}`
}

// 解绑支付宝
const clickUnBound = async () => {
  try {
    $toast.loading()
    const res = await api.post('/pinball/user/alipay/unbind')
    $toast.close()
    if (res.code === 200) {
      $toast.info('支付宝解绑成功')
      showAplipayBindInfoPopup.value = false
      getUserInfo()
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 获取用户信息
const getUserInfo = async () => {
  const res = await api.post('/pinball/user/info/getUserInfo')
  if (res.code === 200) {
    localStorage.setItem('userInfo', JSON.stringify(res.data))
    userInfo.value = res.data
    if (userInfo.value.alipayBound) {
      getBindInfo()
    } else {
      bindInfo.value = {}
    }
  }
}

// 查询支付宝绑定信息
const getBindInfo = async () => {
  try {
    $toast.loading()
    const res = await api.post('/pinball/user/alipay/getBindInfo')
    $toast.close()
    if (res.code === 200) {
      bindInfo.value = res.data || {}
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const loginConfirm = () => {
  $modal.show({
    content: '是否退出登陆',
    onConfirm: () => {
      logout()
    },
  })
}

const logout = async () => {
  try {
    $toast.loading()
    const res = await api.post('/pinball/user/auth/logout')
    $toast.close()
    if (res.code === 200) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.replace({ name: 'login' })
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.setting {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #f8f8f8;
    padding: .vw(8) [] .vw(18) [];

    .module {
      border-radius: .vw(9) [];
      background-color: var(--white--);
      padding: .vw(9) [] 0;

      &:not(:last-of-type) {
        margin-bottom: .vw(8) [];
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .vw(16) [];

        .text {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 400;
          font-style: normal;
        }

        .icon {
          width: .vw(14) [];
          height: .vw(14) [];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/arrow-right.png);
        }
      }
    }
  }

  .footer {
    padding: .vw(12) [] .vw(18) [];

    .button {
      background-color: #ededf0;
    }
  }
}

.popup-content {
  max-height: 70vh;
  padding: .vw(18)[] 0;

  .title {
    color: var(--light-text--);
    font-family: 'PingFang SC';
    font-size: .vw(18) [];
    line-height: .vw(18) [];
    font-weight: 500;
    font-style: normal;
    text-align: center;
    margin-bottom: .vw(20)[];
  }

  .info {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: .vw(15)[] .vw(18)[];

    .avatar {
      width: .vw(60)[];
      height: .vw(60)[];
      border-radius: .vw(45)[];
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-bottom: .vw(12)[];

      img {
        width: 100%;
      }
    }
  }
}
</style>

<template>
  <main class="alipay-callback">
    <div class="content">
      <!-- 加载中 -->
      <template v-if="status === 'loading'">
        <img class="icon" src="@/assets/images/recharge-success-icon.png" alt="" />
        <p class="title">支付宝授权中...</p>
      </template>
      <!-- 成功 -->
      <template v-if="status === 'success'">
        <img class="icon" src="@/assets/images/recharge-success-icon.png" alt="" />
        <p class="title">授权成功</p>
      </template>
      <!-- 失败 -->
      <template v-if="status === 'fail'">
        <img class="icon" src="@/assets/images/recharge-success-icon.png" alt="" />
        <p class="title">授权失败</p>
        <p class="desc">{{ errorMsg }}</p>
      </template>
    </div>
    <div class="footer" v-if="status !== 'loading'">
      <div class="btn" :class="{ primary: status === 'success' }" @click="handleAction">
        {{ status === 'success' ? '返回首页' : '重新授权' }}
      </div>
      <div class="btn" v-if="status === 'fail'" @click="goLogin">返回登录</div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const status = ref('loading')
const errorMsg = ref('')

onMounted(() => {
  handleCallback()
})

const handleCallback = async () => {
  const authCode = route.query.auth_code
  if (!authCode) {
    status.value = 'fail'
    errorMsg.value = '未获取到授权码'
    return
  }
  try {
    const res = await api.post('/pinball/user/auth/alipayAuth', { auth_code: authCode })
    if (res.code === 200) {
      const { access_token } = res.data
      localStorage.setItem('token', access_token)
      status.value = 'success'
      await getUserInfo()
    }
  } catch (e) {
    status.value = 'fail'
    errorMsg.value = '授权失败，请重试'
  }
}

const getUserInfo = async () => {
  const res = await api.post('/pinball/user/info/getUserInfo')
  if (res.code === 200) {
    localStorage.setItem('userInfo', JSON.stringify(res.data))
  }
}

const goHome = () => {
  router.push({ name: 'home' })
}

const goLogin = () => {
  router.push({ name: 'login' })
}

const handleReAuth = () => {
  status.value = 'loading'
  handleCallback()
}

const handleAction = () => {
  if (status.value === 'success') {
    goHome()
  } else {
    handleReAuth()
  }
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.alipay-callback {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(180deg, #f0edde 0%, #f5f6fa 50%);

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .icon {
      width: .vw(80) [];
      height: .vw(80) [];
      margin-bottom: .vw(24) [];
    }

    .title {
      color: var(--light-text--);
      font-family: 'PingFang SC';
      font-size: .vw(20) [];
      line-height: .vw(28) [];
      font-weight: 600;
      font-style: normal;
      margin-bottom: .vw(8) [];
    }

    .desc {
      color: var(--text--);
      font-family: 'PingFang SC';
      font-size: .vw(14) [];
      line-height: .vw(20) [];
      font-weight: 400;
      font-style: normal;
    }
  }

  .footer {
    display: flex;
    padding: 0 .vw(16) [] .vw(40) [];

    .btn {
      flex: 1;
      height: .vw(48) [];
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--light-text--);
      font-family: 'PingFang SC';
      font-size: .vw(16) [];
      line-height: .vw(16) [];
      font-weight: 500;
      font-style: normal;
      border-radius: .vw(45) [];
      background-color: var(--white--);
      border: .vw(1) [] solid #ddd;

      &:not(:last-of-type) {
        margin-right: .vw(16) [];
      }

      &.primary {
        color: var(--white--);
        background: linear-gradient(135deg, #ffd332 0%, #ffb169 100%);
        border: none;
      }
    }
  }
}
</style>

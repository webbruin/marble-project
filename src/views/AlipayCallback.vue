<template>
  <main class="alipay-callback">
    <div class="content">
      <!-- 加载中 -->
      <template v-if="status === 'loading'">
        <p class="title">支付宝绑定中...</p>
      </template>
      <!-- 成功 -->
      <template v-if="status === 'success'">
        <img class="icon" src="@/assets/images/recharge-success-icon.png" alt="" />
        <p class="title">支付宝绑定成功</p>
      </template>
      <!-- 失败 -->
      <template v-if="status === 'fail'">
        <p class="title">支付宝绑定失败</p>
        <p class="desc">{{ errorMsg }}</p>
      </template>
    </div>
    <div class="footer" v-if="status !== 'loading'">
      <div class="btn primary">请手动切回浏览器</div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const status = ref('success')
const errorMsg = ref('')

onMounted(() => {
  handleCallback()
})

const handleCallback = async () => {
  const authCode = route.query.auth_code
  if (!authCode) {
    status.value = 'fail'
    errorMsg.value = '未获取到绑定码'
    return
  }
  try {
    const res = await api.post('/pinball/user/alipay/bind', { authCode: authCode })
    if (res.code === 200) {
      status.value = 'success'
      getUserInfo()
    }
  } catch (e) {
    // $toast.info(`${JSON.stringify(e)}`, 1000 * 15)
    status.value = 'fail'
    errorMsg.value = '绑定失败，请重试'
  }
}

const getUserInfo = async () => {
  const res = await api.post('/pinball/user/info/getUserInfo')
  if (res.code === 200) {
    localStorage.setItem('userInfo', JSON.stringify(res.data))
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

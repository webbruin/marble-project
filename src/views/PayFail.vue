<template>
  <main class="pay-fail">
    <div class="content">
      <div class="icon">
        <span class="icon-text">!</span>
      </div>
      <p class="title">支付失败</p>
      <p class="desc">订单未支付成功，请重试</p>
      <p class="desc sub" v-if="orderNo">订单号：{{ orderNo }}</p>
    </div>
    <div class="footer">
      <div class="btn primary" @click="goHome">返回首页</div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderNo = ref('')

onMounted(() => {
  orderNo.value = route.query.orderNo || ''
})

const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.pay-fail {
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
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: var(--red--);
      margin-bottom: .vw(24) [];

      .icon-text {
        color: var(--white--);
        font-size: .vw(48) [];
        font-weight: 700;
        line-height: 1;
      }
    }

    .title {
      color: var(--red--);
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

      &.sub {
        font-size: .vw(12) [];
        margin-top: .vw(4) [];
      }
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

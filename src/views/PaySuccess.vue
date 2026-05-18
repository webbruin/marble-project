<template>
  <main class="pay-success">
    <div class="content">
      <img class="icon" src="@/assets/images/recharge-success-icon.png" alt="" />
      <p class="title">支付成功</p>
      <p class="desc" v-if="orderNo">订单号：{{ orderNo }}</p>
      <p class="desc" v-if="amount">支付金额：{{ amount }}</p>
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
const amount = ref('')

onMounted(() => {
  orderNo.value = route.query.orderNo || ''
  amount.value = route.query.amount || ''
})

const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.pay-success {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(180deg, #F0EDDE 0%, #F5F6FA 50%);

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .icon {
      width: .vw(80)[];
      height: .vw(80)[];
      margin-bottom: .vw(24)[];
    }

    .title {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(20)[];
      line-height: .vw(28)[];
      font-weight: 600;
      font-style: normal;
      margin-bottom: .vw(8)[];
    }

    .desc {
      color: var(--text--);
      font-family: "PingFang SC";
      font-size: .vw(14)[];
      line-height: .vw(20)[];
      font-weight: 400;
      font-style: normal;
    }
  }

  .footer {
    display: flex;
    padding: 0 .vw(16)[] .vw(40)[];

    .btn {
      flex: 1;
      height: .vw(48)[];
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(16)[];
      line-height: .vw(16)[];
      font-weight: 500;
      font-style: normal;
      border-radius: .vw(45)[];
      background-color: var(--white--);
      border: .vw(1)[] solid #ddd;

      &:not(:last-of-type) {
        margin-right: .vw(16)[];
      }

      &.primary {
        color: var(--white--);
        background: linear-gradient(135deg, #FFD332 0%, #FFB169 100%);
        border: none;
      }
    }
  }
}
</style>

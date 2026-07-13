<template>
  <main class="withdraw">
    <Header title="提现">
      <template #right>
        <span class="withdraw-record" @click="toWithdrawRecord">记录明细</span>
      </template>
    </Header>
    <div class="body">
      <div class="info">
        <span class="label">到账支付宝</span>
        <span class="value">{{ bindInfo.nickName }}</span>
      </div>
      <div class="model">
        <div class="title">提现金额（元）</div>
        <div class="entry">
          <input type="text" v-model="amount">
        </div>
        <div class="desc">可提现余额 {{ formatNumberWithCommas(formatToTwoDecimals(accountInfo.amount)) }} 元 <span
            @click="clickEntryAll">全部提现</span></div>
      </div>
    </div>
    <div class="footer">
      <Button buttonText="确认提现" :disabled="amount <= 0" @click="clickWithdraw"></Button>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/FormData/Button.vue'
import { formatNumberWithCommas, formatToTwoDecimals } from '@/utils'

const route = useRoute()
const router = useRouter()

const bindInfo = ref({})
const accountInfo = ref({})
const amount = ref(0)

onMounted(() => {
  init()
})

const init = async () => {
  $toast.loading()
  await getBindInfo()
  await getWithdrawAccount()
  $toast.close()
}

// 查询支付宝绑定信息
const getBindInfo = async () => {
  try {
    const res = await api.post('/pinball/user/alipay/getBindInfo')
    if (res.code === 200) {
      bindInfo.value = res.data || {}
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 查询我的提现账户
const getWithdrawAccount = async () => {
  try {
    const res = await api.post('/pinball/withdraw/account')
    if (res.code === 200) {
      accountInfo.value = res.data
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 申请提现
const getWithdrawApply = async () => {
  try {
    const res = await api.post('/pinball/withdraw/apply', { amount: amount.value })
    if (res.code === 200) {
      $toast.info(amount.value > 50 ? '提现申请成功' : '提现成功')
      amount.value = 0
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const toWithdrawRecord = async () => {
  router.push({ name: 'withdraw-record' })
}

const clickEntryAll = () => {
  amount.value = accountInfo.value.amount || 0
}

const clickWithdraw = () => {
  if (amount.value > accountInfo.value.amount) {
    $toast.info('提现金额大于可提现余额')
    return
  }
  getWithdrawApply()
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.withdraw {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;

  .withdraw-record {
    color: var(--light-text--);
    font-family: 'PingFang SC';
    font-size: .vw(16) [];
    line-height: .vw(16) [];
    font-weight: 400;
    font-style: normal;
    margin-right: .vw(12)[];
  }

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: .vw(16) [] .vw(18) [];

    .info {
      height: .vw(56)[];
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: .vw(12)[];
      background-color: #fff;
      padding: 0 .vw(12)[];
      margin-bottom: .vw(16)[];

      span {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
      }
    }

    .model {
      border-radius: .vw(12)[];
      background-color: #fff;
      padding: 0 .vw(12)[];

      .title {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(16) [];
        line-height: .vw(16) [];
        font-weight: 500;
        font-style: normal;
        padding: .vw(16)[] 0;
      }

      .entry {
        padding: .vw(16)[] 0;

        input {
          border: none;
          outline: none;
          width: 100%;
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(32) [];
          line-height: .vw(32) [];
          font-weight: 500;
          font-style: normal;
        }
      }

      .desc {
        color: var(--text--);
        font-family: 'PingFang SC';
        font-size: .vw(12) [];
        line-height: .vw(12) [];
        font-weight: 400;
        font-style: normal;
        border-top: .vw(1)[] solid #EDEDF0;
        padding-top: .vw(8)[];
        padding-bottom: .vw(12)[];

        span {
          color: var(--light-text--);
        }
      }
    }
  }

  .footer {
    padding: .vw(12) [] .vw(18) [];
    padding-bottom: .vw(20)[];
  }
}
</style>

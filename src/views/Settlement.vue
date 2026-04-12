<template>
  <main class="settlement">
    <Header title="确认订单"></Header>
    <div class="body">
      <div class="product-list">
        <div class="item" v-for="(item, index) in settlementList" :key="index">
          <div class="cover">
            <img src="@/assets/images/shop/cover.png" alt="">
          </div>
          <div class="info">
            <p class="name">​​反骨糯米糍​​</p>
            <p class="desc">规格：500克</p>
            <p class="point">积分 {{ formatNumberWithCommas(item.point) }}</p>
          </div>
          <div class="count">X{{ item.count }}</div>
        </div>
      </div>
      <div class="pay-list">
        <div class="title">请选择支付方式</div>
        <div class="item" v-for="(item, index) in payList" :key="index" @click="clickPayType(item)">
          <img :src="item.icon" alt="" class="icon">
          <span class="text">{{ item.name }}{{ item.count ? `（剩余：${item.count}）` : '' }}</span>
          <span class="select" :class="{ 'selected': payType === item.type }"></span>
        </div>
      </div>
    </div>
    <div class="aggreement">
      <div class="select" :class="{ 'selected': isAgree }" @click="isAgree = !isAgree"></div>
      <div class="text">
        为注册手机号将自动注册，勾选代表您已阅读并同意
        <span class="orange" @click.stop="clickAggrement('yhxy')">《用户协议》</span>
        和
        <span class="orange" @click.stop="clickAggrement('ysxy')">《隐私协议》</span>
      </div>
    </div>
    <div class="footer">
      <div class="info">
        <span class="text">共计：</span>
        <span class="count">153张奖励卡</span>
      </div>
      <div class="pay" @click="clickPay">确定支付</div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatNumberWithCommas } from '@/utils'

const router = useRouter()

const settlementList = ref([
  { count: 1, point: 1000 },
  { count: 1, point: 1000 },
  { count: 1, point: 1000 },
])
const payList = ref([
  {
    icon: new URL(`@/assets/images/point.png`, import.meta.url).href,
    name: '奖励卡支付',
    type: 'point',
    count: 6
  },
  {
    icon: new URL(`@/assets/images/alipay.png`, import.meta.url).href,
    name: '支付宝支付',
    type: 'alipay',
  },
])
const payType = ref('')
const isAgree = ref(false)

onMounted(() => {

})

const clickPayType = (item) => {
  if (payType.value === item.type) {
    return
  }
  payType.value = item.type
}

const clickAggrement = (type) => {
  router.push({ name: 'aggrement', params: { type } });
}

const clickPay = () => {
  if (!payType.value) {
    $toast.info('请选择支付方式')
    return
  }
  if (!isAgree.value) {
    $modal.show({
      content: '您是否已阅读并同意《用户协议》和《隐私协议》',
      onConfirm: () => {
        isAgree.value = true
        clickPay()
      }
    })
    return
  }
  console.log(111, settlementList.value);
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.settlement {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F5F6FA;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: .vw(12)[] .vw(16)[];

    .product-list {
      .item {
        display: flex;
        align-items: center;
        border-radius: .vw(6)[];
        background-color: var(--white--);
        padding: .vw(16)[];
        margin-bottom: .vw(24)[];

        &:not(:last-of-type) {
          margin-bottom: .vw(8)[];
        }

        .cover {
          width: .vw(56)[];
          height: .vw(56)[];
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: .vw(8)[];

          img {
            max-width: 100%;
            max-height: 100%;
          }
        }

        .info {
          flex: 1;

          .name {
            color: var(--light-text--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
            margin-bottom: .vw(6)[];
          }

          .desc {
            color: var(--text--);
            font-family: "PingFang SC";
            font-size: .vw(12)[];
            line-height: .vw(12)[];
            font-weight: 400;
            font-style: normal;
            margin-bottom: .vw(6)[];
          }

          .point {
            color: var(--orange--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
          }
        }

        .count {
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 500;
          font-style: normal;
        }
      }
    }

    .pay-list {
      .title {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 500;
        font-style: normal;
        margin-bottom: .vw(8)[];
      }

      .item {
        display: flex;
        align-items: center;
        border-radius: .vw(12)[];
        background-color: var(--white--);
        padding: .vw(12)[];

        &:not(:last-of-type) {
          margin-bottom: .vw(8)[];
        }

        .icon {
          width: .vw(24)[];
          height: .vw(24)[];
          margin-right: .vw(8)[];
        }

        .text {
          flex: 1;
          color: var(--light-text--);
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 500;
          font-style: normal;
        }

        .select {
          width: .vw(24)[];
          height: .vw(24)[];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/shop/select.png);
          margin-left: .vw(8)[];

          &.selected {
            background-image: url(@/assets/images/shop/selected.png);
          }
        }
      }
    }
  }

  .aggreement {
    display: flex;
    padding: .vw(8)[] .vw(15)[];

    .select {
      min-width: .vw(20)[];
      height: .vw(20)[];
      background-size: 85%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/shop/select.png);
      margin-right: .vw(6)[];

      &.selected {
        background-image: url(@/assets/images/shop/selected.png);
      }
    }

    .text {
      color: var(--text--);
      font-family: "PingFang SC";
      font-size: .vw(14)[];
      line-height: .vw(20)[];
      font-weight: 400;
      font-style: normal;

      .orange {
        color: #FFB169;
      }
    }
  }

  .footer {
    width: 100%;
    height: .vw(64)[];
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--white--);
    padding: 0 .vw(16)[];

    .info {
      display: flex;
      align-items: flex-end;

      .text {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(12)[];
        line-height: .vw(16)[];
        font-weight: 400;
        font-style: normal;
      }

      .count {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(18)[];
        line-height: .vw(18)[];
        font-weight: 400;
        font-style: normal;
      }
    }

    .pay {
      width: .vw(112)[];
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
      background-color: #FFB169;
    }
  }
}
</style>
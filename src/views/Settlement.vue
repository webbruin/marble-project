<template>
  <main class="settlement">
    <Header title="确认订单"></Header>
    <div class="body">
      <div class="address">
        <div class="title">收货地址</div>
        <div class="item" @click="clickSelectAddress">
          <div class="info">
            <template v-if="address.addressId">
              <div class="text">{{ address.recipientName }} {{ address.recipientPhone }}</div>
              <div class="text">
                {{ address.province }} {{ address.city }} {{ address.district }}
                {{ address.detailAddress }}
              </div>
            </template>
            <template v-else>
              <div class="desc">请选择地址</div>
            </template>
          </div>
        </div>
      </div>
      <div class="product-list">
        <div class="item" v-for="(item, index) in settlementList" :key="index">
          <div class="cover">
            <img :src="item.productImage" alt="" />
          </div>
          <div class="info">
            <p class="name">{{ item.productName }}</p>
            <p class="desc">规格：{{ item.skuName }}</p>
            <p class="point">积分 {{ formatNumberWithCommas(item.price) }}</p>
          </div>
          <div class="count">X{{ item.quantity }}</div>
        </div>
      </div>
      <div class="pay-list">
        <div class="title">支付方式</div>
        <div class="item" v-for="(item, index) in payList" :key="index" @click="clickPayType(item)">
          <img :src="item.icon" alt="" class="icon" />
          <span class="text">
            {{ item.name }}
            {{ item.type === 'point' ? `（剩余：${cardAmount}）` : '' }}
          </span>
          <span class="select" :class="{ selected: payType === item.type }"></span>
        </div>
      </div>
    </div>
    <div class="aggreement">
      <div class="select" :class="{ selected: isAgree }" @click="isAgree = !isAgree"></div>
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
        <span class="count">{{ formatNumberWithCommas(selectedPrice) }}积分</span>
      </div>
      <div class="pay" @click="clickPay">确定支付</div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatNumberWithCommas } from '@/utils'

const route = useRoute()
const router = useRouter()

const params = ref({
  addressId: '',
  cartIds: [],
  remark: '',
})
const paramsByDirect = ref({
  addressId: '',
  productId: '',
  skuId: '',
  quantity: '',
  remark: '',
})
const settlementList = ref([])
const payList = ref([
  {
    icon: new URL(`@/assets/images/point.png`, import.meta.url).href,
    name: '积分支付',
    type: 'point',
  },
])
const address = ref({})
const cardAmount = ref(0)
const payType = ref('point')
const isAgree = ref(false)

onMounted(() => {
  getPointCardAmount()
  init()
})

const init = async () => {
  settlementList.value = JSON.parse(localStorage.getItem('selectCart')) || []
  if (route.params.source === 'cart') {
    params.value.cartIds = settlementList.value.map((item) => item.cartId)
  }
  if (route.params.source === 'product-detail') {
    paramsByDirect.value.productId = settlementList.value[0].productId
    paramsByDirect.value.skuId = settlementList.value[0].skuId
    paramsByDirect.value.quantity = settlementList.value[0].quantity
  }
  if (localStorage.getItem('selectAddress')) {
    address.value = JSON.parse(localStorage.getItem('selectAddress'))
    if (route.params.source === 'cart') {
      params.value.addressId = address.value.addressId || ''
    }
    if (route.params.source === 'product-detail') {
      paramsByDirect.value.addressId = address.value.addressId || ''
    }
  } else {
    await getDefaultAddress()
  }
}

const getDefaultAddress = async () => {
  try {
    const res = await api.post('/pinball/shop/address/list', {})
    if (res.code === 200) {
      address.value = res.data.find((item) => item.isDefault === 1) || {}
      if (route.params.source === 'cart') {
        params.value.addressId = address.value.addressId || ''
      }
      if (route.params.source === 'product-detail') {
        paramsByDirect.value.addressId = address.value.addressId || ''
      }
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 查询当前用户积分余额
const getPointCardAmount = async () => {
  try {
    const res = await api.post('/pinball/user/account/getPointCardAmount')
    if (res.code === 200) {
      cardAmount.value = +res.data
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const selectedPrice = computed(() => {
  if (settlementList.value.length) {
    return settlementList.value
      .map((item) => item.quantity * item.price)
      .reduce((a, b) => (a || 0) + (b || 0))
  }
  return 0
})

const clickSelectAddress = () => {
  router.push({ name: 'address', params: { type: 'select' } })
}

const clickPayType = (item) => {
  if (payType.value === item.type) {
    return
  }
  payType.value = item.type
}

const clickAggrement = (type) => {
  router.push({ name: 'aggrement', params: { type } })
}

const clickPay = () => {
  if (!params.value.addressId && !paramsByDirect.value.addressId) {
    $toast.info('请选择收货地址')
    return
  }
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
      },
    })
    return
  }
  if (route.params.source === 'cart') {
    createByCart()
  }
  if (route.params.source === 'product-detail') {
    createByDirect()
  }
}

const createByCart = async () => {
  $toast.loading('订单创建中')
  try {
    const res = await api.post('/pinball/shop/order/createByCart', params.value)
    $toast.close()
    if (res.code === 200) {
      orderPay(res.data)
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const createByDirect = async () => {
  $toast.loading('订单创建中')
  try {
    const res = await api.post('/pinball/shop/order/createByDirect', paramsByDirect.value)
    $toast.close()
    if (res.code === 200) {
      orderPay(res.data)
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const orderPay = async (orderId) => {
  $toast.loading('订单支付中')
  try {
    const res = await api.post('/pinball/shop/order/pay', { orderId })
    $toast.close()
    if (res.code === 200) {
      $toast.info('支付成功')
      const timer = setTimeout(() => {
        clearTimeout(timer)
        router.push({ name: 'order' })
      }, 1500)
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

.settlement {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f6fa;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: .vw(12) [] .vw(16) [];

    .address {
      .title {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 500;
        font-style: normal;
        margin-bottom: .vw(8) [];
      }

      .item {
        display: flex;
        align-items: center;
        border-radius: .vw(12) [];
        background-color: var(--white--);
        padding: .vw(12) [];
        margin-bottom: .vw(12) [];

        &::after {
          content: '';
          width: .vw(14) [];
          height: .vw(14) [];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/arrow-right.png);
          margin-left: .vw(10) [];
        }

        .info {
          flex: 1;

          .desc {
            color: var(--text--);
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
            font-weight: 400;
          }

          .text {
            color: var(--light-text--);
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
            font-weight: 400;
            font-style: normal;

            &:not(:last-of-type) {
              margin-bottom: .vw(10) [];
            }
          }
        }
      }
    }

    .product-list {
      .item {
        display: flex;
        align-items: center;
        border-radius: .vw(6) [];
        background-color: var(--white--);
        padding: .vw(16) [];
        margin-bottom: .vw(12) [];

        &:not(:last-of-type) {
          margin-bottom: .vw(8) [];
        }

        .cover {
          width: .vw(56) [];
          height: .vw(56) [];
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: .vw(8) [];

          img {
            max-width: 100%;
            max-height: 100%;
          }
        }

        .info {
          flex: 1;

          .name {
            color: var(--light-text--);
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
            font-weight: 500;
            font-style: normal;
            margin-bottom: .vw(6) [];
          }

          .desc {
            color: var(--text--);
            font-family: 'PingFang SC';
            font-size: .vw(12) [];
            line-height: .vw(12) [];
            font-weight: 400;
            font-style: normal;
            margin-bottom: .vw(6) [];
          }

          .point {
            color: var(--orange--);
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
            font-weight: 500;
            font-style: normal;
          }
        }

        .count {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 500;
          font-style: normal;
        }
      }
    }

    .pay-list {
      .title {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 500;
        font-style: normal;
        margin-bottom: .vw(8) [];
      }

      .item {
        display: flex;
        align-items: center;
        border-radius: .vw(12) [];
        background-color: var(--white--);
        padding: .vw(12) [];

        &:not(:last-of-type) {
          margin-bottom: .vw(8) [];
        }

        .icon {
          width: .vw(24) [];
          height: .vw(24) [];
          margin-right: .vw(8) [];
        }

        .text {
          flex: 1;
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 500;
          font-style: normal;
        }

        .select {
          width: .vw(24) [];
          height: .vw(24) [];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/shop/select.png);
          margin-left: .vw(8) [];

          &.selected {
            background-image: url(@/assets/images/shop/selected.png);
          }
        }
      }
    }
  }

  .aggreement {
    display: flex;
    padding: .vw(8) [] .vw(15) [];

    .select {
      min-width: .vw(20) [];
      height: .vw(20) [];
      background-size: 85%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/shop/select.png);
      margin-right: .vw(6) [];

      &.selected {
        background-image: url(@/assets/images/shop/selected.png);
      }
    }

    .text {
      color: var(--text--);
      font-family: 'PingFang SC';
      font-size: .vw(14) [];
      line-height: .vw(20) [];
      font-weight: 400;
      font-style: normal;

      .orange {
        color: #ffb169;
      }
    }
  }

  .footer {
    width: 100%;
    height: .vw(64) [];
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--white--);
    padding: 0 .vw(16) [];

    .info {
      display: flex;
      align-items: flex-end;

      .text {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(12) [];
        line-height: .vw(16) [];
        font-weight: 400;
        font-style: normal;
      }

      .count {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(18) [];
        line-height: .vw(18) [];
        font-weight: 400;
        font-style: normal;
      }
    }

    .pay {
      width: .vw(112) [];
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
      background-color: #ffb169;
    }
  }
}
</style>

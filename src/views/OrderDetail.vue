<template>
  <main class="order-detail">
    <Header :title="getOrderStatusName(orderStatus)"></Header>
    <div class="body">
      <template v-if="orderData.orderStatus < 4">
        <!-- 地址 -->
        <div class="address">
          <div class="info">{{ orderData.recipientName }} {{ orderData.recipientPhone }}</div>
          <div class="info">{{ orderData.recipientAddress }}</div>
        </div>
        <!-- 物流 -->
        <div class="address">
          <div class="title">
            <span class="text">物流信息</span>
          </div>
          <div class="info">运输状态：{{ orderData.logistics?.logisticsStatus || '暂无' }}</div>
          <div class="info">物流公司：{{ orderData.logistics?.logisticsCompany || '暂无' }}</div>
          <div class="info">物流单号：{{ orderData.logistics?.logisticsNo || '暂无' }}</div>
          <van-button v-if="orderData.logistics" type="default" size="small" @click="openTrack">
            查看物流轨迹
          </van-button>
        </div>
        <!-- 配送时间及商品信息 -->
        <div class="sku">
          <!-- <div class="title">
          <span class="text">{{ orderData.orderStatus === 1 ? '发货时间' : '送达时间' }}</span>
          <span class="date">(预计3月21日 11:21送达)</span>
        </div> -->
          <div class="info" v-if="orderData.items && orderData.items.length">
            <div class="cover-list">
              <div class="cover" v-for="(item, index) in orderData.items" :key="index">
                <img :src="item.productImage" alt="">
                <span class="num">X{{ item.quantity }}</span>
              </div>
            </div>
            <div class="count">共{{ allCount }}件</div>
          </div>
        </div>
        <!-- 合计积分 -->
        <div class="total-point">
          <div class="text">合计积分</div>
          <div class="count">{{ formatNumberWithCommas(formatToTwoDecimals(orderData.totalAmount)) }}</div>
        </div>
      </template>

      <template v-if="orderData.orderStatus === 4 || orderData.orderStatus === 5">
        <!-- 地址 -->
        <div class="address">
          <div class="title">
            <span class="text" v-if="orderData.orderStatus === 4">申请退款</span>
            <span class="text" v-if="orderData.orderStatus === 5">退款完成</span>
          </div>
          <div class="info" v-if="orderData.orderStatus === 4">您已提交退款申请，请联系客服处理</div>
          <div class="info" v-if="orderData.orderStatus === 5">您的退款申请{{ refundAudit.refundStatus === 2 ? '失败' : '成功'
            }}，请联系客服处理</div>
        </div>
        <!-- 退积分 -->
        <div class="total-point">
          <div class="text">退积分</div>
          <div class="count">{{ formatNumberWithCommas(formatToTwoDecimals(orderData.totalAmount)) }}</div>
        </div>
        <!-- 退款审批 -->
        <div class="return-audit">
          <div class="title">退款审批</div>
          <div class="progress">
            <div class="point" :class="{ 'light': refundAudit.refundStatus >= 0 }">
              提交申请
            </div>
            <div class="point" :class="{ 'light': refundAudit.refundStatus >= 2 }">
              审核{{ refundAudit.refundStatus === 2 ? '拒绝' : '通过' }}
            </div>
            <div class="point" :class="{ 'light': refundAudit.refundStatus >= 3 }">
              退款{{ refundAudit.refundStatus === 2 ? '失败' : '成功' }}
            </div>
            <div class="bar">
              <div class="percentage" :style="{ 'width': refundAudit.refundProgress }"></div>
            </div>
          </div>
        </div>
        <!-- 退款信息 -->
        <div class="return-info">
          <div class="title">退款信息</div>
          <div class="product-list" v-if="orderData.items && orderData.items.length">
            <div class="product" v-for="(item, index) in orderData.items" :key="index">
              <div class="cover">
                <img :src="item.productImage" alt="">
              </div>
              <div class="info">
                <span class="spu-name">{{ item.productName }}</span>
                <span class="text">规格：{{ item.skuName }}</span>
                <span class="text">单价：{{ formatNumberWithCommas(formatToTwoDecimals(item.price)) }}{{ item.pointType ===
                  0 ? '积分' : '会员积分'
                }}</span>
                <span class="text">数量：{{ item.quantity }}</span>
              </div>
              <div class="point">积分{{ formatNumberWithCommas(formatToTwoDecimals(item.quantity * item.price)) }}</div>
            </div>
          </div>
          <div class="total">
            <span class="text">合计积分</span>
            <span class="point">{{ formatNumberWithCommas(formatToTwoDecimals(allPoint)) }}</span>
          </div>
        </div>
      </template>

      <!-- 其他信息 -->
      <div class="other-info">
        <div class="row" v-if="orderData.orderStatus === 4 || orderData.orderStatus === 5">
          <span class="key">退款原因</span>
          <span class="value bold">{{ orderData.refund?.refundReason }}</span>
        </div>
        <div class="row">
          <span class="key">下单编号</span>
          <span class="value">{{ orderData.orderId }}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <template v-if="orderData.orderStatus === 1">
        <div class="button1" @click="openApplyRefund">申请退款</div>
      </template>
      <template v-if="orderData.orderStatus === 2">
        <div class="button1" @click="openApplyRefund">申请退款</div>
        <div class="button2" @click="clickConfirmReceive">确认收货</div>
      </template>
      <template v-if="orderData.orderStatus === 3">
        <div class="button1" @click="clickPlaceOrderAgain">再来一单</div>
        <div class="button2" @click="clickConfirmReceive">确认收货</div>
      </template>
      <template v-if="orderData.orderStatus === 4">
        <div class="button2" @click="clickRefundCancel">取消退款</div>
      </template>
      <template v-if="orderData.orderStatus === 5">
        <div class="button1" @click="clickPlaceOrderAgain">再来一单</div>
      </template>
    </div>
  </main>

  <!-- 申请退款弹窗  -->
  <van-popup v-model:show="showApplyRefundPopup" position="bottom">
    <div class="popup-content">
      <div class="title">退款申请</div>
      <div class="formdata">
        <div class="item">
          <Input v-model="refundReason" type="text" placeholder="请输入退款原因"></Input>
        </div>
      </div>
      <div class="submit">
        <Button buttonText="提交" @click="clickApplyRefund"></Button>
      </div>
    </div>
  </van-popup>

  <!-- 物流轨迹弹窗  -->
  <van-popup v-model:show="showlogisticsTrackPopup" position="bottom" closeable>
    <div class="popup-content">
      <div class="title">物流轨迹</div>
      <van-steps direction="vertical" :active="0" active-color="#FFB169">
        <template v-for="(item, index) in trackList" :key="index">
          <van-step>
            <div>
              <span class="track-status">{{ item.status }}</span>
              <span class="track-time">{{ item.ftime }}</span>
            </div>
            <div class="track-context">{{ item.context }}</div>
          </van-step>
        </template>
      </van-steps>
    </div>
  </van-popup>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Input from '@/components/FormData/Input.vue'
import Button from '@/components/FormData/Button.vue'
import { formatNumberWithCommas, formatToTwoDecimals, getOrderStatusName } from '@/utils'

const route = useRoute()
const router = useRouter()

const orderId = ref(route.params.orderId)
const orderStatus = ref(route.query.orderStatus)
const orderData = ref({})
const trackList = ref([])
const showApplyRefundPopup = ref(false)
const refundReason = ref('')
const showlogisticsTrackPopup = ref(false)

onMounted(() => {
  init()
})

const init = async () => {
  $toast.loading()
  await getOrderDetail()
  $toast.close()
}

const getOrderDetail = async () => {
  try {
    const res = await api.post('/pinball/shop/order/detail', { orderId: orderId.value })
    if (res.code === 200) {
      orderData.value = res.data
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const queryLogistics = async () => {
  try {
    $toast.loading()
    const res = await api.post('/pinball/shop/logistics/query', { orderId: orderId.value })
    $toast.close()
    if (res.code === 200) {
      trackList.value = res.data.trackList || []
      showlogisticsTrackPopup.value = true
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const openTrack = () => {
  if (orderData.value.orderStatus > 3) {
    return
  }
  queryLogistics()
}

const allCount = computed(() => {
  return (orderData.value.items || []).map(item => item.quantity).reduce((a, b) => a + b)
})

const allPoint = computed(() => {
  return (orderData.value.items || []).map(item => item.quantity * item.price).reduce((a, b) => a + b)
})

const refundAudit = computed(() => {
  const { refundStatus } = orderData.value.refund || {}
  let progress = 0
  switch (refundStatus) {
    case 0: progress = '0%'
      break
    case 1:
    case 2: progress = '50%'
      break
    case 3: progress = '100%'
      break
  }
  return {
    refundStatus,
    refundProgress: progress
  }
})

// 申请退款
const openApplyRefund = () => {
  showApplyRefundPopup.value = true
}

// 提交：申请退款
const clickApplyRefund = async () => {
  if (!refundReason.value) {
    $toast.info('请输入退款原因')
    return
  }
  try {
    $toast.loading()
    const res = await api.post('/pinball/shop/refund/apply', {
      orderId: orderId.value,
      refundReason: refundReason.value
    })
    $toast.close()
    if (res.code === 200) {
      showApplyRefundPopup.value = false
      refundReason.value = ''
      $toast.info('申请退款成功')
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 确认收货
const clickConfirmReceive = () => {
  $modal.show({
    content: '确定要确认收货吗？',
    onConfirm: async () => {
      try {
        $toast.loading()
        const res = await api.post('/pinball/shop/order/confirmReceive', { orderId: orderId.value })
        $toast.close()
        if (res.code === 200) {
          $toast.info('确认收货成功')
        }
      } catch (e) {
        $toast.info('系统错误')
      }
    },
  })
}

// 取消退款
const clickRefundCancel = () => {
  $modal.show({
    content: '确定要取消退款吗？',
    onConfirm: async () => {
      try {
        $toast.loading()
        const res = await api.post('/pinball/shop/refund/cancel', { orderId: orderId.value })
        $toast.close()
        if (res.code === 200) {
          $toast.info('取消退款成功')
        }
      } catch (e) {
        $toast.info('系统错误')
      }
    },
  })
}

// 再来一单
const clickPlaceOrderAgain = () => {
  localStorage.setItem('selectCart', JSON.stringify(orderData.value.items))
  localStorage.removeItem('selectAddress')
  router.push({ name: 'settlement', params: { source: 'order' } })
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.order-detail {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #f8f8f8;
    padding: .vw(8) [] .vw(18) [];

    >div {
      &:not(:last-of-type) {
        margin-bottom: .vw(8)[];
      }
    }

    .pay {
      display: flex;
      align-items: center;
      flex-direction: column;
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .point {
        padding: .vw(8)[] 0;
        margin-bottom: .vw(6)[];

        .text {
          color: #50525C;
          font-family: 'PingFang SC';
          font-size: .vw(16) [];
          line-height: .vw(24) [];
          font-weight: 500;
          font-style: normal;
        }

        .count {
          color: #FF7716;
          font-family: 'PingFang SC';
          font-size: .vw(24) [];
          line-height: .vw(24) [];
          font-weight: 500;
          font-style: normal;
        }
      }

      .countdown {
        color: var(--text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
        padding: .vw(8)[] 0;
        margin-bottom: .vw(6)[];

        span {
          color: #FF7716;
        }
      }

      .buttons {
        display: flex;
        align-items: center;

        div {
          width: .vw(145)[];
          height: .vw(48)[];
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(16) [];
          line-height: .vw(16) [];
          font-style: normal;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: .vw(45)[];

          &:not(:last-of-type) {
            margin-right: .vw(16)[];
          }
        }

        .cancel {
          font-weight: 400;
          border: 1px solid #EDEDF0;
          background-color: #fff;
        }

        .continue {
          font-weight: 500;
          border: 1px solid transparent;
          background-color: #FFB169;
        }
      }
    }

    .address {
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .vw(8)[] 0;

        .text {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(16) [];
          line-height: .vw(16) [];
          font-weight: 500;
          font-style: normal;
        }

        .arrow {
          width: .vw(14) [];
          height: .vw(14) [];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/arrow-right.png);
        }
      }

      .info {
        color: var(--text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
        padding: .vw(8)[] 0;
      }
    }

    .sku {
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: .vw(8)[];

        .text {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 400;
          font-style: normal;
        }

        .date {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 400;
          font-style: normal;
        }
      }

      .info {
        display: flex;
        align-items: center;

        .cover-list {
          flex: 1;
          display: flex;
          align-items: center;
          overflow-x: auto;
          overflow-y: hidden;

          .cover {
            min-width: .vw(56)[];
            width: .vw(56) [];
            height: .vw(56) [];
            position: relative;

            img {
              max-width: 100%;
              max-height: 100%;
              border-radius: .vw(6)[];
            }

            .num {
              color: #FF7716;
              font-family: 'PingFang SC';
              font-size: .vw(7) [];
              line-height: .vw(7) [];
              font-weight: 400;
              font-style: normal;
              border-radius: .vw(45)[];
              border: .vw(1)[] solid #fff;
              background-color: #FFE3E3;
              padding: .vw(1)[] .vw(3)[];
              position: absolute;
              left: .vw(8)[];
              bottom: .vw(4)[];
            }
          }
        }

        .count {
          height: .vw(56) [];
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(10) [];
          line-height: .vw(10) [];
          font-weight: 400;
          font-style: normal;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: .vw(-8)[] 0 .vw(8)[] .vw(-4)[] rgba(0, 0, 0, 0.15);
          padding: 0 .vw(6)[];
        }
      }
    }

    .total-point {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .text {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 500;
        font-style: normal;
      }

      .count {
        color: #FF7716;
        font-family: 'PingFang SC';
        font-size: .vw(24) [];
        line-height: .vw(24) [];
        font-weight: 500;
        font-style: normal;
      }
    }

    .return-audit {
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .title {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 500;
        font-style: normal;
        margin-bottom: .vw(8)[];
      }

      .progress {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;

        .point {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(12) [];
          line-height: .vw(17) [];
          font-weight: 500;
          font-style: normal;
          display: flex;
          align-items: center;
          flex-direction: column;

          &::before {
            content: '';
            width: .vw(18)[];
            height: .vw(18)[];
            border-radius: 50%;
            background-color: #E3E3E4;
            margin-bottom: .vw(4)[];
            z-index: 2;
          }

          &.light {
            color: var(--light-text--);

            &::before {
              background-color: #FF7716;
            }
          }
        }

        .bar {
          width: 86%;
          height: .vw(4)[];
          border-radius: .vw(45)[];
          background-color: #E3E3E4;
          overflow: hidden;
          position: absolute;
          left: .vw(23)[];
          top: .vw(8)[];

          .percentage {
            width: 0%;
            height: 100%;
            border-radius: .vw(45)[];
            background-color: #FF7716;
          }
        }
      }
    }

    .return-info {
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[] 0;

      .title {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 500;
        font-style: normal;
        margin-bottom: .vw(8)[];
      }

      .product-list {
        .product {
          display: flex;
          padding: .vw(8)[];
          margin-bottom: .vw(8)[];

          &:not(:last-of-type) {
            border-bottom: 1px solid #E3E3E4;
          }

          .cover {
            min-width: .vw(64)[];
            width: .vw(64) [];
            height: .vw(64) [];
            margin-right: .vw(4)[];

            img {
              max-width: 100%;
              max-height: 100%;
              border-radius: .vw(6)[];
            }
          }

          .info {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-right: .vw(4)[];

            span {
              &:not(:last-of-type) {
                margin-bottom: .vw(4)[];
              }
            }

            .spu-name {
              color: var(--light-text--);
              font-family: 'PingFang SC';
              font-size: .vw(14) [];
              line-height: .vw(14) [];
              font-weight: 500;
              font-style: normal;
            }

            .text {
              color: var(--text--);
              font-family: 'PingFang SC';
              font-size: .vw(12) [];
              line-height: .vw(12) [];
              font-weight: 400;
              font-style: normal;
            }
          }

          .point {
            color: var(--light-text--);
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
            font-weight: 500;
            font-style: normal;
          }
        }
      }

      .total {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 .vw(8)[];

        .text {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 500;
          font-style: normal;
        }

        .point {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 500;
          font-style: normal;
        }
      }
    }

    .other-info {
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .vw(12)[] 0;

        &:not(:last-of-type) {
          margin-bottom: .vw(8)[];
        }

        .key {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(12) [];
          line-height: .vw(12) [];
          font-weight: 400;
          font-style: normal;
        }

        .value {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(12) [];
          line-height: .vw(12) [];
          font-weight: 400;
          font-style: normal;

          &.bold {
            color: var(--light-text--);
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
            font-weight: 500;
            font-style: normal;
          }
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: .vw(72) [];
    display: flex;
    align-items: center;
    padding: 0 .vw(8)[];

    div {
      flex: 1;
      height: .vw(48)[];
      color: var(--light-text--);
      font-family: 'PingFang SC';
      font-size: .vw(16) [];
      line-height: .vw(16) [];
      font-style: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: .vw(45)[];
      margin: 0 .vw(8)[];
    }

    .button1 {
      font-weight: 400;
      border: 1px solid #EDEDF0;
      background-color: #fff;
    }

    .button2 {
      font-weight: 500;
      border: 1px solid transparent;
      background-color: #FFB169;
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

  .formdata {
    flex: 1;
    padding: 0 .vw(15) [];
    margin-bottom: .vw(15)[];

    .item {
      &:not(:last-of-type) {
        margin-bottom: .vw(32) [];
      }
    }
  }

  .submit {
    padding: 0 .vw(15) [];
  }

  .track-status {
    font-family: 'PingFang SC';
    font-size: .vw(14) [];
    font-weight: 500;
    font-style: normal;
  }

  .track-time {
    font-family: 'PingFang SC';
    font-size: .vw(12) [];
    font-weight: 400;
    font-style: normal;
    margin-left: .vw(5)[];
  }

  .track-context {
    font-family: 'PingFang SC';
    font-size: .vw(14) [];
    font-weight: 400;
    font-style: normal;
  }
}
</style>

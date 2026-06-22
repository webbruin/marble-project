<template>
  <main class="order">
    <Header title="订单"></Header>
    <div class="tab">
      <div class="item" :class="{ selected: params.orderStatus === item.orderStatus }" v-for="(item, index) in tabList"
        :key="index" @click="clickTab(item.orderStatus)">
        {{ item.name }}
      </div>
    </div>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" :empty="isEmpty" @load="loadMore">
        <template #content>
          <div class="order-list">
            <div class="item" v-for="(item, index) in orderList" :key="index" @click="toOrderDetail(item)">
              <div class="address">
                <span class="text">{{ item.recipientAddress }}</span>
                <i class="arrow"></i>
              </div>
              <div class="product">
                <div class="cover-list">
                  <div class="cover" v-for="(skuItem, skuIndex) in item.items" :key="skuIndex">
                    <img :src="skuItem.productImage" alt="" />
                    <span class="num">X{{ skuItem.quantity }}</span>
                  </div>
                </div>
                <div class="info">
                  <p class="point">积分{{ formatNumberWithCommas(item.totalAmount) }}</p>
                  <p class="count">共{{ item.totalQuantity }}件</p>
                </div>
              </div>
              <div class="button-list">
                <template v-if="item.orderStatus === 0">
                  <div class="button" :class="{ disabled: false }">待支付</div>
                </template>
                <template v-if="item.orderStatus === 1"></template>
                <template v-if="item.orderStatus === 2"></template>
                <template v-if="item.orderStatus === 3"></template>
                <template v-if="item.orderStatus === 4"></template>
                <template v-if="item.orderStatus === 5 || item.orderStatus === 6">
                  <div class="button" :class="{ disabled: true }">已完成</div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </InfiniteScroll>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import { formatNumberWithCommas } from '@/utils'

const route = useRoute()
const router = useRouter()

const params = reactive({
  current: 1,
  pageSize: 20,
  orderStatus: null, // 0-待支付，1-已支付，2-已发货，3-已收货，4-退款中，5-已退款，6-已关闭
  createTimeStart: '', // 创建时间起（含）
  createTimeEnd: '', // 创建时间止（含）
  orderId: '', // 订单号（模糊查询）
  recipientPhone: '', // 收货人电话（模糊查询）
})
const tabList = ref([
  { name: '全部', orderStatus: null },
  { name: '待支付', orderStatus: 0 },
  { name: '已支付', orderStatus: 1 },
  { name: '已发货', orderStatus: 2 },
  { name: '已收货', orderStatus: 3 },
  { name: '退款中', orderStatus: 4 },
  { name: '已退款', orderStatus: 5 },
  { name: '已关闭', orderStatus: 6 },
])
const orderList = ref([])
const loading = ref(false)
const loadOver = ref(false)
const isEmpty = ref(false)

onMounted(() => {
  params.orderStatus = +route.params.status || null
  init()
})

const init = async () => {
  $toast.loading()
  await getOrderList(true)
  $toast.close()
}

const getOrderList = async (init) => {
  if (init) {
    params.current = 1
    orderList.value = []
    loadOver.value = false
    isEmpty.value = false
  }
  try {
    loading.value = true
    const res = await api.post('/pinball/shop/order/page', params)
    loading.value = false
    if (res.code === 200) {
      const list = res.data.data || []
      orderList.value = [...orderList.value, ...list]
      params.current++
      // 加载完毕
      loadOver.value = orderList.value.length >= res.data.total
      // 空列表
      isEmpty.value = loadOver.value && orderList.value.length === 0
    }
  } catch (e) {
    $toast.info('系统错误')
    loading.value = false
  }
}

const clickTab = (orderStatus) => {
  if (params.orderStatus === orderStatus) {
    return
  }
  params.orderStatus = orderStatus
  // 修改路由订单状态
  router.replace({ name: 'order', params: { status: orderStatus } })
  getOrderList(true)
}

const loadMore = () => {
  getOrderList()
}

const toOrderDetail = ({ orderId, orderStatus }) => {
  if (!orderId) {
    return
  }
  router.push({ name: 'order-detail', params: { orderId }, query: { orderStatus } })
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.order {
  height: 100%;
  display: flex;
  flex-direction: column;

  .tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow-y: hidden;
    overflow-x: auto;
    padding: .vw(12) [] .vw(16) [] 0;

    .item {
      width: .vw(72) [];
      min-width: .vw(72) [];
      height: .vw(32) [];
      color: var(--text--);
      font-family: 'PingFang SC';
      font-size: .vw(14) [];
      line-height: .vw(14) [];
      font-weight: 500;
      font-style: normal;
      text-align: center;
      white-space: nowrap;
      position: relative;

      &.selected {
        color: #ffb169;
        font-weight: 500;

        &::after {
          content: '';
          width: .vw(24) [];
          height: .vw(3) [];
          border-radius: .vw(6) [];
          background-color: #ffb169;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }

  .body {
    flex: 1;
    background-color: #f5f6fa;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 .vw(8) [] .vw(10) [];

    .order-list {
      .item {
        border-radius: .vw(9) [];
        background-color: #fff;
        padding: .vw(15) [] 0;
        margin-bottom: .vw(8) [];

        &:first-of-type {
          margin-top: .vw(8) [];
        }

        .address {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 .vw(8) [];
          margin-bottom: .vw(8) [];

          .text {
            flex: 1;
            color: var(--light-text--);
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
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

        .product {
          display: flex;
          align-items: center;
          padding-left: .vw(15) [];
          padding-right: .vw(15) [];
          margin-bottom: .vw(8) [];

          .cover-list {
            flex: 1;
            display: flex;
            align-items: center;
            overflow-x: auto;
            overflow-y: hidden;
            margin-right: .vw(20) [];

            .cover {
              min-width: .vw(56) [];
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

          .info {
            .point {
              color: var(--light-text--);
              font-family: 'PingFang SC';
              font-size: .vw(14) [];
              line-height: .vw(14) [];
              font-weight: 600;
              font-style: normal;
              margin-bottom: .vw(6) [];
            }

            .count {
              color: var(--text--);
              font-family: 'PingFang SC';
              font-size: .vw(12) [];
              line-height: .vw(12) [];
              font-weight: 400;
              font-style: normal;
            }
          }
        }

        .button-list {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 .vw(15) [];

          .button {
            color: var(--light-text--);
            font-family: 'PingFang SC';
            font-size: .vw(12) [];
            line-height: .vw(12) [];
            font-weight: 400;
            font-style: normal;
            border-radius: .vw(6) [];
            background-color: #ffb169;
            padding: .vw(9) [] .vw(15) [];

            &:not(:last-of-type) {
              margin-right: .vw(8) [];
            }

            &.disabled {
              pointer-events: none;
              color: var(--text--);
              background-color: #e3e3e4;
            }
          }
        }
      }
    }
  }
}
</style>

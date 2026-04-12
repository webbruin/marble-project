<template>
  <main class="order">
    <Header title="订单"></Header>
    <div class="tab">
      <div class="item" :class="{ 'selected': tab === item.type }" v-for="(item, index) in tabList" :key="index"
        @click="clickTab(item.type)">
        {{ item.name }}
      </div>
    </div>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" @load="loadMore">
        <template #content>
          <div class="order-list">
            <div class="item" v-for="(item, index) in orderList" :key="index">
              <div class="address">
                <span class="text">北京市朝阳区凤凰汇6栋1584市</span>
                <i class="arrow"></i>
              </div>
              <div class="product">
                <div class="cover-list">
                  <div class="cover" v-for="(item, index) in item.coverList" :key="index">
                    <img src="@/assets/images/shop/cover.png" alt="">
                  </div>
                </div>
                <div class="info">
                  <p class="point">积分5,531</p>
                  <p class="count">共1件</p>
                </div>
              </div>
              <div class="button-list">
                <div class="button" :class="{ 'disabled': false }">待支付</div>
                <div class="button" :class="{ 'disabled': true }">已完成</div>
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

const route = useRoute()
const router = useRouter()

const tab = ref('all')
const tabList = ref([
  { name: '全部', type: 'all' },
  { name: '待付款', type: 'pending' },
  { name: '进行中', type: 'shipment' },
  { name: '待收货', type: 'beReceived' },
  // { name: '已收货', type: 'received' },
  { name: '退款/售后', type: 'refunded' },
])
const orderList = ref([
  { coverList: ['', '', '', '', '', '', '', ''] },
  { coverList: ['', '', '', ''] },
  { coverList: ['', '', '', ''] },
  { coverList: ['', '', '', ''] },
  { coverList: ['', '', '', ''] },
  { coverList: ['', '', '', ''] },
  { coverList: ['', '', '', ''] },
])
const loading = ref(false)
const loadOver = ref(false)

onMounted(() => {
  const type = route.params.type || 'all'
  clickTab(type)
})

const clickTab = (type) => {
  tab.value = type
  // 修改路由订单状态
  router.replace({ name: 'order', params: { type: tab.value } })
}

const loadMore = () => {
  loading.value = true
  const timer = setTimeout(() => {
    clearTimeout(timer)
    loading.value = false
    // loadOver.value = true
    orderList.value = [...orderList.value, ...[{}, {}, {}, {}, {}]]
  }, 1000)
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
    padding: .vw(12)[] .vw(16)[] 0;

    .item {
      height: .vw(32)[];
      color: var(--text--);
      font-family: "PingFang SC";
      font-size: .vw(14)[];
      line-height: .vw(14)[];
      font-weight: 500;
      font-style: normal;
      text-align: center;
      position: relative;

      &.selected {
        color: #FFB169;
        font-weight: 500;

        &::after {
          content: '';
          width: .vw(24)[];
          height: .vw(3)[];
          border-radius: .vw(6)[];
          background-color: #FFB169;
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
    background-color: #F5F6FA;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 .vw(8)[] .vw(10)[];

    .order-list {
      .item {
        border-radius: .vw(9)[];
        background-color: #fff;
        padding: .vw(15)[] 0;
        margin-bottom: .vw(8)[];

        &:first-of-type {
          margin-top: .vw(8)[];
        }

        .address {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 .vw(8)[];
          margin-bottom: .vw(8)[];

          .text {
            flex: 1;
            color: var(--light-text--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
          }

          .arrow {
            width: .vw(14)[];
            height: .vw(14)[];
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(@/assets/images/arrow-right.png);
          }
        }

        .product {
          display: flex;
          align-items: center;
          padding-right: .vw(15)[];
          margin-bottom: .vw(8)[];

          .cover-list {
            flex: 1;
            display: flex;
            align-items: center;
            overflow-x: auto;
            overflow-y: hidden;
            margin-right: .vw(20)[];

            .cover {
              min-width: .vw(56)[];
              width: .vw(56)[];
              height: .vw(56)[];

              img {
                max-width: 100%;
                max-height: 100%;
              }
            }
          }

          .info {
            .point {
              color: var(--light-text--);
              font-family: "PingFang SC";
              font-size: .vw(14)[];
              line-height: .vw(14)[];
              font-weight: 600;
              font-style: normal;
              margin-bottom: .vw(6)[];
            }

            .count {
              color: var(--text--);
              font-family: "PingFang SC";
              font-size: .vw(12)[];
              line-height: .vw(12)[];
              font-weight: 400;
              font-style: normal;
            }
          }
        }

        .button-list {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 .vw(15)[];

          .button {
            color: var(--light-text--);
            font-family: "PingFang SC";
            font-size: .vw(12)[];
            line-height: .vw(12)[];
            font-weight: 400;
            font-style: normal;
            border-radius: .vw(6)[];
            background-color: #FFB169;
            padding: .vw(9)[] .vw(15)[];

            &:not(:last-of-type) {
              margin-right: .vw(8)[];
            }

            &.disabled {
              pointer-events: none;
              color: var(--text--);
              background-color: #E3E3E4;
            }
          }
        }

      }
    }
  }
}
</style>
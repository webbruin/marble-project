<template>
  <main class="record">
    <Header title="充值记录"></Header>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" :empty="isEmpty" @load="loadMore">
        <template #content>
          <div class="record-list">
            <div class="item" v-for="(item, index) in recordList" :key="index">
              <div class="info">
                <p class="text">充值记录</p>
                <p class="date">{{ item.createTime }}</p>
              </div>
              <div class="right">
                <p class="price">+{{ formatNumberWithCommas(item.payAmount) }}元</p>
                <p class="status">{{ getRechargeStatusName(item.orderStatus) }}</p>
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

const params = ref({
  current: 1,
  pageSize: 20,
  orderStatus: '', // 状态：0-待支付，1-支付成功，2-支付失败，3-已关闭
})
const rechargeStatusMap = {
  0: '待支付',
  1: '支付成功',
  2: '支付失败',
  3: '已关闭',
}
const getRechargeStatusName = (status) => {
  return rechargeStatusMap[status] || '未知'
}
// 记录列表
const recordList = ref([])
const loading = ref(false)
const loadOver = ref(false)
const isEmpty = ref(false)

onMounted(() => {
  init()
})

const init = async () => {
  $toast.loading()
  await getList(true)
  $toast.close()
}

const loadMore = () => {
  getList()
}

const getList = async (init) => {
  if (init) {
    params.value.current = 1
    recordList.value = []
    loadOver.value = false
    isEmpty.value = false
  }
  try {
    loading.value = true
    const res = await api.post('/pinball/recharge/pageMarbleRechargeOrder', params.value)
    loading.value = false
    if (res.code === 200) {
      const list = res.data.data || []
      recordList.value = [...recordList.value, ...list]
      params.value.current++
      // 加载完毕
      loadOver.value = recordList.value.length >= res.data.total
      // 空列表
      isEmpty.value = loadOver.value && recordList.value.length === 0
    }
  } catch (e) {
    $toast.info('系统错误')
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.record {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    background-color: #f5f6fa;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 .vw(8) [] .vw(10) [];

    .record-list {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: .vw(9) [];
        background-color: #fff;
        padding: .vw(16) [];
        margin-bottom: .vw(8) [];

        &:first-of-type {
          margin-top: .vw(8) [];
        }

        .info {
          .text {
            color: var(--light-text--);
            font-family: 'PingFang SC';
            font-size: .vw(16) [];
            line-height: .vw(16) [];
            font-weight: 500;
            font-style: normal;
            margin-bottom: .vw(8) [];
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

        .right {
          .price {
            color: #f20c32;
            font-family: 'PingFang SC';
            font-size: .vw(16) [];
            line-height: .vw(16) [];
            font-weight: 500;
            font-style: normal;
            text-align: center;
            margin-bottom: .vw(8) [];
          }

          .status {
            color: var(--text--);
            font-family: 'PingFang SC';
            font-size: .vw(12) [];
            line-height: .vw(12) [];
            font-weight: 400;
            font-style: normal;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>

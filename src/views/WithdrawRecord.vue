<template>
  <main class="record">
    <Header title="提现记录"></Header>
    <div class="tab">
      <div class="item" :class="{ selected: params.withdrawStatus === item.type }" v-for="(item, index) in tabList"
        :key="index" @click="clickTab(item.type)">
        {{ item.name }}
      </div>
    </div>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" :empty="isEmpty" @load="getRecordList">
        <template #content>
          <div class="record-list">
            <div class="item" v-for="(item, index) in recordList" :key="index" @click="getWithdrawDetail(item)">
              <div class="item-content">
                <div class="amount">-{{ formatNumberWithCommas(formatToTwoDecimals(item.withdrawAmount)) }}</div>
                <div class="info">
                  <p class="status" :class="{ 'success': item.withdrawStatus === 2, 'fail': item.withdrawStatus > 2 }">
                    {{ tranfromStatus(item.withdrawStatus) }}
                  </p>
                  <p class="date">{{ item.applyTime }}</p>
                </div>
              </div>
              <div class="reason" v-if="item.failReason">{{ item.failReason }}</div>
            </div>
          </div>
        </template>
      </InfiniteScroll>
    </div>
  </main>

  <!-- 提现明细弹窗  -->
  <van-popup v-model:show="showWithdrawDetailPopup" position="bottom" closeable>
    <div class="popup-content">
      <div class="title">提现明细</div>
      <div class="info">
        <van-cell title="提现状态" :value="tranfromStatus(withdrawDetail.withdrawStatus)" />
        <van-cell title="提现金额" :value="formatNumberWithCommas(formatToTwoDecimals(withdrawDetail.withdrawAmount))"
          v-if="withdrawDetail.withdrawAmount" />
        <van-cell title="提现渠道" :value="formatNumberWithCommas(formatToTwoDecimals(withdrawDetail.withdrawChannel))"
          v-if="withdrawDetail.withdrawChannel" />
        <van-cell title="手续费金额" :value="withdrawDetail.feeAmount" v-if="withdrawDetail.feeAmount" />
        <van-cell title="申请时间" :value="withdrawDetail.applyTime" v-if="withdrawDetail.applyTime" />
        <van-cell title="审核时间" :value="withdrawDetail.auditTime" v-if="withdrawDetail.auditTime" />
        <van-cell title="审核人" :value="withdrawDetail.auditUserName" v-if="withdrawDetail.auditUserName" />
        <van-cell title="拒绝原因" :value="withdrawDetail.failReason" v-if="withdrawDetail.failReason" />
        <van-cell title="发起转账时间" :value="withdrawDetail.transferTime" v-if="withdrawDetail.transferTime" />
        <van-cell title="完成时间" :value="withdrawDetail.finishTime" v-if="withdrawDetail.finishTime" />
        <!-- <van-button type="primary" block color="#F20C32" v-if="withdrawDetail.withdrawStatus === 0"
          @click="withdrawCancel">
          取消提现
        </van-button> -->
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import { formatNumberWithCommas, formatToTwoDecimals } from '@/utils'

const tabList = ref([
  { name: '全部', type: '' },
  { name: '待审核', type: 0 },
  { name: '转账中', type: 1 },
  { name: '提现成功', type: 2 },
  { name: '提现失败', type: 3 },
  { name: '审核拒绝', type: 4 },
  { name: '用户取消', type: 5 },
])
const params = ref({
  current: 1,
  pageSize: 20,
  withdrawStatus: '',
  applyTimeStart: '',  // 申请时间起
  applyTimeEnd: '',  // 申请时间止
  withdrawNo: '',  // 提现单号
})
const recordList = ref([])
const loading = ref(false)
const loadOver = ref(false)
const isEmpty = ref(false)
const showWithdrawDetailPopup = ref(false)
const withdrawDetail = ref({})

onMounted(() => {
  getRecordList(true)
})

// 分页查询我的提现记录
const getRecordList = async (init) => {
  if (init) {
    params.value.current = 1
    recordList.value = []
    loadOver.value = false
    isEmpty.value = false
  }
  try {
    loading.value = true
    const res = await api.post('/pinball/withdraw/log/page', params.value)
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

// 查看提现明细信息
const getWithdrawDetail = async ({ withdrawNo }) => {
  try {
    $toast.loading()
    const res = await api.post('/pinball/withdraw/log/detail', { withdrawNo })
    $toast.close()
    if (res.code === 200) {
      showWithdrawDetailPopup.value = true
      withdrawDetail.value = res.data
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 取消提现
const withdrawCancel = async ({ withdrawNo }) => {
  try {
    $toast.loading()
    const res = await api.post('/pinball/withdraw/cancel', { withdrawNo: withdrawDetail.value.withdrawNo })
    $toast.close()
    if (res.code === 200) {
      $toast.info('提现已取消')
      showWithdrawDetailPopup.value = false
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const clickTab = (type) => {
  if (params.value.withdrawStatus === type) {
    return
  }
  params.value.withdrawStatus = type
  getRecordList(true)
}

const tranfromStatus = (status) => {
  return tabList.value.find(item => item.type === status)?.name || ''
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

  .tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow-y: hidden;
    overflow-x: auto;
    padding: 0 .vw(15) [];

    .item {
      color: var(--text--);
      font-family: 'PingFang SC';
      font-size: .vw(16) [];
      line-height: .vw(16) [];
      font-weight: 400;
      font-style: normal;
      white-space: nowrap;
      position: relative;
      padding: .vw(10) [];

      &.selected {
        color: #ffb169;
        font-weight: 500;

        &::after {
          content: '';
          width: 100%;
          height: .vw(2) [];
          background-color: #ffb169;
          position: absolute;
          bottom: 0;
          left: 0;
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

    .record-list {
      .item {
        border-radius: .vw(9) [];
        background-color: #fff;
        padding: .vw(16) [];
        margin-bottom: .vw(8) [];

        &:first-of-type {
          margin-top: .vw(8) [];
        }

        .item-content {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .amount {
            color: #F20C32;
            font-family: 'PingFang SC';
            font-size: .vw(16) [];
            line-height: .vw(16) [];
            font-weight: 500;
            font-style: normal;
          }

          .info {
            .status {
              color: var(--text--);
              font-family: 'PingFang SC';
              font-size: .vw(16) [];
              line-height: .vw(16) [];
              font-weight: 500;
              font-style: normal;
              text-align: right;
              margin-bottom: .vw(4)[];

              &.success {
                color: #32C95A;
              }

              &.fail {
                color: #F20C32;
              }
            }

            .date {
              color: var(--text--);
              font-family: 'PingFang SC';
              font-size: .vw(14) [];
              line-height: .vw(14) [];
              font-weight: 400;
              font-style: normal;
              text-align: right;
            }
          }
        }

        .reason {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 400;
          font-style: normal;
          border-radius: .vw(8)[];
          background-color: #F5F6FA;
          padding: .vw(8)[] .vw(12)[];
          margin-top: .vw(10)[];
        }
      }
    }
  }
}

.popup-content {
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

  .info {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0 .vw(18)[];
  }
}
</style>

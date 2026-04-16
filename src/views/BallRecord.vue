<template>
  <main class="record">
    <Header title="弹珠记录"></Header>
    <div class="tab">
      <div class="item" :class="{ 'selected': params.changeType === item.type }" v-for="(item, index) in tabList"
        :key="index" @click="clickTab(item.type)">
        {{ item.name }}
      </div>
    </div>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" :empty="!recordList.length" @load="getRecordList">
        <template #content>
          <div class="record-list" v-if="recordList.length">
            <div class="item" v-for="(item, index) in recordList" :key="index">
              <div class="info">
                <p class="text">{{ item.remark }}</p>
                <p class="date">{{ item.createTime }}</p>
              </div>
              <div class="count" :class="{ 'red': index % 2 === 1 }">
                {{ item.changeType === 1 ? '+' : '-' }}{{ item.changeAmount }}弹珠
              </div>
            </div>
          </div>
          <div class="empty" v-else>空数据</div>
        </template>
      </InfiniteScroll>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InfiniteScroll from '@/components/InfiniteScroll.vue'

const tabList = ref([
  { name: '全部', type: '' },
  { name: '收入', type: 1 },
  { name: '支出', type: 2 },
])
const params = ref({
  changeType: '',  // null-全部，1-收入，2-支出
  current: 1,
  pageSize: 20,
})
const recordList = ref([])
const loading = ref(false)
const loadOver = ref(false)

onMounted(() => {
  getRecordList(true)
})

const getRecordList = async (init) => {
  if (init) {
    params.value.current = 1
    recordList.value = []
    loadOver.value = false
  }
  try {
    loading.value = true
    const res = await api.post('/user/account/pageMarbleLog', params.value)
    loading.value = false
    if (res.code === 200) {
      const list = res.data.data || []
      recordList.value = [...recordList.value, ...list]
      params.value.current++
      // 加载完毕
      loadOver.value = recordList.value.length >= res.data.total
    } else {
      $toast.info(res.message)
    }
  } catch (e) {
    $toast.info('系统错误')
    loading.value = false
  }
}

const clickTab = (type) => {
  if (params.value.changeType === type) {
    return
  }
  params.value.changeType = type
  getRecordList(true)
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
    padding: 0 .vw(15)[];

    .item {
      color: var(--text--);
      font-family: "PingFang SC";
      font-size: .vw(16)[];
      line-height: .vw(16)[];
      font-weight: 400;
      font-style: normal;
      position: relative;
      padding: .vw(10)[];

      &.selected {
        color: #FFB169;
        font-weight: 500;

        &::after {
          content: '';
          width: 100%;
          height: .vw(2)[];
          background-color: #FFB169;
          position: absolute;
          bottom: 0;
          left: 0;
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

    .record-list {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: .vw(9)[];
        background-color: #fff;
        padding: .vw(16)[];
        margin-bottom: .vw(8)[];

        &:first-of-type {
          margin-top: .vw(8)[];
        }

        .info {
          .text {
            color: var(--light-text--);
            font-family: "PingFang SC";
            font-size: .vw(16)[];
            line-height: .vw(16)[];
            font-weight: 500;
            font-style: normal;
            margin-bottom: .vw(8)[];
          }

          .date {
            color: var(--text--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 400;
            font-style: normal;
          }
        }

        .count {
          color: #52C41A;
          font-family: "PingFang SC";
          font-size: .vw(16)[];
          line-height: .vw(16)[];
          font-weight: 500;
          font-style: normal;

          &.red {
            color: #F20C32;
          }
        }
      }
    }

    .empty {
      height: .vw(400)[];
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text--);
      font-family: "PingFang SC";
      font-size: .vw(16)[];
      line-height: .vw(16)[];
      font-weight: 500;
      font-style: normal;
    }
  }
}
</style>
<template>
  <main class="record">
    <Header title="使用记录"></Header>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" :empty="isEmpty" @load="loadMore">
        <template #content>
          <div class="record-list">
            <div class="item" v-for="(item, index) in recordList" :key="index">
              <div class="date">下单时间：{{ item.createTime }}</div>
              <div class="module">
                <div class="cover">
                  <img src="@/assets/images/home/room-bg.png" alt="" />
                </div>
                <div class="info">
                  <p class="room-level">{{ getRoomLevelName(item.roomLevel) }}</p>
                  <p class="use-ball">消耗弹珠 X{{ formatNumberWithCommas(item.actualMarble) || '-' }}</p>
                  <div class="have">
                    <span class="text">获得</span>
                    <span class="text">
                      <img src="@/assets/images/ball.png" alt="" class="icon" />
                      X{{ formatNumberWithCommas(item.winMarble) || '-' }}
                    </span>
                    <span class="text">
                      <img src="@/assets/images/point.png" alt="" class="icon" />
                      X{{ formatNumberWithCommas(item.winPointCard) || '-' }}
                    </span>
                  </div>
                </div>
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
import { formatNumberWithCommas, getRoomLevelName } from '@/utils'

const params = ref({
  current: 1,
  pageSize: 20,
  orderStatus: '', // 状态：0-待发射，1-完成，2-超时完成，9-异常
})
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
    const res = await api.post('/pinball/room/pageGameOrder', params.value)
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
    padding: 0 .vw(18) [] .vw(10) [];

    .record-list {
      .item {
        border-radius: .vw(12) [];
        background-color: #fff;
        padding: .vw(16) [] .vw(12) [];
        margin-bottom: .vw(12) [];

        &:first-of-type {
          margin-top: .vw(12) [];
        }

        .date {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 400;
          font-style: normal;
          margin-bottom: .vw(10) [];
        }

        .module {
          display: flex;
          align-items: center;

          .cover {
            width: .vw(120) [];
            height: .vw(88) [];
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            margin-right: .vw(12) [];

            img {
              width: 100%;
            }
          }

          .info {
            flex: 1;

            .room-level {
              color: var(--light-text--);
              font-family: 'PingFang SC';
              font-size: .vw(18) [];
              line-height: .vw(18) [];
              font-weight: 500;
              font-style: normal;
              margin-bottom: .vw(12) [];
            }

            .use-ball {
              color: var(--text--);
              font-family: 'PingFang SC';
              font-size: .vw(14) [];
              line-height: .vw(14) [];
              font-weight: 400;
              font-style: normal;
              margin-bottom: .vw(12) [];
            }

            .have {
              display: flex;
              align-items: center;

              .text {
                color: var(--text--);
                font-family: 'PingFang SC';
                font-size: .vw(14) [];
                line-height: .vw(14) [];
                font-weight: 400;
                font-style: normal;
                white-space: nowrap;
                display: flex;
                align-items: center;

                &:not(:last-of-type) {
                  margin-right: .vw(8) [];
                }

                .icon {
                  width: .vw(18) [];
                  height: .vw(18) [];
                  margin-right: .vw(4) [];
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

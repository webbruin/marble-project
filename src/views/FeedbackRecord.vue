<template>
  <main class="feedback-record">
    <Header title="反馈记录"></Header>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" :empty="isEmpty" @load="loadMore">
        <template #content>
          <div class="record-list">
            <div class="item" v-for="(item, index) in recordList" :key="index">
              <div class="feedback">
                <div class="desc">{{ item.content }}</div>
                <div class="info">
                  <span class="date">{{ item.createTime }}</span>
                  <span class="type" :class="{ 'done': item.replyContent }">
                    <!-- {{ feedbackTypeEnum(item.feedbackType) }} -->
                    {{ item.replyContent ? '已完结' : '待反馈' }}
                  </span>
                </div>
              </div>
              <div class="reply" v-if="item.replyContent">
                <div class="reply-content">
                  <div class="desc">{{ item.replyContent }}</div>
                  <div class="info">
                    <span class="date">{{ item.replyTime }}</span>
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

const route = useRoute()
const router = useRouter()

const feedbackTypeEnum = {
  '1': '下单问题',
  '2': '点击问题',
  '3': '费用问题',
  '4': '服务问题',
  '5': '订单问题',
  '6': '积分问题',
  '7': '卡顿/闪现',
  '8': '其他问题'
}

const params = ref({
  current: 1,
  pageSize: 20,
})
const recordList = ref([])
const loading = ref(false)
const loadOver = ref(false)
const isEmpty = ref(false)

onMounted(() => {
  getList(true)
})

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
    const res = await api.post('/pinball/feedback/page', params.value)
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

.feedback-record {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #f8f8f8;
    padding: .vw(18) [] .vw(8) [];

    .record-list {
      .item {
        border-radius: .vw(8)[];
        background-color: #fff;

        &:not(:last-of-type) {
          margin-bottom: .vw(8) [];
        }

        .feedback {
          padding: .vw(16) [] .vw(15) [];

          .desc {
            color: var(--light-text--);
            font-family: 'PingFang SC';
            font-size: .vw(15) [];
            line-height: .vw(16) [];
            font-weight: 500;
            font-style: normal;
            margin-bottom: .vw(16) [];
          }

          .info {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .date {
              color: var(--text--);
              font-family: 'PingFang SC';
              font-size: .vw(14) [];
              line-height: .vw(14) [];
              font-weight: 400;
              font-style: normal;
            }

            .type {
              color: var(--orange--);
              font-family: 'PingFang SC';
              font-size: .vw(15) [];
              line-height: .vw(16) [];
              font-weight: 500;
              font-style: normal;

              &.done {
                color: var(--text--);
              }
            }
          }
        }

        .reply {
          border-top: 1px solid #E3E3E4;
          padding: .vw(8)[];

          .reply-content {
            border-radius: .vw(6)[];
            background-color: #F5F6FA;
            padding: .vw(6) [] .vw(8) [];

            .desc {
              color: #50525C;
              font-family: 'PingFang SC';
              font-size: .vw(15) [];
              line-height: .vw(16) [];
              font-weight: 500;
              font-style: normal;
              margin-bottom: .vw(16) [];
            }

            .info {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .date {
                color: var(--text--);
                font-family: 'PingFang SC';
                font-size: .vw(14) [];
                line-height: .vw(14) [];
                font-weight: 400;
                font-style: normal;
              }
            }
          }
        }
      }
    }
  }
}
</style>

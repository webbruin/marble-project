<template>
  <main class="feedback-record">
    <Header title="反馈记录"></Header>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" :empty="isEmpty" @load="loadMore">
        <template #content>
          <div class="record-list">
            <div class="item" v-for="(item, index) in recordList" :key="index" @click="getWithdrawDetail(item)">
              <div class="feedback">
                <div class="content">
                  <span class="desc">{{ item.content }}</span>
                  <span class="status">{{ item.replyContent ? '已完结' : '待反馈' }}</span>
                </div>
                <div class="info">
                  <span class="date">{{ item.createTime }}</span>
                  <span class="type" :class="{ 'done': item.replyContent }">
                    {{ feedbackTypeEnum[item.feedbackType] }}
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

  <!-- 反馈明细弹窗  -->
  <van-popup v-model:show="showFeedbackDetailPopup" position="bottom" closeable>
    <div class="popup-content">
      <div class="title">反馈明细</div>
      <div class="info">
        <van-cell title="反馈内容" :value="feedbackDetail.content" v-if="feedbackDetail.content" />
        <van-cell title="反馈订单号" :value="feedbackDetail.orderId" v-if="feedbackDetail.orderId" />
        <van-cell title="反馈状态" :value="feedbackDetail.replyContent ? '已完结' : '待反馈'" />
        <van-cell title="反馈类型" :value="feedbackTypeEnum[feedbackDetail.feedbackType]" />
        <van-cell title="创建时间" :value="feedbackDetail.createTime" />
        <div class="cover" v-if="feedbackDetail.images">
          <div class="cover-item" v-for="(item, index) in JSON.parse(feedbackDetail.images)" :key="index"
            @click="clickPrivew(JSON.parse(feedbackDetail.images), index)">
            <van-image width="60" height="60" fit="cover" :src="item" />
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import { showImagePreview } from 'vant';

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
const showFeedbackDetailPopup = ref(false)
const feedbackDetail = ref({})

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

// 查看提现明细信息
const getWithdrawDetail = async (item) => {
  showFeedbackDetailPopup.value = true
  feedbackDetail.value = item
}

// 图片预览
const clickPrivew = (images, startPosition = 0) => {
  showImagePreview({ images, startPosition });
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

          .content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: .vw(16) [];

            .desc {
              flex: 1;
              color: var(--light-text--);
              font-family: 'PingFang SC';
              font-size: .vw(15) [];
              line-height: .vw(16) [];
              font-weight: 500;
              font-style: normal;
            }

            .status {
              color: var(--text--);
              font-family: 'PingFang SC';
              font-size: .vw(15) [];
              line-height: .vw(16) [];
              font-weight: 500;
              font-style: normal;
              margin-left: .vw(10)[];
            }
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

    .avatar {
      width: .vw(60)[];
      height: .vw(60)[];
      border-radius: .vw(45)[];
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-bottom: .vw(12)[];

      img {
        width: 100%;
      }
    }

    .cover {
      width: 100%;
      display: flex;
      align-items: center;
      margin-top: .vw(15)[];
      padding: 0 .vw(15)[];

      .cover-item {
        &:not(:last-of-type) {
          margin-right: .vw(5)[];
        }
      }
    }
  }
}
</style>

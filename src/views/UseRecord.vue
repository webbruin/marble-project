<template>
  <main class="record">
    <Header title="使用记录"></Header>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" @load="loadMore">
        <template #content>
          <div class="record-list">
            <div class="item" v-for="(item, index) in recordList" :key="index">
              <div class="date">下单时间：2026.03.11 15:21:22</div>
              <div class="module">
                <div class="cover">
                  <img src="@/assets/images/home/room-bg.png" alt="">
                </div>
                <div class="info">
                  <p class="room-level">初级房间</p>
                  <p class="use-ball">消耗弹珠 X25</p>
                  <div class="have">
                    <span class="text">获得</span>
                    <span class="text">
                      <img src="@/assets/images/ball.png" alt="" class="icon">
                      X45.00
                    </span>
                    <span class="text">
                      <img src="@/assets/images/point.png" alt="" class="icon">
                      X145.00
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

const recordList = ref([
  {},
  {},
  {},
  {},
  {},
  {},
  {},
])
const loading = ref(false)
const loadOver = ref(false)

onMounted(() => {

})

const loadMore = () => {
  loading.value = true
  const timer = setTimeout(() => {
    clearTimeout(timer)
    loading.value = false
    // loadOver.value = true
    recordList.value = [...recordList.value, ...[{}, {}, {}, {}, {}]]
  }, 1000)
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
    background-color: #F5F6FA;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 .vw(18)[] .vw(10)[];

    .record-list {
      .item {
        border-radius: .vw(12)[];
        background-color: #fff;
        padding: .vw(16)[] .vw(12)[];
        margin-bottom: .vw(12)[];

        &:first-of-type {
          margin-top: .vw(12)[];
        }

        .date {
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 400;
          font-style: normal;
          margin-bottom: .vw(10)[];
        }

        .module {
          display: flex;
          align-items: center;

          .cover {
            width: .vw(120)[];
            height: .vw(88)[];
            margin-right: .vw(12)[];

            img {
              width: 100%;
              max-height: 100%;
            }
          }

          .info {
            flex: 1;

            .room-level {
              color: var(--light-text--);
              font-family: "PingFang SC";
              font-size: .vw(18)[];
              line-height: .vw(18)[];
              font-weight: 500;
              font-style: normal;
              margin-bottom: .vw(12)[];
            }

            .use-ball {
              color: var(--text--);
              font-family: "PingFang SC";
              font-size: .vw(14)[];
              line-height: .vw(14)[];
              font-weight: 400;
              font-style: normal;
              margin-bottom: .vw(12)[];
            }

            .have {
              display: flex;
              align-items: center;

              .text {
                color: var(--text--);
                font-family: "PingFang SC";
                font-size: .vw(14)[];
                line-height: .vw(14)[];
                font-weight: 400;
                font-style: normal;
                white-space: nowrap;
                display: flex;
                align-items: center;

                &:not(:last-of-type) {
                  margin-right: .vw(8)[];
                }

                .icon {
                  width: .vw(18)[];
                  height: .vw(18)[];
                  margin-right: .vw(4)[];
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
<template>
  <main class="record">
    <Header title="充值记录"></Header>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" @load="loadMore">
        <template #content>
          <div class="record-list">
            <div class="item" v-for="(item, index) in recordList" :key="index">
              <div class="info">
                <p class="text">充值记录</p>
                <p class="date">2025-15-21 15:21:21</p>
              </div>
              <div class="right">
                <p class="price">+100元</p>
                <p class="status">已完成</p>
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
])
const loading = ref(false)
const loadOver = ref(false)

onMounted(() => {

})

const clickTab = (item) => {
  tab.value = item.type
}

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

        .right {
          .price {
            color: #F20C32;
            font-family: "PingFang SC";
            font-size: .vw(16)[];
            line-height: .vw(16)[];
            font-weight: 500;
            font-style: normal;
            margin-bottom: .vw(8)[];
          }

          .status {
            color: var(--text--);
            font-family: "PingFang SC";
            font-size: .vw(12)[];
            line-height: .vw(12)[];
            font-weight: 400;
            font-style: normal;
          }
        }
      }
    }
  }
}
</style>
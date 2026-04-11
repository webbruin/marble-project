<template>
  <main class="record">
    <Header title="奖励卡记录"></Header>
    <div class="tab">
      <div class="item" :class="{ 'selected': tab === item.type }" v-for="(item, index) in tabList" :key="index"
        @click="clickTab(item)">
        {{ item.name }}
      </div>
    </div>
    <div class="body">
      <InfiniteScroll :loading="loading" :loadOver="loadOver" @load="loadMore">
        <template #content>
          <div class="record-list">
            <div class="item">
              <div class="info">
                <p class="status">
                  <img src="@/assets/images/record/game-icon.png" alt="" class="icon">
                  <span class="text">游戏奖励</span>
                </p>
                <p class="date">2025-15-21 15:21:21</p>
              </div>
              <div class="count">+50,856.00</div>
            </div>
            <div class="item" v-for="(item, index) in recordList" :key="index">
              <div class="info">
                <p class="status">
                  <img src="@/assets/images/record/shop-icon.png" alt="" class="icon">
                  <span class="text">商品购物</span>
                </p>
                <p class="date">2025-15-21 15:21:21</p>
              </div>
              <div class="count" :class="{ 'red': true }">-50,856.00</div>
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

const tab = ref('all')
const tabList = ref([
  { name: '全部', type: 'all' },
  { name: '收入', type: 'add' },
  { name: '支出', type: 'sub' },
])
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
          .status {
            display: flex;
            align-items: center;
            margin-bottom: .vw(8)[];

            .icon {
              width: .vw(24)[];
              height: .vw(24)[];
              margin-right: .vw(8)[];
            }

            .text {
              color: var(--light-text--);
              font-family: "PingFang SC";
              font-size: .vw(16)[];
              line-height: .vw(24)[];
              font-weight: 500;
              font-style: normal;
            }
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
          display: flex;
          align-items: center;

          &::after {
            content: '';
            width: .vw(16)[];
            height: .vw(16)[];
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(@/assets/images/arrow-right.png);
            margin-left: .vw(4)[];
          }

          &.red {
            color: #F20C32;
          }
        }
      }
    }
  }
}
</style>
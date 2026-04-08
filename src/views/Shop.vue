<template>
  <main class="shop">
    <div class="header">
      <div class="title">商城兑换</div>
      <div class="point">
        <p class="text">我的积分</p>
        <p class="count">8,213</p>
      </div>
    </div>
    <div class="body">
      <div class="tab">
        <div class="item" v-for="(item, index) in tabs" :key="index" @click="clickTab(item)">
          <div class="icon">
            <img :src="item.icon" alt="">
          </div>
          <p class="text">{{ item.name }}</p>
        </div>
      </div>
      <div class="banner">
        <img src="@/assets/images/home/banner.png" alt="">
      </div>
      <div class="filter">
        <div class="item" :class="{ light: currentFilter === item.type }" v-for="(item, index) in sortTypeList"
          :key="index">
          <span @click="clickFilter(item)">{{ item.name }}</span>
          <template v-if="item.sort">
            <div class="sort" :class="{ 'low': priceSort === 'low', 'hight': priceSort === 'hight' }"></div>
          </template>
        </div>
      </div>
      <div class="products">
        <InfiniteScroll :loading="loading" :loadOver="loadOver" @load="loadMore">
          <template #content>
            <template v-for="(item, index) in productList" :key="index">
              <div v-if="item.vipEntry" class="entry" @click="clickProduct(item)"></div>
              <div v-else class="item" @click="clickProduct(item)">
                <div class="cover">
                  <img src="@/assets/images/shop/product.png" alt="">
                </div>
                <div class="text">可口可乐300ml</div>
                <div class="option">
                  <span class="point">积分 854.00</span>
                  <span class="add-cart"></span>
                </div>
              </div>
            </template>
          </template>
        </InfiniteScroll>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InfiniteScroll from '../components/InfiniteScroll.vue'

const tabs = ref([
  {
    name: '休闲零食',
    icon: new URL(`@/assets/images/shop/tab1.png`, import.meta.url).href,
  },
  {
    name: '酒水饮料',
    icon: new URL(`@/assets/images/shop/tab2.png`, import.meta.url).href,
  },
  {
    name: '儿童玩具',
    icon: new URL(`@/assets/images/shop/tab3.png`, import.meta.url).href,
  },
  {
    name: '电子数码',
    icon: new URL(`@/assets/images/shop/tab4.png`, import.meta.url).href,
  },
  {
    name: '数码产品',
    icon: new URL(`@/assets/images/shop/tab5.png`, import.meta.url).href,
  },
  {
    name: '美妆用品',
    icon: new URL(`@/assets/images/shop/tab6.png`, import.meta.url).href,
  },
])
const sortTypeList = ref([
  { name: '推荐', type: 'recommend' },
  { name: '热度', type: 'hot' },
  { name: '价格', type: 'price', sort: true },
])

// 推荐-recommend 热度-hot 价格-price
const currentFilter = ref('recommend')
// 低到高-low 高到低-hight
const priceSort = ref('')
// 商品列表
const productList = ref([{}, { vipEntry: true }])
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
    productList.value = [...productList.value, ...[{}, {}, {}, {}]]
  }, 1000)
}

const clickTab = (item) => {
  // router.push('');
}

const clickFilter = (item) => {
  currentFilter.value = item.type
  // 价格排序
  if (currentFilter.value === 'price') {
    if (priceSort.value === 'low') {
      priceSort.value = 'hight'
    } else {
      priceSort.value = 'low'
    }
  }
}

const clickProduct = (item) => {
  // router.push('');
  if (item.vipEntry) {
    return;
  }
}

</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.shop {
  .header {
    height: .vw(160)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/shop/shop-bg.png);

    .title {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(32)[];
      line-height: .vw(32)[];
      font-weight: 900;
      padding: .vw(12)[] .vw(18)[] .vw(9)[] .vw(18)[];
      margin-bottom: .vw(8)[];
    }

    .point {
      padding: 0 .vw(18)[];
      margin-bottom: .vw(17)[];

      .text {
        color: var(--text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 200;
        font-style: normal;
        margin-bottom: .vw(10)[];
      }

      .count {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(26)[];
        line-height: .vw(26)[];
        font-weight: 900;
        font-style: normal;
      }
    }
  }

  .body {
    border-radius: .vw(24)[] .vw(24)[] 0 0;
    background-color: var(--white--);
    padding-top: .vw(23)[];
    margin-top: .vw(-20)[];

    .tab {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 0 .vw(28)[];

      .item {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-bottom: .vw(16)[];
        margin-right: .vw(31)[];

        &:nth-child(4n + 0) {
          margin-right: 0;
        }

        .icon {
          width: .vw(48)[];
          height: .vw(48)[];
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: .vw(12)[];
          background: linear-gradient(153deg, #CCF4FF 5.44%, #98E0ED 80.37%);
          margin-bottom: .vw(8)[];

          img {
            width: .vw(40)[];
            height: .vw(40)[];
          }
        }

        .text {
          color: var(--light-text--);
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 400;
          font-style: normal;
        }
      }
    }

    .banner {
      padding: 0 .vw(16)[];
      margin-bottom: .vw(16)[];

      img {
        width: 100%;
        border-radius: .vw(16)[];
        overflow: hidden;
      }
    }

    .filter {
      display: flex;
      padding: 0 .vw(16)[];
      margin-bottom: .vw(16)[];
      overflow-x: auto;
      overflow-y: hidden;

      .item {
        display: flex;
        align-items: center;

        &:not(:last-of-type) {
          margin-right: .vw(24)[];
        }

        span {
          width: .vw(32)[];
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(16)[];
          line-height: .vw(28)[];
          font-weight: 500;
          font-style: normal;
        }

        .sort {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          margin-left: .vw(6)[];

          &::before {
            content: '';
            width: .vw(6)[];
            height: .vw(6)[];
            border-top: .vw(1)[] solid var(--text--);
            border-left: .vw(1)[] solid var(--text--);
            border-bottom: .vw(1)[] solid transparent;
            border-right: .vw(1)[] solid transparent;
            transform: rotate(45deg);
          }

          &::after {
            content: '';
            width: .vw(6)[];
            height: .vw(6)[];
            border-top: .vw(1)[] solid transparent;
            border-left: .vw(1)[] solid transparent;
            border-bottom: .vw(1)[] solid var(--text--);
            border-right: .vw(1)[] solid var(--text--);
            transform: rotate(45deg);
          }

          &.low {
            &::before {
              border-top: .vw(1)[] solid var(--light-text--);
              border-left: .vw(1)[] solid var(--light-text--);
            }
          }

          &.hight {
            &::after {
              border-bottom: .vw(1)[] solid var(--light-text--);
              border-right: .vw(1)[] solid var(--light-text--);
            }
          }
        }
      }

      .light {
        span {
          width: .vw(48)[];
          color: var(--light-text--);
          font-size: .vw(24)[];
          line-height: .vw(24)[];
          background-size: 90%;
          background-position: center .vw(7)[];
          background-repeat: no-repeat;
          background-image: url(@/assets/images/home/filter-select-bg.png);
        }
      }
    }

    .products {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 .vw(16)[];

      .entry {
        width: .vw(166)[];
        height: .vw(200)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/shop/vip-entry.png);
        margin-bottom: .vw(16)[];
      }

      .item {
        width: .vw(166)[];
        height: .vw(200)[];
        display: flex;
        flex-direction: column;
        border-radius: .vw(12)[];
        background-color: #F5F6FA;
        margin-bottom: .vw(16)[];
        overflow: hidden;

        .cover {
          display: flex;
          justify-content: center;
          padding: .vw(15)[] .vw(28)[] .vw(20)[] .vw(28)[];

          img {
            max-width: 100%;
            max-heignt: 100%;
          }
        }

        .text {
          color: var(--light-text--);
          font-family: "PingFang SC";
          font-size: .vw(16)[];
          line-height: .vw(16)[];
          font-weight: 500;
          font-style: normal;
          padding: 0 .vw(12)[];
          margin-bottom: .vw(6)[];
        }

        .option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 .vw(12)[];

          .point {
            color: var(--orange--);
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
          }

          .add-cart {
            width: .vw(18)[];
            height: .vw(18)[];
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(@/assets/images/add-cart.png);
          }
        }
      }
    }
  }
}
</style>
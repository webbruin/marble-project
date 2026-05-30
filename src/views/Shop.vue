<template>
  <main class="shop">
    <div class="header">
      <div class="title">商城兑换</div>
      <div class="point">
        <p class="text">我的积分</p>
        <p class="count">{{ formatNumberWithCommas(8213) }}</p>
      </div>
    </div>
    <div class="body">
      <div class="tab">
        <div class="item" v-for="(item, index) in categorys" :key="index" @click="clickCategory(item)">
          <div class="icon">
            <img :src="item.icon" alt="">
          </div>
          <p class="text">{{ item.name }}</p>
          <!-- <p class="text">{{ item.categoryName }}</p> -->
        </div>
      </div>
      <div class="banner">
        <img src="@/assets/images/home/banner.png" alt="">
      </div>
      <div class="filter">
        <div class="item" :class="{ light: params.sortType === item.type }" v-for="(item, index) in sortTypeList"
          :key="index">
          <span @click="clickFilter(item)">{{ item.name }}</span>
          <template v-if="item.sort">
            <div class="sort" :class="{ 'low': params.order === 'low', 'hight': params.order === 'hight' }"></div>
          </template>
        </div>
      </div>
      <InfiniteScroll :loading="loading" :loadOver="loadOver" :empty="isEmpty" @load="loadMore">
        <template #content>
          <div class="products">
            <template v-for="(item, index) in productList" :key="index">
              <div v-if="item.vipEntry" class="entry" @click="toVip"></div>
              <div v-else class="item" @click="clickProduct(item)">
                <div class="cover">
                  <img :src="item.mainImage" alt="">
                </div>
                <div class="text">{{ item.productName }}</div>
                <div class="option">
                  <span class="point">积分 {{ formatNumberWithCommas(item.totalAmount) }}</span>
                  <span class="add-cart" @click="addCart(item)"></span>
                </div>
              </div>
            </template>
          </div>
        </template>
      </InfiniteScroll>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import { formatNumberWithCommas } from '@/utils'

const route = useRoute()
const router = useRouter()

const categorys = ref([
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

const params = ref({
  current: 1,
  pageSize: 20,
  categoryId: '',  // 分类ID
  productName: '',  // 商品名称（模糊查询）
  status: 1,  // 状态：0-下架，1-上架
  sortType: 'recommend',  // 推荐-recommend 热度-hot 价格-price
  order: '',  // 低到高-low 高到低-hight
})
// 商品列表
const productList = ref([])
const loading = ref(false)
const loadOver = ref(false)
const isEmpty = ref(false)
// 是否插入vip专区入口
const hasVipEntry = ref(false)

onMounted(() => {
  init()
})

const init = async () => {
  $toast.loading()
  await getCategoryList()
  $toast.close()
}

const loadMore = () => {
  getProductList()
}

const getCategoryList = async () => {
  try {
    const res = await api.post('/shop/category/list', {})
    if (res.code === 200) {
      clickCategory(res.data[0])
    } else {
      $toast.info(res.message)
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const getProductList = async (init) => {
  if (init) {
    params.value.current = 1
    productList.value = []
    loadOver.value = false
    isEmpty.value = false
  }
  try {
    loading.value = true
    const res = await api.post('/shop/product/page', params.value)
    loading.value = false
    if (res.code === 200) {
      const list = res.data.data || []
      productList.value = [...productList.value, ...list]
      params.value.current++
      // 加载完毕
      loadOver.value = productList.value.length >= res.data.total
      // 空列表
      isEmpty.value = loadOver.value && productList.value.length === 0
      // 数组的第二个，插入vip专区入口
      if (productList.value.length >= 1 && !hasVipEntry.value) {
        hasVipEntry.value = true
        productList.value.splice(1, 0, { vipEntry: true })
      }
    } else {
      $toast.info(res.message)
    }
  } catch (e) {
    $toast.info('系统错误')
    loading.value = false
  }
}

const clickCategory = (item) => {
  if (!item.categoryId || item.status === 0) {
    return
  }
  params.value.categoryId = item.categoryId
  getProductList(true)
}

const clickFilter = (item) => {
  params.value.sortType = item.type
  // 价格排序
  if (params.value.sortType === 'price') {
    if (params.value.order === 'low') {
      params.value.order = 'hight'
    } else {
      params.value.order = 'low'
    }
  }
  getProductList(true)
}

const toVip = () => {
  // router.push('');
}

const clickProduct = (item) => {
  // router.push('');
}

const addCart = async ({ productId, skuId }) => {
  try {
    const res = await api.post('/shop/cart/add', { productId, skuId, quantity: 1 })
    if (res.code === 200) {
      $toast.info('加入购物车成功')
    } else {
      $toast.info(res.message)
    }
  } catch (e) {
    $toast.info('系统错误')
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
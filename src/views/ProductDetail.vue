<template>
  <div class="product-detail">
    <Header title=""></Header>
    <div class="body">
      <div class="swiper" v-if="productData.images?.length">
        <van-swipe :autoplay="3000" indicator-color="#FFB169" lazy-render>
          <van-swipe-item v-for="item, index in productData.images" :key="index">
            <div class="avatar">
              <img :src="item" />
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="main">
        <div class="module module1">
          <div class="point">
            <span class="text">积分</span>
            <span class="count">{{ formatNumberWithCommas(selectSku.price) }}</span>
          </div>
          <div class="name">{{ productData.productName }}</div>
          <div class="desc">{{ productData.description }}</div>
          <div class="sku-list" v-if="productData.skuList?.length">
            <template v-for="item, index in productData.skuList" :key="index">
              <div class="sku" :class="{ 'selected': item.skuId === selectSkuId }" @click="selectSkuId = item.skuId">
                <div class="sku-img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
                <span class="sku-name">{{ item.skuName }}</span>
              </div>
            </template>
          </div>
        </div>
        <!-- <div class="module module2">
          <span class="desc">限制</span>
          <span class="text">不可使用优惠券丨每人每日限购15瓶</span>
        </div> -->
      </div>
    </div>
    <div class="footer">
      <div class="cart" @click="toCart">
        <img src="@/assets/images/product-detail/cart.png" alt="">
      </div>
      <div class="settlement" @click="toSettlement">立即兑换</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatNumberWithCommas } from '@/utils'

const route = useRoute()
const router = useRouter()

const params = reactive({
  productId: ''
})
const productData = ref({})
const selectSkuId = ref('')

onMounted(() => {
  params.productId = +route.params.productId
  init()
})

const init = async () => {
  $toast.loading()
  await getProductDetail()
  $toast.close()
}

const getProductDetail = async () => {
  try {
    const res = await api.post('/shop/product/detail', params)
    if (res.code === 200) {
      productData.value = {
        ...(res.data || {}),
        images: res.data.images ? JSON.parse(res.data.images) : []
      }
      selectSkuId.value = res.data.skuList[0].skuId || {}
    } else {
      $toast.info(res.message)
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const selectSku = computed(() => {
  return productData.value.skuList ? productData.value.skuList.find(item => item.skuId === selectSkuId.value) : {}
})

const toCart = () => {
  router.push({ name: 'cart' })
}

const toSettlement = () => {
  const selectCart = [{
    ...selectSku.value,
    productImage: productData.value.mainImage,
    productName: productData.value.productName,
    quantity: 1
  }]
  localStorage.setItem('selectCart', JSON.stringify(selectCart))
  localStorage.removeItem('selectAddress')
  router.push({ name: 'settlement', params: { source: 'product-detail' } })
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.product-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F4F4F4;
  position: relative;

  .header {
    width: 100%;
    background-color: transparent;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
  }

  .body {
    flex: 1;
    overflow: auto;

    .swiper {
      margin-bottom: .vw(8)[];

      .avatar {
        width: 100%;
        height: .vw(393)[];
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          max-width: 100%;
          height: 100%;
        }
      }
    }

    .main {
      padding: 0 .vw(16)[];

      .module {
        border-radius: .vw(9)[];
        background-color: #fff;
        padding: .vw(12)[] .vw(10)[];
        margin-bottom: .vw(8)[];
      }

      .module1 {
        .point {
          display: flex;
          align-items: center;
          margin-bottom: .vw(16)[];

          .text {
            color: #F20C32;
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
            margin-right: .vw(4)[];
          }

          .count {
            color: #F20C32;
            font-family: "PingFang SC";
            font-size: .vw(18)[];
            line-height: .vw(18)[];
            font-weight: 500;
            font-style: normal;
          }
        }

        .name {
          color: #151F04;
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 400;
          font-style: normal;
          margin-bottom: .vw(14)[];
        }

        .desc {
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(12)[];
          line-height: .vw(12)[];
          font-weight: 400;
          font-style: normal;
          margin-bottom: .vw(16)[];
        }

        .sku-list {
          display: flex;
          align-items: center;
          overflow-y: hidden;
          overflow-x: auto;

          .sku {
            display: flex;
            align-items: center;
            border-radius: .vw(3)[];
            border: 1px solid transparent;
            background-color: #F2F2F2;
            padding: .vw(6)[] .vw(8)[];

            &:not(:last-of-type) {
              margin-right: .vw(8)[];
            }

            &.selected {
              border: 1px solid #FF7716;
              background-color: rgba(#FFB169, 0.45);
            }

            .sku-img {
              width: .vw(20)[];
              height: .vw(20)[];
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: .vw(4)[];

              img {
                max-width: 100%;
                max-height: 100%;
              }
            }

            .sku-name {
              color: #151F04;
              font-family: "PingFang SC";
              font-size: .vw(12)[];
              line-height: .vw(12)[];
              font-weight: 400;
              font-style: normal;
              white-space: nowrap;
            }
          }
        }
      }

      .module2 {
        display: flex;
        align-items: center;

        .desc {
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(12)[];
          line-height: .vw(12)[];
          font-weight: 400;
          font-style: normal;
          margin-right: .vw(16)[];
        }

        .text {
          color: #151F04;
          font-family: "PingFang SC";
          font-size: .vw(12)[];
          line-height: .vw(12)[];
          font-weight: 400;
          font-style: normal;
        }
      }

    }
  }

  .footer {
    height: .vw(64)[];
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: .vw(8)[] .vw(16)[];

    .cart {
      width: .vw(28)[];
      height: .vw(28)[];
      margin-right: .vw(24)[];

      img {
        width: 100%;
        height: 100%;
      }
    }

    .settlement {
      flex: 1;
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(16)[];
      line-height: .vw(48)[];
      font-weight: 500;
      text-align: center;
      font-style: normal;
      border-radius: .vw(45)[];
      background-color: #FFB169;
    }
  }
}
</style>
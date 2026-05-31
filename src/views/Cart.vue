<template>
  <main class="cart">
    <Header :show-back="false" title="背包">
      <template #right>
        <span class="address-edit" @click="toAddress">地址管理</span>
      </template>
    </Header>
    <div class="body">
      <div class="tag">
        <div class="all-quantity">背包总共{{ cartList.length }}件</div>
        <div class="trash-cart" v-if="cartList.length">
          <i class="icon"></i>
          <span class="text" @click="clickClearCart">清空背包</span>
        </div>
      </div>
      <InfiniteScroll :loading="loading" :loadOver="loadOver" :empty="isEmpty" @load="loadMore">
        <template #content>
          <div class="cart-list">
            <template v-for="(item, index) in cartList" :key="index">
              <div class="item" v-if="item.quantity > 0">
                <div class="check">
                  <i class="select" :class="{ 'selected': item.selected === 1 }" @click="clickSelectCart(item)"></i>
                </div>
                <div class="module">
                  <div class="cover">
                    <img :src="item.productImage" alt="">
                  </div>
                  <div class="info">
                    <p class="name">{{ item.productName }}</p>
                    <p class="desc">规格：{{ item.skuName }}</p>
                    <p class="price">积分 {{ formatNumberWithCommas(item.price) }}</p>
                  </div>
                </div>
                <div class="option">
                  <i class="sub" :class="{ 'disabled': item.quantity < 1 }" @click="subQuantity(item)"></i>
                  <div class="quantity">
                    <input type="number" v-model="item.quantity" @input="quantityChange($event, item)">
                  </div>
                  <i class="plus" :class="{ 'disabled': item.quantity >= item.stock }" @click="plusQuantity(item)"></i>
                </div>
              </div>
            </template>
          </div>
        </template>
      </InfiniteScroll>
    </div>
    <div class="footer">
      <div class="select-all" @click="clickAll">
        <i class="icon" :class="{ 'selected': cartListIsAll }"></i>
        <span class="text">全选</span>
      </div>
      <div class="price">
        <p class="text">合计积分</p>
        <p class="quantity">{{ formatNumberWithCommas(selectedItemPrice) }}</p>
      </div>
      <div class="checkout" :class="{ 'disabled': !selectedItemQuantity }" @click="clickSettlement">
        <span class="text">去结算{{ selectedItemQuantity ? `(${selectedItemQuantity})` : '' }}</span>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import { formatNumberWithCommas } from '@/utils'

const router = useRouter()

const params = ref({
  current: 1,
  pageSize: 20,
})
const cartList = ref([])
const loading = ref(false)
const loadOver = ref(false)
const isEmpty = ref(false)

onMounted(() => {
  init()
})

const init = async () => {
  $toast.loading()
  await getCartList(true)
  $toast.close()
}

const getCartList = async (init) => {
  if (init) {
    params.value.current = 1
    cartList.value = []
    loadOver.value = false
    isEmpty.value = false
  }
  try {
    loading.value = true
    const res = await api.post('/shop/cart/list', params.value)
    loading.value = false
    if (res.code === 200) {
      res.data = {
        data: res.data,
        total: 0
      }
      const list = res.data.data || []
      cartList.value = [...cartList.value, ...list]
      params.value.current++
      // 加载完毕
      loadOver.value = cartList.value.length >= res.data.total
      // 空列表
      isEmpty.value = loadOver.value && cartList.value.length === 0
    } else {
      $toast.info(res.message)
    }
  } catch (e) {
    $toast.info('系统错误')
    loading.value = false
  }
}

const selectedCartList = computed(() => {
  return cartList.value.filter(item => item.selected === 1)
})

const selectedItemQuantity = computed(() => {
  if (selectedCartList.value.length) {
    return selectedCartList.value
      .map(item => item.quantity)
      .reduce((a, b) => (a || 0) + (b || 0))
  }
  return 0
})

const selectedItemPrice = computed(() => {
  if (selectedCartList.value.length) {
    return selectedCartList.value
      .map(item => item.quantity * item.price)
      .reduce((a, b) => (a || 0) + (b || 0))
  }
  return 0
})

const cartListIsAll = computed(() => {
  return cartList.value.length && cartList.value.every(item => item.selected === 1)
})

const clickSelectCart = (item) => {
  item.selected = (item.selected ? 0 : 1)
  updateCart(item)
}

const subQuantity = (item) => {
  item.quantity--
  if (item.quantity === 0) {
    deleteCart(item)
  } else {
    updateCart(item)
  }
}

const plusQuantity = (item) => {
  item.quantity++
  updateCart(item)
}

const quantityChange = (event, item) => {
  const min = 1
  const max = item.stock
  const quantity = +event.target.value
  item.quantity = Math.min(Math.max(quantity, min), max)
  updateCart(item)
}

const loadMore = () => {
  getCartList()
}

const clickAll = () => {
  if (!cartList.value.length) {
    return
  }
  cartList.value = cartList.value.map(item => {
    return {
      ...item,
      selected: !cartListIsAll.value ? 1 : 0
    }
  })
}

const clickSettlement = () => {
  localStorage.setItem('selectCart', JSON.stringify(selectedCartList.value))
  localStorage.removeItem('selectAddress')
  router.push({ name: 'settlement' })
}

const toAddress = () => {
  router.push({ name: 'address' });
}

const clickClearCart = () => {
  $modal.show({
    content: '是否清空背包？',
    onConfirm: () => {
      clearCart()
    }
  })
}

const updateCart = async ({ cartId, quantity, selected }) => {
  try {
    const res = await api.post('/shop/cart/update', { cartId, quantity, selected })
    if (res.code === 200) {
      // ...
    } else {
      $toast.info(res.message)
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const deleteCart = async ({ cartId }) => {
  try {
    const res = await api.post('/shop/cart/delete', { cartId })
    if (res.code === 200) {
      cartList.value = cartList.value.filter(item => item.cartId != cartId)
    } else {
      $toast.info(res.message)
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const clearCart = async () => {
  try {
    const res = await api.post('/shop/cart/clear', {})
    if (res.code === 200) {
      cartList.value = []
      isEmpty.value = true
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

.cart {
  display: flex;
  flex-direction: column;

  .address-edit {
    color: var(--text--);
    font-family: "PingFang SC";
    font-size: .vw(14)[];
    line-height: .vw(14)[];
    font-weight: 400;
    font-style: normal;
  }

  .body {
    flex: 1;
    padding: .vw(12)[] .vw(16)[];
    overflow-x: hidden;
    overflow-y: auto;

    .tag {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: .vw(8)[];

      .all-quantity {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 400;
      }

      .trash-cart {
        display: flex;
        align-items: center;

        .icon {
          width: .vw(14)[];
          height: .vw(14)[];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/shop/trash.png);
          margin-right: .vw(8)[];
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

    .cart-list {
      .item {
        display: flex;
        padding: .vw(16)[];

        .check {
          height: 100%;
          display: flex;
          align-self: center;
          align-items: center;
          margin-right: .vw(8)[];

          .select {
            width: .vw(24)[];
            height: .vw(24)[];
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(@/assets/images/shop/select.png);

            &.selected {
              background-image: url(@/assets/images/shop/selected.png);
            }
          }
        }

        .module {
          flex: 1;
          display: flex;

          .cover {
            width: .vw(56)[];
            height: .vw(56)[];
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: .vw(8)[];

            img {
              max-width: 100%;
              max-height: 100%;
            }
          }

          .info {
            .name {
              color: var(--light-text--);
              font-family: "PingFang SC";
              font-size: .vw(14)[];
              line-height: .vw(14)[];
              font-weight: 500;
              font-style: normal;
              margin-bottom: .vw(6)[];
            }

            .desc {
              color: var(--text--);
              font-family: "PingFang SC";
              font-size: .vw(12)[];
              line-height: .vw(12)[];
              font-weight: 400;
              font-style: normal;
              margin-bottom: .vw(6)[];
            }

            .price {
              color: var(--orange--);
              font-family: "PingFang SC";
              font-size: .vw(14)[];
              line-height: .vw(14)[];
              font-weight: 500;
              font-style: normal;
            }
          }
        }

        .option {
          display: flex;
          align-items: center;
          align-self: flex-end;
          border: .vw(1.5)[] solid #EDEDF0;
          border-radius: .vw(3)[];

          i,
          span {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          i {
            width: .vw(18)[];
            height: .vw(18)[];
            background-size: 70%;
            background-position: center;
            background-repeat: no-repeat;

            &.disabled {
              opacity: .5;
              pointer-events: none;
            }
          }

          .sub {
            background-image: url(@/assets/images/sub.png);
          }

          .plus {
            background-image: url(@/assets/images/plus.png);
          }

          .quantity {
            min-width: .vw(30)[];
            width: .vw(30)[];
            height: .vw(18)[];
            display: flex;
            align-items: center;
            border-left: .vw(1.5)[] solid #EDEDF0;
            border-right: .vw(1.5)[] solid #EDEDF0;

            input {
              width: 100%;
              height: .vw(14)[];
              color: var(--light-text--);
              font-family: "PingFang SC";
              font-size: .vw(12)[];
              line-height: .vw(12)[];
              font-weight: 500;
              font-style: normal;
              text-align: center;
              outline: none;
              border: none;
            }
          }
        }
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: .vw(1)[] solid #EDEDF0;
    padding: .vw(8)[] .vw(16)[];

    .select-all {
      display: flex;
      align-items: center;

      .icon {
        width: .vw(24)[];
        height: .vw(24)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/shop/select.png);
        margin-right: .vw(8)[];

        &.selected {
          background-image: url(@/assets/images/shop/selected.png);

        }
      }

      .text {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 500;
        font-style: normal;
      }
    }

    .price {
      margin-left: .vw(30)[];
      margin-right: .vw(10)[];

      .text {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(12)[];
        line-height: .vw(12)[];
        font-weight: 400;
        font-style: normal;
        margin-bottom: .vw(4)[];
      }

      .quantity {
        color: var(--orange--);
        font-family: "PingFang SC";
        font-size: .vw(18)[];
        line-height: .vw(18)[];
        font-weight: 500;
        font-style: normal;
      }
    }

    .checkout {
      width: .vw(130)[];
      height: .vw(48)[];
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: .vw(45)[];
      background-color: #FFB169;

      .text {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 500;
        font-style: normal;
      }

      &.disabled {
        pointer-events: none;
        background-color: rgba(#FFB169, 0.75);
      }
    }
  }
}
</style>
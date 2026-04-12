<template>
  <main class="cart">
    <Header :show-back="false" title="背包">
      <template #right>
        <span class="address-edit">地址管理</span>
      </template>
    </Header>
    <div class="body">
      <div class="tag">
        <div class="all-count">购物车总共15件</div>
        <div class="trash-cart">
          <i class="icon"></i>
          <span class="text">清空购物车</span>
        </div>
      </div>
      <div class="cart-list">
        <InfiniteScroll :loading="loading" :loadOver="loadOver" @load="loadMore">
          <template #content>
            <div class="item" v-for="(item, index) in cartList" :key="index">
              <div class="check">
                <i class="select" :class="{ 'selected': item.selected }" @click="item.selected = !item.selected"></i>
              </div>
              <div class="module">
                <div class="cover">
                  <img src="@/assets/images/shop/cover.png" alt="">
                </div>
                <div class="info">
                  <p class="name">​​反骨糯米糍​​</p>
                  <p class="desc">规格：500克</p>
                  <p class="point">积分 {{ formatNumberWithCommas(item.point) }}</p>
                </div>
              </div>
              <div class="option">
                <i class="sub" :class="{ 'disabled': item.count <= 1 }" @click="item.count--"></i>
                <div class="count">
                  <input type="number" v-model="item.count" @input="countChange($event, item)">
                </div>
                <i class="plus" :class="{ 'disabled': item.count >= item.maxCount }" @click="item.count++"></i>
              </div>
            </div>
          </template>
        </InfiniteScroll>
      </div>
    </div>
    <div class="footer">
      <div class="select-all" @click="clickAll">
        <i class="icon" :class="{ 'selected': cartListIsAll }"></i>
        <span class="text">全选</span>
      </div>
      <div class="point">
        <p class="text">合计积分</p>
        <p class="count">{{ formatNumberWithCommas(selectedItemPoint) }}</p>
      </div>
      <div class="checkout" :class="{ 'disabled': !selectedItemCount }" @click="clickSettlement">
        <span class="text">去结算({{ selectedItemCount }})</span>
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

const cartList = ref([
  { selected: false, count: 1, maxCount: 10, point: 1000 },
  { selected: false, count: 1, maxCount: 10, point: 100 },
  { selected: false, count: 1, maxCount: 10, point: 100 },
  { selected: false, count: 1, maxCount: 10, point: 100 },
  { selected: false, count: 1, maxCount: 10, point: 100 },
  { selected: false, count: 1, maxCount: 10, point: 100 },
  { selected: false, count: 1, maxCount: 10, point: 100 },
])
const loading = ref(false)
const loadOver = ref(false)

onMounted(() => {

})

const selectedCartList = computed(() => {
  return cartList.value.filter(item => item.selected)
})

const selectedItemCount = computed(() => {
  if (selectedCartList.value.length) {
    return selectedCartList.value
      .map(item => item.count)
      .reduce((a, b) => (a || 0) + (b || 0))
  }
  return 0
})

const selectedItemPoint = computed(() => {
  if (selectedCartList.value.length) {
    return selectedCartList.value
      .map(item => item.count * item.point)
      .reduce((a, b) => (a || 0) + (b || 0))
  }
  return 0
})

const cartListIsAll = computed(() => {
  return cartList.value.every(item => item.selected)
})

const countChange = (event, item) => {
  const min = 1
  const max = item.maxCount
  const count = +event.target.value
  item.count = Math.min(Math.max(count, min), max)
}

const loadMore = () => {
  loading.value = true
  const timer = setTimeout(() => {
    clearTimeout(timer)
    loading.value = false
    loadOver.value = true
    cartList.value = [...cartList.value, ...cartList.value]
  }, 1000)
}

const clickAll = () => {
  cartList.value = cartList.value.map(item => {
    return {
      ...item,
      selected: !cartListIsAll.value
    }
  })
}

const clickSettlement = () => {
  // console.log(111, selectedCartList.value)
  router.push({ name: 'settlement' })
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

      .all-count {
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

            .point {
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

          .count {
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

    .point {
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

      .count {
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
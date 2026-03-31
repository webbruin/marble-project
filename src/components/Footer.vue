<template>
  <footer>
    <div class="icons">
      <div class="item" v-for="(item, index) in icons" :key="index" @click="clickIcon(item)">
        <img class="icon" :src="currentRoute == item.value ? item.icon2 : item.icon1" alt="">
        <span class="text" :class="{ light: currentRoute == item.value }">{{ item.name }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const icons = ref([
  {
    name: '首页',
    value: 'home',
    icon1: new URL(`@/assets/images/footer/home.png`, import.meta.url).href,
    icon2: new URL(`@/assets/images/footer/home-selected.png`, import.meta.url).href,
    url: '/'
  },
  {
    name: '商场',
    value: 'shop',
    icon1: new URL(`@/assets/images/footer/shop.png`, import.meta.url).href,
    icon2: new URL(`@/assets/images/footer/shop-selected.png`, import.meta.url).href,
    url: '/shop'
  },
  {
    name: '背包',
    value: 'cart',
    icon1: new URL(`@/assets/images/footer/cart.png`, import.meta.url).href,
    icon2: new URL(`@/assets/images/footer/cart-selected.png`, import.meta.url).href,
    url: '/cart'
  },
  {
    name: '我的',
    value: 'my',
    icon1: new URL(`@/assets/images/footer/my.png`, import.meta.url).href,
    icon2: new URL(`@/assets/images/footer/my-selected.png`, import.meta.url).href,
    url: '/my'
  },
])
const currentRoute = ref(route.name)

onMounted(() => {

})

watch(
  () => route.name, (newName, oldName) => {
    currentRoute.value = newName;
  }
)

const clickIcon = item => {
  router.push(item.url);
}

</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

footer {
  height: .vw(60)[];

  .icons {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .item {
      width: .vw(50)[];
      height: .vw(45)[];
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      .icon {
        width: .vw(28)[];
        height: .vw(28)[];
        margin-bottom: .vw(3)[];
      }

      .text {
        color: var(--text--);
        text-align: center;
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        font-style: normal;
        font-weight: 500;
        line-height: .vw(14)[];

        &.light {
          color: var(--light-text--);
        }
      }
    }
  }
}
</style>
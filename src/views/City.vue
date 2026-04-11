<template>
  <main class="city">
    <Header title="选择城市"></Header>
    <div class="body">
      <div class="module" :id="item.key" v-for="(item, index) in cityData" :key="index">
        <p class="title">{{ item.key }}</p>
        <div class="item" v-for="(childItem, childIndex) in item.cityList" :key="childIndex"
          @click="selectCity(childItem, item.key)">
          <span class="name">{{ childItem.name }}</span>
        </div>
      </div>
    </div>
    <div class="tags">
      <div class="item" :id="item.key" v-for="(item, index) in cityData" :key="index">
        <a :href="`#${item.key}`" @click="clickCount--">{{ item.key }}</a>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import cityData from '../utils/city-data'

const router = useRouter()

const clickCount = ref(-1)

onMounted(() => {

})

const selectCity = (city, key) => {
  localStorage.setItem('select-city', JSON.stringify(city))
  router.go(clickCount.value)
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.city {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 .vw(18)[] .vw(20)[];

    .module {
      &:not(:last-of-type) {
        margin-bottom: .vw(16)[];
      }

      .title {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 500;
        font-style: normal;
        margin-bottom: .vw(10)[];
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .name {
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(30)[];
          font-weight: 400;
          font-style: normal;
        }
      }
    }
  }

  .tags {
    position: fixed;
    right: .vw(8)[];
    top: 50%;
    transform: translateY(-50%);

    .item {
      line-height: .vw(18)[];
      display: flex;
      align-items: center;
      justify-content: center;

      a {
        color: var(--text--);
        font-family: "PingFang SC";
        font-size: .vw(10)[];
        font-weight: 400;
        font-style: normal;
      }
    }
  }
}
</style>
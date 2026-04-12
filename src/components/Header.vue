<template>
  <div class="header">
    <div class="back" v-if="showBack" @click="back"></div>
    <p class="title" v-if="title">{{ title }}</p>
    <div class="slot">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  showBack: {
    type: Boolean,
    default: true
  },
  title: String,
})

onMounted(() => {

})

const back = () => {
  router.back()
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.header {
  height: .vw(54)[];
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: var(--white--);

  .back {
    width: .vw(40)[];
    height: .vw(40)[];
    background-size: .vw(24)[] .vw(24)[];
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/arrow-left.png);
    position: absolute;
    left: .vw(6)[];
  }

  .title {
    max-width: 70%;
    color: var(--light-text--);
    font-family: "PingFang SC";
    font-size: .vw(18)[];
    line-height: .vw(18)[];
    font-weight: 500;
    font-style: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .slot {
    position: absolute;
    right: .vw(10)[];
  }
}
</style>
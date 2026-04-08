<template>
  <div class="ball-success" v-if="show">
    <div class="body">
      <img src="@/assets/images/ball.png" alt="">
    </div>
    <div class="close" @click="closeDialog">恭喜弹珠X{{ ball }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  show: Boolean,
  ball: Number,
})
const emit = defineEmits(['toggleShow'])
const time = ref(2000)
const timer = ref(null)

onMounted(() => {

})

watch(
  () => props.show, (newName, oldName) => {
    if (newName) {
      timer.value = setTimeout(() => {
        closeDialog()
      }, time.value)
    }
  }
)

const closeDialog = () => {
  clearTimeout(timer.value)
  emit('toggleShow', false)
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.ball-success {
  width: 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(#272933, 0.75);
  position: fixed;
  z-index: 10001;
  left: 0;
  top: 0;

  .body {
    width: .vw(368)[];
    height: .vw(368)[];
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: relative;
    margin-top: .vw(-180)[];

    &::before {
      content: '';
      width: 100%;
      height: 100%;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/flash.png);
      position: absolute;
      animation: rotate 2s linear infinite;

      @keyframes rotate {
        to {
          transform: rotate(360deg);
        }
      }
    }

    img {
      width: .vw(120)[];
      height: .vw(120)[];
      z-index: 1;
    }
  }

  .close {
    height: .vw(40)[];
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--white--);
    font-family: "PingFang SC";
    font-size: .vw(16)[];
    line-height: .vw(16)[];
    font-weight: 500;
    font-style: normal;
    border-radius: .vw(45)[];
    border: .vw(1)[] solid #FF3A64;
    background: linear-gradient(90deg, #FD689A 0%, #FFAB2D 100%);
    padding: .vw(8)[] .vw(18)[];
    z-index: 1;
    margin-top: .vw(-80)[];
  }
}
</style>
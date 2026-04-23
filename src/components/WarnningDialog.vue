<template>
  <div class="warnning-dialog" v-if="show">
    <div class="body">
      <p class="text">本房间为{{ level }}</p>
      <p class="desc">单次消耗 {{ ball }} 枚弹珠</p>
      <div class="confirm" @click="confirmDialog">确认</div>
    </div>
    <!-- <div class="close" @click="closeDialog"></div> -->
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  show: Boolean,
  level: String,
  ball: Number,
})
const emit = defineEmits(['toggleShow'])

onMounted(() => {

})

const confirmDialog = () => {
  closeDialog()
}

const closeDialog = () => {
  emit('toggleShow', false)
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.warnning-dialog {
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
    width: .vw(330)[];
    height: .vw(242)[];
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/room/warninng-dialog-bg.png);
    position: relative;
    padding-top: .vw(50)[];

    &::before {
      content: '';
      width: .vw(174)[];
      height: .vw(174)[];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/room/warninng-dialog-icon.png);
      position: absolute;
      top: .vw(-102)[];
      right: .vw(-26)[];
    }

    .text {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(32)[];
      line-height: .vw(32)[];
      font-weight: 600;
      font-style: normal;
      margin-bottom: .vw(24)[];
    }

    .desc {
      color: #50525C;
      font-family: "PingFang SC";
      font-size: .vw(24)[];
      line-height: .vw(24)[];
      font-weight: 500;
      font-style: normal;
      margin-bottom: .vw(24)[];
    }

    .confirm {
      width: .vw(130)[];
      height: .vw(40)[];
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--white--);
      font-size: .vw(16)[];
      line-height: .vw(16)[];
      font-weight: 500;
      font-style: normal;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/room/warninng-dialog-confirm.png);
    }
  }

  .close {
    width: .vw(24)[];
    height: .vw(24)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/close.png);
    margin-top: .vw(40)[];
  }
}
</style>
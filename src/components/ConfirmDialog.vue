<template>
  <div class="confirm-mask" v-if="show"></div>
  <div class="confirm-dialog" :class="{ 'show': show }">
    <div class="body">
      <p class="title">确认</p>
      <div class="room" @click="selectedRoom = !selectedRoom">
        <img src="@/assets/images/home/room-bg.png" alt="" class="cover">
        <div class="info">
          <p class="text">{{ level }}房间</p>
          <p class="desc">投入弹珠：5枚</p>
        </div>
        <i class="select" :class="{ 'selected': selectedRoom }"></i>
      </div>
      <div class="ball-count" @click="selectedBall = !selectedBall">
        <img src="@/assets/images/ball.png" alt="" class="ball">
        <span class="text">弹珠支付（剩余：6）</span>
        <i class="select" :class="{ 'selected': selectedBall }"></i>
      </div>
    </div>
    <div class="footer">
      <div class="text">小计：5枚弹珠</div>
      <div class="button" @click="clickConfirm">确认</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  level: String,
  show: Boolean,
})
const emit = defineEmits(['toggleShow'])

const selectedRoom = ref(false)
const selectedBall = ref(false)

onMounted(() => {

})

const clickConfirm = () => {
  emit('toggleShow', false)
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.confirm-mask {
  width: 100vw;
  height: 100vh;
  background-color: rgba(#272933, 0.75);
  position: fixed;
  z-index: 10001;
  left: 0;
  bottom: 0;
}

.confirm-dialog {
  width: 100vw;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 10002;
  left: 0;
  bottom: 0;
  transform: translateY(115%);
  transition: transform .2s;

  &.show {
    transform: translateY(0);
  }

  .body {
    width: 100%;
    height: .vw(252)[];
    display: flex;
    flex-direction: column;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/room/confirm-dialog-bg.png);
    position: relative;
    // padding-top: .vw(50)[];
    padding: .vw(23)[] .vw(16)[] .vw(8)[] .vw(16)[];

    &::before {
      content: '';
      width: .vw(134)[];
      height: .vw(134)[];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/room/confirm-dialog-icon.png);
      position: absolute;
      top: .vw(-57)[];
      right: .vw(4)[];
    }

    .title {
      font-size: .vw(30)[];
      line-height: .vw(30)[];
      font-weight: 900;
      font-style: normal;
      letter-spacing: .vw(5)[];
      margin-bottom: .vw(20)[];
    }

    .room {
      flex: 1;
      display: flex;
      align-items: center;
      border-radius: .vw(12)[];
      background-color: var(--white--);
      padding: .vw(12)[];
      margin-bottom: .vw(8)[];

      .cover {
        max-width: .vw(120)[];
        max-height: .vw(90)[];
        margin-right: .vw(12)[];
      }

      .info {
        flex: 1;

        .text {
          color: var(--light-text--);
          font-family: "PingFang SC";
          font-size: .vw(18)[];
          line-height: .vw(18)[];
          font-weight: 500;
          font-style: normal;
          margin-bottom: .vw(12)[];
        }

        .desc {
          color: #FFB169;
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 500;
          font-style: normal;
        }
      }

      .select {
        width: .vw(24)[];
        height: .vw(24)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/shop/select.png);
        margin-left: .vw(10)[];

        &.selected {
          background-image: url(@/assets/images/shop/selected.png);
        }
      }
    }

    .ball-count {
      display: flex;
      align-items: center;
      border-radius: .vw(12)[];
      background-color: var(--white--);
      padding: .vw(12)[];

      .ball {
        width: .vw(24)[];
        height: .vw(24)[];
        margin-right: .vw(8)[];
      }

      .text {
        flex: 1;
      }

      .select {
        width: .vw(24)[];
        height: .vw(24)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/shop/select.png);
        margin-left: .vw(10)[];

        &.selected {
          background-image: url(@/assets/images/shop/selected.png);
        }
      }
    }
  }

  .footer {
    height: .vw(58)[];
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--white--);
    padding: .vw(8)[] .vw(16)[];

    .text {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(14)[];
      line-height: .vw(14)[];
      font-weight: 400;
      font-style: normal;
    }

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(16)[];
      line-height: .vw(16)[];
      font-weight: 500;
      font-style: normal;
      border-radius: .vw(45)[];
      background-color: #FFB169;
      padding: .vw(12)[] .vw(24)[];
    }
  }
}
</style>
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="confirm" v-if="visible">
        <div class="body">
          <i class="close"></i>
          <p class="title">
            <i class="icon"></i>
            <span class="text">{{ title }}</span>
          </p>
          <p class="content">{{ content }}</p>
          <div class="buttons">
            <div class="cancel" v-if="showCancel" @click="clickCancel">{{ cancelText }}</div>
            <div class="ok" v-if="showConfirm" @click="clickConfirm">{{ confirmText }}</div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '小提示'
  },
  content: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  onCancel: { type: Function },
  onConfirm: { type: Function },
})

const visible = ref(true)

onMounted(() => {

})

// 暴露关闭方法
const close = () => {
  visible.value = false
}

defineExpose({ close })

const clickCancel = () => {
  if (props.onCancel) {
    props.onCancel()
  }
  close()
}

const clickConfirm = () => {
  if (props.onConfirm) {
    props.onConfirm()
  }
  close()
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.confirm {
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
    width: .vw(345)[];
    border-radius: .vw(9)[];
    background-color: var(--white--);
    position: relative;
    padding: .vw(24)[];

    .close {
      width: .vw(16)[];
      height: .vw(16)[];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(../@/assets/images/close.png);
      position: absolute;
      right: .vw(16)[];
      top: .vw(16)[];
    }

    .title {
      display: flex;
      align-items: center;

      .icon {
        width: .vw(18)[];
        height: .vw(18)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(../@/assets/images/warning-icon.png);
        margin-right: .vw(6)[];
      }

      .text {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(18)[];
        line-height: .vw(18)[];
        font-weight: 500;
        font-style: normal;
      }
    }

    .content {
      min-height: .vw(100)[];
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(16)[];
      line-height: .vw(22)[];
      font-weight: 400;
      font-style: normal;
      display: flex;
      flex-direction: column;
      padding: .vw(24)[] 0;
    }

    .buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      div {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 500;
        font-style: normal;
        border-radius: .vw(9)[];
        padding: .vw(12)[] .vw(24)[];

        &:not(:last-of-type) {
          margin-right: .vw(12)[];
        }
      }

      .cancel {
        border: .vw(1)[] solid #E3E3E4;
      }

      .ok {
        background-color: #FF7716;
      }
    }
  }
}
</style>
<template>
  <Transition name="fade">
    <div v-if="visible" class="toast" :class="`${type}`">
      <img v-if="loading" src="@/assets/images/loading.png" alt="" class="loading">
      <span class="text">{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: String,
  // success, error, warning
  type: {
    type: String,
    default: 'info'
  },
  // 自动关闭时间，0 表示不自动关闭
  duration: {
    type: Number,
    default: 2000
  },
  loading: Boolean
})

const visible = ref(true)

// 暴露关闭方法
const close = () => {
  visible.value = false
}

defineExpose({ close })

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.toast {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 20000;
  transform: translate(-50%, -50%);
  padding: .vw(10)[] .vw(20)[];
  border-radius: .vw(8)[];
  background-color: rgba(#000, 0.8);

  .loading {
    width: .vw(30)[];
    height: .vw(30)[];
    margin-top: .vw(15)[];
    margin-bottom: .vw(15)[];
    animation: rotate 1.5s linear infinite;

    @keyframes rotate {
      to {
        transform: rotate(360deg);
      }
    }
  }

  .text {
    color: var(--white--);
    font-size: .vw(14)[];
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
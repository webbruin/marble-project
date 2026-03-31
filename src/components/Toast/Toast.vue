<template>
  <Transition name="fade">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
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
  }
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
  min-width: 55%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: .vw(10)[] .vw(20)[];
  border-radius: .vw(8)[];
  background-color: #333;
  color: var(--white--);
  text-align: center;
  z-index: 20000;
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
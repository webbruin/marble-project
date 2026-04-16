<template>
  <slot name="content" />
  <div ref="load" class="load" :class="{ 'empty': empty }">{{ loadOver ? '到底了' : '加载中...' }}</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  loadOver: {
    type: Boolean,
    default: false
  },
  empty: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['refresh', 'load'])

const observer = ref(null)
const load = ref(null)

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => {
    if (props.loading || props.loadOver) {
      return
    }
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        emit('load', false)
      }
    })
  }, {
    root: null,
    threshold: 0.1
  })
  if (load.value) {
    observer.value.observe(load.value)
  }
})

onUnmounted(() => {
  // 组件卸载时断开观察
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.pull {}

.load {
  width: 100%;
  color: var(--text--);
  font-family: "PingFang SC";
  font-size: .vw(14)[];
  line-height: .vw(30)[];
  font-weight: 400;
  font-style: normal;
  text-align: center;

  &.empty {
    opacity: 0;
  }
}
</style>
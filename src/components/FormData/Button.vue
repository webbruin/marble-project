<template>
  <div class="button" :class="{ 'disabled': disabled }" :style="style" @click="clickSubmit">{{ buttonText }}
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  buttonText: {
    type: String,
    default: '确定'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  style: {
    type: Object
  }
})
const emit = defineEmits(['click'])

onMounted(() => {

})

const clickSubmit = () => {
  emit('click', false)
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.button {
  color: var(--light-text--);
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: "PingFang SC";
  font-size: .vw(16)[];
  line-height: .vw(27)[];
  font-weight: 500;
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: .vw(14)[];
  background-color: #FFB169;
  padding: .vw(10)[] .vw(16)[];

  &.disabled {
    // background-color: #FFCA91;
    opacity: 0.7;
    pointer-events: none;
  }
}
</style>
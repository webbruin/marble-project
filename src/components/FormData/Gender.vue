<template>
  <div class="gender-checked">
    <div class="gender-item" :class="{ 'selected': props.value === item.type, 'disabled': props.disabled }"
      v-for="(item, index) in genderList" :key="index" @click="clickGender(item.type)">
      <img :src="item.icon" alt="" class="gender-icon">
      <span class="gender-text">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  value: {
    type: Number,
  },
  disabled: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['click'])
const genderList = ref([
  { name: '男', type: 1, icon: new URL(`@/assets/images/boy.png`, import.meta.url).href, },
  { name: '女', type: 2, icon: new URL(`@/assets/images/girl.png`, import.meta.url).href, },
])

onMounted(() => {

})

const clickGender = (type) => {
  if (props.value === type) {
    return
  }
  emit('click', type)
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.gender-checked {
  display: flex;
  align-items: center;

  .gender-item {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .vw(14)[];
    background-color: #EFEFEF;
    padding: .vw(10)[] .vw(16)[];

    &:not(:last-of-type) {
      margin-right: .vw(18)[];
    }

    .gender-icon {
      width: .vw(18)[];
      height: .vw(18)[];
      margin-right: .vw(8)[];
    }

    .gender-text {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(16)[];
      line-height: .vw(27)[];
      font-weight: 500;
      font-style: normal;
    }

    &.selected {
      background-color: #dcdcdc;
    }

    &.disabled {
      pointer-events: none;
    }
  }
}
</style>
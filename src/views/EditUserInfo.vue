<template>
  <main class="edit-user-info">
    <Header title="完善资料"></Header>
    <div class="body">

    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/FormData/Button.vue'
import { maskPhoneNumber } from '@/utils'

const router = useRouter()
const userInfo = ref({})

onMounted(() => {
  const data = localStorage.getItem('userInfo')
  userInfo.value = JSON.parse(data)
})

</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.edit-user-info {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 .vw(18)[];
  }
}
</style>
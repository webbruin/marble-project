<template>
  <main>
    <Header title="实名认证"></Header>
    <div class="formdata">
      <p class="title">身份信息</p>
      <div class="item">
        <Input v-model="formdata.realName" type="text" placeholder="请输入">
          <template #left>
            <span class="text">姓名</span>
          </template>
        </Input>
      </div>
      <div class="item">
        <Input v-model="formdata.idCardNo" type="text" placeholder="请输入">
          <template #left>
            <span class="text">身份证号</span>
          </template>
        </Input>
      </div>
      <div class="confirm">
        <Button buttonText="提交" :disabled="!(formdata.realName && formdata.idCardNo)" @click="clickConfirm"></Button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Input from '@/components/FormData/Input.vue'
import Button from '@/components/FormData/Button.vue'

const router = useRouter()

const formdata = ref({
  realName: '',
  idCardNo: '',
})

onMounted(() => {

})

const clickConfirm = async () => {
  $toast.loading()
  const res = await api.post('/user/info/realNameAuth', formdata.value)
  if (res.code === 200) {
    $toast.info('实名认证成功')
    const timer = setTimeout(() => {
      clearTimeout(timer)
      router.back()
    }, 1500)
  } else {
    $toast.info(res.message)
  }
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

main {
  height: 100%;
  background-color: #F5F6FA;

  .formdata {
    padding: 0 .vw(24)[];

    .title {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(24)[];
      line-height: .vw(24)[];
      font-weight: 500;
      font-style: normal;
      margin-top: .vw(54)[];
      margin-bottom: .vw(43)[];
    }

    .item {
      &:not(:last-of-type) {
        margin-bottom: .vw(32)[];
      }

      .text {
        width: .vw(80)[];
        display: inline-block;
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(27)[];
        font-weight: 500;
        font-style: normal;
      }
    }
  }
}
</style>
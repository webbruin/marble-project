<template>
  <main>
    <Header title="忘记密码"></Header>
    <div class="formdata">
      <p class="title">找回密码，请先验证身份</p>
      <div class="item">
        <Input v-model="formdata.mobile" type="tel" placeholder="请输入手机号"></Input>
      </div>
      <div class="item">
        <Input v-model="formdata.msgCode" :mobile="formdata.mobile" type="code" placeholder="请输入验证码"></Input>
      </div>
      <div class="confirm">
        <Button :disabled="!(formdata.mobile && formdata.msgCode)" @click="clickConfirm"></Button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Input from '@/components/FormData/Input.vue'
import Button from '@/components/FormData/Button.vue'

const route = useRoute()
const router = useRouter()

const formdata = ref({
  mobile: '',
  msgCode: '',
})

onMounted(() => {

})

const clickConfirm = async () => {
  const res = await api.post('/user/auth/smsLogin', formdata.value)
  if (res.code === 200) {
    const { access_token, hasPassword } = res.data
    localStorage.setItem('token', access_token)
    router.push({ name: 'set-password' })
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
  height: 100vh;
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
      .desc {
        color: var(--text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 400;
        font-style: normal;
        margin-top: .vw(16)[];
        margin-left: .vw(13)[];
      }

      &:not(:last-of-type) {
        margin-bottom: .vw(32)[];
      }
    }

    .confirm {
      margin-top: .vw(240)[];
    }
  }
}
</style>
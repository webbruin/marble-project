<template>
  <main>
    <Header title="设置密码"></Header>
    <div class="formdata">
      <p class="title">设置密码</p>
      <div class="item">
        <Input v-model="password1" type="password" placeholder="请输入密码"></Input>
      </div>
      <div class="item">
        <Input v-model="password2" type="password" placeholder="请再次输入密码"></Input>
        <p class="desc">密码必须8-20位，包含字母、数字、特殊字符</p>
      </div>
      <div class="confirm">
        <Button :disabled="!(password1 && password2)" @click="clickConfirm"></Button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Input from '@/components/FormData/Input.vue'
import Button from '@/components/FormData/Button.vue'
import { passwordRegExp } from '@/utils'
import { encrypt } from '@/utils/aes';

const route = useRoute()
const router = useRouter()

const password1 = ref('')
const password2 = ref('')

onMounted(() => {

})

const clickConfirm = async () => {
  if (password1.value !== password2.value) {
    $modal.show({ content: '两次密码输入不一致', showCancel: false })
    return;
  }
  if (!passwordRegExp.test(password1.value)) {
    $modal.show({ content: '密码必须8-20位，包含字母、数字、特殊字符', showCancel: false })
    return
  }
  let body = {
    password: encrypt(password1.value)
  }
  const res = await api.post('/user/info/setPassword', body)
  if (res.code === 200) {
    router.push({ name: 'home' })
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
      // margin-top: .vw(240)[];
    }
  }
}
</style>
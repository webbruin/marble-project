<template>
  <main>
    <Header title="修改密码"></Header>
    <div class="formdata">
      <p class="title">修改密码</p>
      <div class="item">
        <Input v-model="oldPassword" type="password" placeholder="请输入原密码"></Input>
      </div>
      <div class="item">
        <Input v-model="newPassword1" type="password" placeholder="请输入新密码"></Input>
      </div>
      <div class="item">
        <Input v-model="newPassword2" type="password" placeholder="请再次输入密码"></Input>
        <p class="desc">密码必须8-20位，包含字母、数字、特殊字符</p>
      </div>
      <div class="confirm">
        <Button :disabled="!(oldPassword && newPassword1 && newPassword2)" @click="clickConfirm"></Button>
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

const route = useRoute()
const router = useRouter()

const oldPassword = ref('')
const newPassword1 = ref('')
const newPassword2 = ref('')

onMounted(() => {

})

const clickConfirm = async () => {
  if (newPassword1.value !== newPassword2.value) {
    $modal.show({ content: '两次密码输入不一致', showCancel: false })
    return;
  }
  if (!passwordRegExp.test(newPassword1.value)) {
    $modal.show({ content: '密码必须8-20位，包含字母、数字、特殊字符', showCancel: false })
    return
  }
  let body = {
    oldPassword: oldPassword.value,
    newPassword: newPassword1.value
  }
  const res = await api.post('/user/info/changePassword', body)
  if (res.code === 200) {
    router.back()
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
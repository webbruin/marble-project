<template>
  <main class="setting">
    <Header title="设置"></Header>
    <div class="body">
      <div class="module" v-for="(item, index) in rows" :key="index">
        <template v-for="(childItem, childIndex) in item" :key="childIndex">
          <div class="item" v-if="childItem.show" @click="clickRouter(childItem.router)">
            <span class="text">{{ childItem.name }}</span>
            <i class="icon"></i>
          </div>
        </template>
      </div>
    </div>
    <div class="footer">
      <Button buttonText="退出登陆" @click="logout"></Button>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/FormData/Button.vue'

const router = useRouter()

const rows = ref([
  [
    { name: '购买说明', show: true, router: 'aggrement1' },
    { name: '充值协议', show: true, router: 'aggrement1' },
    { name: '隐私政策', show: true, router: 'aggrement1' },
  ],
  [
    { name: '蓝牙连接', show: true, router: 'bluetooth' },
    { name: '实名认证', show: true, router: 'real-name-auth' },
    { name: '设置登录密码', show: true, router: 'set-password' },
    { name: '修改登录密码', show: true, router: 'change-password' },
    { name: '账号注销', show: true, router: 'account-cancel' },
  ]
])

onMounted(() => {

})

const clickRouter = (url) => {
  if (!url) {
    return
  }
  router.push({ name: url })
}

const logout = async () => {
  $toast.loading('退出中')
  const res = await api.post('/user/auth/logout')
  if (res.code === 200) {
    $toast.info('退出登陆成功')
    localStorage.removeItem('token')
    router.replace({ name: 'login' })
  } else {
    $toast.info(res.message)
  }
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.setting {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #F8F8F8;
    padding: .vw(8)[] .vw(18)[];

    .module {
      border-radius: .vw(9)[];
      background-color: var(--white--);
      padding: .vw(9)[] 0;

      &:not(:last-of-type) {
        margin-bottom: .vw(8)[];
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .vw(16)[];

        .text {
          color: var(--light-text--);
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 400;
          font-style: normal;
        }

        .icon {
          width: .vw(14)[];
          height: .vw(14)[];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/arrow-right.png);
        }
      }
    }
  }

  .footer {
    padding: .vw(12)[] .vw(18)[];

    .button {
      background-color: #EDEDF0;
    }
  }
}
</style>
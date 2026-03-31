<template>
  <main class="login">
    <div class="header">
      <img src="@/assets/images/login/hello-icon.png" alt="" class="icon">
      <p class="title">欢迎来到弹珠潮玩</p>
    </div>
    <div class="body">
      <div class="module" :class="{ 'left': loginType === 'msgCode', 'right': loginType === 'password' }">
        <div class="tabs">
          <div class="item" :class="{ 'selected': loginType === item.type }" v-for="(item, index) in tabList"
            :key="index" @click="clickTab(item)">{{ item.name }}</div>
        </div>
        <div class="formdata">
          <div class="item">
            <Input v-model="formdata.mobile" type="tel" placeholder="请输入手机号"></Input>
          </div>
          <!-- 验证码登陆 -->
          <template v-if="loginType === 'msgCode'">
            <div class="item">
              <Input v-model="formdata.msgCode" :mobile="formdata.mobile" type="code" placeholder="请输入验证码"></Input>
            </div>
          </template>
          <!-- 密码登陆 -->
          <template v-if="loginType === 'password'">
            <div class="item">
              <Input v-model="formdata.password" type="password" placeholder="请输入密码"></Input>
            </div>
            <div class="forget-password" @click="clickForgetPassword">忘记密码</div>
          </template>
          <!-- 表单提交 -->
          <div class="submit">
            <Button :disabled="!(formdata.mobile && (loginType === 'msgCode' ? formdata.msgCode : formdata.password))"
              @click="clickLogin"></Button>
          </div>
        </div>
        <div class="aggrement" @click="isAggre = !isAggre">
          <i class="select" :class="{ 'selected': isAggre }"></i>
          <div class="text">为注册手机号将自动注册，勾选代表您已阅读并同意<span class="bold" @click.stop="clickAggrement1">《用户协议》</span>和<span
              class="bold" @click.stop="clickAggrement2">《隐私协议》</span></div>
        </div>
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

// msgCode / password
const loginType = ref('msgCode')
const tabList = ref([
  { type: 'msgCode', name: '验证码登录' },
  { type: 'password', name: '密码登录' },
])
const formdata = ref({
  mobile: '',
  msgCode: '',
  password: '',
})
const isAggre = ref(false)

onMounted(() => {

})

const clickTab = (item) => {
  loginType.value = item.type
}

const clickForgetPassword = () => {
  router.push('/forget-password');
}

const clickLogin = async () => {
  if (!isAggre.value) {
    $modal.show({
      content: '您是否已阅读并同意《用户协议》和《隐私协议》',
      onConfirm: () => {
        isAggre.value = true
        clickLogin()
      }
    })
    return
  }
  if (!passwordRegExp.test(formdata.value.password)) {
    $modal.show({ content: '密码必须8-20位，包含字母、数字、特殊字符', showCancel: false })
    return
  }
  const { mobile, msgCode, password } = formdata.value;
  let url = ''
  let body = {}
  if (loginType.value === 'msgCode') {
    url = '/user/auth/smsLogin'
    body = { mobile, msgCode }
  }
  if (loginType.value === 'password') {
    url = '/user/auth/passwordLogin'
    body = { mobile, password }
  }
  const res = await api.post(url, body)
  if (res.code === 200) {
    const { access_token, hasPassword } = res.data
    localStorage.setItem('token', access_token)
    if (hasPassword) {
      router.push({ name: 'set-password' })
    } else {
      router.push({ name: 'home' })
    }
  } else {
    $toast.info(res.message)
  }
}

const clickAggrement1 = () => {
  // router.push('');
}
const clickAggrement2 = () => {
  // router.push('');
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(@/assets/images/login/login-bg.png);
  overflow: auto;

  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: .vw(58)[];
    padding-bottom: .vw(50)[];
    padding-left: .vw(45)[];

    .icon {
      width: .vw(103)[];
      margin-bottom: .vw(15)[];
    }

    .title {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(16)[];
      line-height: .vw(16)[];
      font-weight: 500;
      font-style: normal;
    }
  }

  .body {
    flex: 1;
    border-radius: .vw(8)[];
    background: linear-gradient(180deg, #F6F6F6 0%, rgba(255, 255, 255, 0.25) 100%);
    margin: 0 .vw(6)[];

    .module {
      height: 100%;
      background-size: 100%;
      background-position: top;
      background-repeat: no-repeat;

      .tabs {
        height: .vw(55)[];
        display: flex;
        align-items: center;
        margin-bottom: .vw(54)[];

        .item {
          flex: 1;
          height: 100%;
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(16)[];
          line-height: .vw(16)[];
          font-weight: 400;
          font-style: normal;
          display: flex;
          align-items: center;
          justify-content: center;

          &.selected {
            color: #FFB169;
            font-weight: 500;
            position: relative;

            &::after {
              content: '';
              width: .vw(20)[];
              height: .vw(4)[];
              border-radius: .vw(45)[];
              background-color: #FFB169;
              position: absolute;
              bottom: .vw(7)[];
            }
          }
        }
      }

      .formdata {
        padding: 0 .vw(15)[];
        margin-bottom: .vw(67)[];

        .item {
          &:not(:last-of-type) {
            margin-bottom: .vw(32)[];
          }
        }

        .change-password {
          color: var(--text--);
          font-feature-settings: 'liga' off, 'clig' off;
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 400;
          font-style: normal;
          position: relative;
          top: .vw(-16)[];
        }

        .forget-password {
          color: #FFB169;
          text-align: right;
          font-feature-settings: 'liga' off, 'clig' off;
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 400;
          font-style: normal;
          position: relative;
          top: .vw(-16)[];
        }

        .submit {
          margin-top: .vw(140)[];
        }
      }

      .aggrement {
        display: flex;
        padding: 0 .vw(15)[];

        .select {
          min-width: .vw(18)[];
          height: .vw(18)[];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/shop/select.png);
          margin-right: .vw(6)[];
          margin-top: .vw(2)[];

          &.selected {
            background-image: url(@/assets/images/shop/selected.png);
          }
        }

        .text {
          color: #50525C;
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(24)[];
          font-weight: 200;

          .bold {
            color: #FFB169;
          }
        }
      }

      &.left {
        background-image: url(@/assets/images/login/left-bg.png);
      }

      &.right {
        background-image: url(@/assets/images/login/right-bg.png);
      }
    }
  }
}
</style>
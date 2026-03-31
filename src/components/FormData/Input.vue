<template>
  <div class="input-item">
    <template v-if="type === 'tel'">
      <span class="tel">+86</span>
    </template>
    <input class="input" :type="getType" :placeholder="placeholder" v-model="inputValue" />
    <template v-if="type === 'password'">
      <i class="browse" :class="{ 'off': browseOff }" @click="browseOff = !browseOff"></i>
    </template>
    <template v-if="type === 'code'">
      <span class="code" :class="{ 'disabled': !props.mobile || codeSending }" @click="clickSendCode">
        {{ codeSending ? `${codeCountdown}S后重新获取` : codeText }}
      </span>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: '请输入'
  },
  mobile: {
    type: String,
    default: ''
  },
})
const inputValue = defineModel({ default: '' })
const codeText = ref('获取验证码')
const codeSending = ref(false)
const codeCountdown = ref(60)
const browseOff = ref(true)

const getType = computed(() => {
  let type = props.type
  if (props.type === 'password') {
    type = browseOff.value ? 'password' : 'text'
  }
  return type
})

onMounted(() => {

})

const clickSendCode = async () => {
  let body = {
    mobile: props.mobile
  };
  const res = await api.post('/user/auth/sendSmsCode', body)
  if (res.code === 200) {
    setCountdown()
  } else {
    $toast.info(res.message)
  }
}

const setCountdown = () => {
  codeSending.value = true
  const timer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value) {
      return
    }
    clearInterval(timer)
    codeText.value = '重新获取'
    codeSending.value = false
    codeCountdown.value = 60
  }, 1000)
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.input-item {
  display: flex;
  align-items: center;
  border-radius: .vw(14)[];
  background-color: #EFEFEF;
  padding: .vw(10)[] .vw(16)[];

  .tel {
    color: var(--light-text--);
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: "PingFang SC";
    font-size: .vw(16)[];
    line-height: .vw(27)[];
    font-weight: 500;
    font-style: normal;
    padding: 0 .vw(8)[];
    margin-right: .vw(10)[];
  }

  .input {
    flex: 1;
    color: var(--light-text--);
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: "PingFang SC";
    font-size: .vw(16)[];
    line-height: .vw(27)[];
    font-weight: 500;
    font-style: normal;
    background-color: transparent;
    outline: none;
    border: none;

    &::placeholder {
      color: var(--text--);
      font-weight: 400;
    }
  }

  .code {
    color: #FFB169;
    text-align: center;
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: "PingFang SC";
    font-size: .vw(16)[];
    line-height: .vw(27)[];
    font-weight: 400;
    font-style: normal;
    margin-left: .vw(10)[];

    &.disabled {
      color: var(--text--);
      pointer-events: none;
    }
  }

  .browse {
    width: .vw(16)[];
    height: .vw(16)[];
    background-size: 100%;
    background-position: top;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/login/browse.png);
    margin-left: .vw(10)[];

    &.off {
      background-image: url(@/assets/images/login/browse-off.png);
    }
  }
}
</style>
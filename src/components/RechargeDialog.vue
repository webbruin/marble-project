<template>
  <div class="recharge-mask" v-if="show"></div>
  <div class="recharge-dialog" :class="{ 'show': show }">
    <div class="close" @click="clickClose"></div>
    <div class="body">
      <p class="title">弹珠充值</p>
      <div class="recharge">
        <div class="ball-count-list">
          <div class="item" :class="{ 'selected': selectedBallCount === item.price }"
            v-for="(item, index) in ballCountList" :key="index" @click="clickBallCount(item)">
            <div class="ball">
              <i class="icon"></i>
              <i class="count">X{{ item.ball }}</i>
            </div>
            <div class="price">{{ item.price }}</div>
          </div>
        </div>
        <div class="payway">
          <div class="sub-title">支付方式</div>
          <div class="payway-list">
            <div class="item" v-for="(item, index) in paywayList" :key="index" @click="clickPayway(item)">
              <img src="@/assets/images/alipay.png" alt="" class="icon">
              <span class="text">{{ item.name }}</span>
              <i class="select" :class="{ 'selected': selectedPayway === item.value }"></i>
            </div>
          </div>
        </div>
        <div class="confirm" @click="clickConfirm">确认充值</div>
        <div class="aggrement" @click="isAggre = !isAggre">
          <i class="select" :class="{ 'selected': isAggre }"></i>
          <div class="text">须满18周岁，请勾选<span class="bold" @click.stop="clickAggrement">《充值协议》</span></div>
        </div>
      </div>
    </div>
  </div>

  <div class="recharge-success" v-if="showRechargeSuccess">
    <div class="body">
      <p class="text">充值成功</p>
      <p class="desc">享受游戏的快乐吧~</p>
      <div class="confirm" @click="closeRechargeSuccess">玩游戏</div>
    </div>
    <div class="close" @click="closeRechargeSuccess"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  level: String,
  show: Boolean,
})
const emit = defineEmits(['toggleShow'])

const ballCountList = ref([
  { ball: 5, price: '5.00' },
  { ball: 20, price: '20.00' },
  { ball: 50, price: '50.00' },
  { ball: 100, price: '100.00' },
  { ball: 200, price: '200.00' },
  { ball: 500, price: '500.00' },
  { ball: 1000, price: '1000.00' },
  { ball: 2000, price: '2000.00' },
  { ball: 5000, price: '5000.00' },
])
const selectedBallCount = ref('')
const paywayList = ref([
  { value: 'alipay', name: '支付宝' }
])
const selectedPayway = ref('')
const isAggre = ref(false)
const showRechargeSuccess = ref(false)

onMounted(() => {

})

const clickConfirm = () => {
  if (!isAggre.value) {
    alert('请阅读并同意《充值协议》')
    return;
  }
  showRechargeSuccess.value = true
  emit('toggleShow', false)
}

const clickClose = () => {
  emit('toggleShow', false)
}

const clickBallCount = (item) => {
  console.log(111, item);
  if (selectedBallCount.value === item.price) {
    selectedBallCount.value = ''
  } else {
    selectedBallCount.value = item.price
  }
}

const clickPayway = (item) => {
  console.log(222, item);
  selectedPayway.value = item.value
}

const clickAggrement = () => {
  // router.push('');
}

const closeRechargeSuccess = () => {
  showRechargeSuccess.value = false
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.recharge-mask {
  width: 100vw;
  height: 100vh;
  background-color: rgba(#272933, 0.75);
  position: fixed;
  z-index: 10001;
  left: 0;
  bottom: 0;
}

.recharge-dialog {
  width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  z-index: 10002;
  left: 0;
  bottom: 0;
  transform: translateY(115%);
  transition: transform .3s;

  &.show {
    transform: translateY(0);
  }

  .close {
    width: .vw(24)[];
    height: .vw(24)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/close.png);
    margin-bottom: .vw(20)[];
  }

  .body {
    width: 100%;
    height: .vw(605)[];
    display: flex;
    flex-direction: column;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/recharge-bg.png);
    position: relative;
    padding: .vw(23)[] .vw(16)[] .vw(17)[] .vw(16)[];

    &::before {
      content: '';
      width: .vw(134)[];
      height: .vw(134)[];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/recharge-icon.png);
      position: absolute;
      top: .vw(-57)[];
      right: .vw(4)[];
    }

    .title {
      font-size: .vw(30)[];
      line-height: .vw(30)[];
      font-weight: 900;
      font-style: normal;
      letter-spacing: .vw(5)[];
      margin-bottom: .vw(20)[];
    }

    .recharge {
      flex: 1;
      border-radius: .vw(12)[];
      background-color: var(--white--);
      overflow-y: auto;
      overflow-x: hidden;
      padding: .vw(18)[];

      .ball-count-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: .vw(16)[];

        .item {
          width: .vw(96)[];
          height: .vw(88)[];
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          border-radius: .vw(24)[];
          background-color: #F5F6FA;
          margin-bottom: .vw(9)[];

          &:not(:nth-child(3n+0)) {
            margin-right: .vw(9)[];
          }

          .ball {
            display: flex;
            align-items: center;
            margin-bottom: .vw(11)[];

            .icon {
              width: .vw(30)[];
              height: .vw(30)[];
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url(@/assets/images/ball.png);
              margin-right: .vw(4)[];
            }

            .count {
              color: var(--light-text--);
              font-family: "PingFang SC";
              font-size: .vw(22)[];
              line-height: .vw(22)[];
              font-weight: 900;
              font-style: normal;
            }
          }

          .price {
            color: var(--light-text--);
            font-family: "PingFang SC";
            font-size: .vw(16)[];
            line-height: .vw(16)[];
            font-weight: 500;
            font-style: normal;
            display: flex;
            align-items: flex-end;

            &::before {
              content: '￥';
              font-family: "PingFang SC";
              font-size: .vw(12)[];
              line-height: .vw(12)[];
              font-weight: 400;
              font-style: normal;
            }
          }

          &.selected {
            border: .vw(2)[] solid #FF7716;
            background-color: #FFF4E6;
          }
        }
      }

      .payway {
        margin-bottom: .vw(16)[];

        .sub-title {
          color: var(--light-text--);
          font-family: "PingFang SC";
          font-size: .vw(16)[];
          line-height: .vw(16)[];
          font-weight: 200;
          font-style: normal;
          margin-bottom: .vw(8)[];
        }

        .payway-list {
          .item {
            display: flex;
            align-items: center;
            border-radius: .vw(12)[];
            background-color: #EFEFEF;
            padding: .vw(12)[] .vw(19)[];

            .icon {
              width: .vw(24)[];
              height: .vw(24)[];
              margin-right: .vw(8)[];
            }

            .text {
              flex: 1;
              color: var(--light-text--);
              font-family: "PingFang SC";
              font-size: .vw(14)[];
              line-height: .vw(14)[];
              font-weight: 500;
              font-style: normal;
            }

            .select {
              width: .vw(24)[];
              height: .vw(24)[];
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url(@/assets/images/shop/select.png);
              margin-left: .vw(10)[];

              &.selected {
                background-image: url(@/assets/images/shop/selected.png);
              }
            }
          }
        }
      }

      .confirm {
        height: .vw(48)[];
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 500;
        font-style: normal;
        border-radius: .vw(45)[];
        background-color: #FFB169;
        margin-bottom: .vw(16)[];
      }

      .aggrement {
        display: flex;
        align-items: center;

        .select {
          width: .vw(18)[];
          height: .vw(18)[];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/shop/select.png);
          margin-right: .vw(6)[];

          &.selected {
            background-image: url(@/assets/images/shop/selected.png);
          }
        }

        .text {
          color: #50525C;
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 200;

          .bold {
            color: #FFB169;
          }
        }
      }
    }
  }
}

.recharge-success {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(#272933, 0.75);
  position: fixed;
  z-index: 10001;
  left: 0;
  top: 0;

  .body {
    width: .vw(328)[];
    height: .vw(242)[];
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/recharge-success-bg.png);
    position: relative;
    padding-top: .vw(50)[];

    &::before {
      content: '';
      width: .vw(110)[];
      height: .vw(110)[];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/recharge-success-icon.png);
      position: absolute;
      top: .vw(-25)[];
      right: .vw(8)[];
    }

    .text {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(24)[];
      line-height: .vw(24)[];
      font-weight: 900;
      font-style: normal;
      margin-bottom: .vw(10)[];
    }

    .desc {
      color: #50525C;
      font-family: "PingFang SC";
      font-size: .vw(16)[];
      line-height: .vw(16)[];
      font-weight: 400;
      font-style: normal;
      margin-bottom: .vw(36)[];
    }

    .confirm {
      width: .vw(240)[];
      height: .vw(48)[];
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--white--);
      font-size: .vw(16)[];
      line-height: .vw(16)[];
      font-weight: 500;
      font-style: normal;
      border-radius: .vw(45)[];
      border: 1px solid #FF3A64;
      background: linear-gradient(90deg, #FD689A 0%, #FFAB2D 100%);
    }
  }

  .close {
    width: .vw(24)[];
    height: .vw(24)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/close.png);
    margin-top: .vw(62)[];
  }
}
</style>
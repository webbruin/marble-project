<template>
  <div class="check-in">
    <Header title="每日签到"></Header>
    <div class="body">
      <div class="module1">
        <div class="left">
          <p class="text">弹珠数量</p>
          <p class="count">15.0</p>
          <div class="button" @click="clickCheckIn">立即签到</div>
        </div>
        <div class="right">
          <img src="@/assets/images/check-in-icon.png" alt="" class="icon">
        </div>
      </div>
      <div class="module2">
        <div class="list">
          <div :class="{ 'big': item.bigSize, 'item': !item.bigSize }" v-for="(item, index) in rankList" :key="index">
            <span class="text">{{ item.name }}</span>
            <div class="icon" :class="{ 'check': index < 2 }">
              <img src="@/assets/images/ball.png" alt="">
            </div>
            <span class="ball">X{{ item.ball }}</span>
          </div>
        </div>
      </div>
      <div class="module3">
        <div class="list">
          <div class="sub-title">新手任务</div>
          <div class="item" v-for="(item, index) in taskList" :key="index">
            <div class="info">
              <p class="text">{{ item.name }}</p>
              <div class="ball">
                <img src="@/assets/images/ball.png" alt="" class="icon">
                <span class="count">X{{ item.ball }}</span>
              </div>
            </div>
            <div class="button" :class="{ 'done': item.done }">{{ item.done ? '已完成' : '去完成' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <BallSuccess :show="showBallSuccess" :ball="10" @toggleShow="showBallSuccess = $event"></BallSuccess>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BallSuccess from '@/components/BallSuccess.vue'

const rankList = ref([
  { name: '第一天', ball: 3 },
  { name: '第二天', ball: 3 },
  { name: '第三天', ball: 3 },
  { name: '第四天', ball: 3 },
  { name: '第五天', ball: 3 },
  { name: '第六天', ball: 3 },
  { name: '第七天', ball: 15, bigSize: true },
])
const taskList = ref([
  { name: '玩一局游戏', ball: 10, done: false },
  { name: '玩三局游戏', ball: 20, done: false },
  { name: '玩五局游戏', ball: 30, done: false },
  { name: '兑换一次商品', ball: 10, done: true },
  { name: '玩10局游戏', ball: 50, done: false },
])
const showBallSuccess = ref(false)

onMounted(() => {

})

const clickCheckIn = () => {
  showBallSuccess.value = true
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.check-in {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F6F6F6;
  position: relative;

  &::before {
    content: '';
    width: 100%;
    height: .vw(334)[];
    background-color: #FFF3E6;
    filter: blur(.vw(50)[]);
    position: absolute;
    left: 0;
    top: 0;
  }

  .body {
    flex: 1;
    overflow: auto;
    position: relative;

    .module1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: .vw(28)[];
      padding-right: .vw(12)[];

      .left {
        display: flex;
        flex-direction: column;
        position: relative;
        top: .vw(-10)[];

        .text {
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(16)[];
          line-height: .vw(16)[];
          font-weight: 200;
          font-style: normal;
          margin-bottom: .vw(8)[];
        }

        .count {
          color: var(--light-text--);
          font-family: "PingFang SC";
          font-size: .vw(36)[];
          line-height: .vw(36)[];
          font-weight: 500;
          font-style: normal;
          margin-bottom: .vw(16)[];
        }

        .button {
          height: .vw(40)[];
          color: var(--white--);
          font-family: "PingFang SC";
          font-size: .vw(16)[];
          line-height: .vw(24)[];
          font-weight: 500;
          font-style: normal;
          border-radius: .vw(45)[];
          border: .vw(1)[] solid #FF3A64;
          background: linear-gradient(90deg, #FD689A 0%, #FFAB2D 100%);
          padding: .vw(8)[] .vw(18)[];
        }
      }

      .right {
        .icon {
          width: .vw(134)[];
        }
      }
    }

    .module2 {
      position: relative;
      padding: 0 .vw(16)[];
      margin-bottom: .vw(8)[];
      margin-top: .vw(-20)[];

      .list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        border-radius: .vw(12)[];
        background-color: var(--white--);
        padding: .vw(12)[] .vw(15)[] 0;

        .item {
          width: .vw(69)[];
          height: .vw(72)[];
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          border-radius: .vw(16)[];
          border: .vw(1)[] solid #A83602;
          background-color: #FFD2AA;
          margin-bottom: .vw(12)[];
          position: relative;
          overflow: hidden;

          &:not(:nth-child(4n+0)) {
            margin-right: .vw(12)[];
          }

          &::before {
            content: '';
            width: .vw(90)[];
            height: .vw(34)[];
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(@/assets/images/ellipse-icon.png);
            position: absolute;
            top: .vw(-11)[];
          }

          .text {
            color: #70380E;
            font-family: "PingFang SC";
            font-size: .vw(12)[];
            line-height: .vw(12)[];
            font-style: normal;
            font-weight: 500;
            z-index: 1;
            margin-bottom: .vw(5)[];
          }

          .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            img {
              width: .vw(30)[];
              height: .vw(30)[];
            }

            &.check::before {
              content: '';
              width: .vw(24)[];
              height: .vw(24)[];
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url(@/assets/images/check-icon.png);
              position: absolute;
            }
          }

          .ball {
            color: #D95809;
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
          }
        }

        .big {
          width: .vw(150)[];
          height: .vw(72)[];
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: .vw(16)[];
          border: .vw(1)[] solid #A83602;
          background-color: #FFD2AA;
          position: relative;
          margin-bottom: .vw(12)[];
          padding-top: .vw(20)[];

          &::before {
            content: '';
            width: .vw(60)[];
            height: .vw(24)[];
            border-radius: .vw(16)[] 0;
            background: #FFBE45;
            position: absolute;
            left: 0;
            top: 0;
          }

          .text {
            color: #70380E;
            font-family: "PingFang SC";
            font-size: .vw(12)[];
            line-height: .vw(12)[];
            font-style: normal;
            font-weight: 500;
            position: absolute;
            left: .vw(12)[];
            top: .vw(6)[];
            z-index: 1;
          }

          .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            margin-right: .vw(12)[];

            img {
              width: .vw(36)[];
              height: .vw(36)[];
            }

            &.check::before {
              content: '';
              width: .vw(30)[];
              height: .vw(30)[];
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url(@/assets/images/check-icon.png);
              position: absolute;
            }
          }

          .ball {
            color: #D95809;
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
          }
        }
      }
    }

    .module3 {
      padding: 0 .vw(16)[];

      .list {
        border-radius: .vw(12)[];
        background-color: var(--white--);
        padding: .vw(10)[] .vw(12)[];

        .sub-title {
          color: var(--light-text--);
          font-family: "PingFang SC";
          font-size: .vw(16)[];
          line-height: .vw(16)[];
          font-weight: 500;
          font-style: normal;
          margin-bottom: .vw(16)[];
        }

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: .vw(8)[];
          background-color: #FFF4E6;
          padding: .vw(8)[] .vw(16)[];

          &:not(:last-of-type) {
            margin-bottom: .vw(8)[];
          }

          .info {
            .text {
              color: var(--light-text--);
              font-family: "PingFang SC";
              font-size: .vw(14)[];
              line-height: .vw(14)[];
              font-weight: 500;
              font-style: normal;
              margin-bottom: .vw(12)[];
            }

            .ball {
              display: flex;
              align-items: center;

              .icon {
                width: .vw(24)[];
                height: .vw(24)[];
                margin-right: .vw(8)[];
              }

              .count {
                color: #70380E;
                font-family: "PingFang SC";
                font-size: .vw(14)[];
                line-height: .vw(14)[];
                font-weight: 500;
                font-style: normal;
              }
            }
          }

          .button {
            color: var(--white--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
            border-radius: .vw(8)[];
            background-color: #FF7716;
            padding: .vw(8)[] .vw(12)[];

            &.done {
              pointer-events: none;
              background-color: #FFCA91;
            }
          }
        }
      }
    }
  }
}
</style>
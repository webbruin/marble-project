<template>
  <main class="room">
    <div ref="live-stream" class="live-stream"></div>
    <div class="body">
      <Header></Header>
      <div class="tabbar">
        <div class="status">
          <img class="icon" src="@/assets/images/avatar.png" alt="">
          <span class="text">正在游戏中</span>
        </div>
        <div class="status" v-if="false">
          <span class="text">倒计时：45S</span>
        </div>
        <div class="audience-list" v-if="audiences.length">
          <div class="user" v-for="(item, index) in audiences.slice(0, 3)" :key="index">
            <img class="icon" src="@/assets/images/avatar.png" alt="">
          </div>
          <div class="user">
            <span class="count">{{ audiences.length }}</span>
          </div>
        </div>
      </div>
      <div class="left-button-list">
        <div class="button">
          <i class="icon">
            <img src="@/assets/images/room/icon7.png" alt="">
          </i>
          <span class="text">故障报告</span>
        </div>
        <div class="button" @click="showBluetoothConnect = true">
          <i class="icon">
            <img src="@/assets/images/room/icon8.png" alt="">
          </i>
          <span class="text">连接手柄</span>
        </div>
      </div>
      <div class="right-button-list" :class="{ 'collapse': collapse }">
        <template v-if="!collapse">
          <div class="button">
            <i class="icon">
              <img src="@/assets/images/room/icon1.png" alt="">
            </i>
            <span class="text">游戏规则</span>
          </div>
          <div class="button" @click="clickRouter('point-card-record')">
            <i class="icon">
              <img src="@/assets/images/room/icon2.png" alt="">
            </i>
            <span class="text">中奖记录</span>
          </div>
          <div class="button">
            <i class="icon">
              <img src="@/assets/images/room/icon3.png" alt="">
            </i>
            <span class="text">音乐：开</span>
          </div>
          <div class="button">
            <i class="icon">
              <img src="@/assets/images/room/icon4.png" alt="">
            </i>
            <span class="text">联系客服</span>
          </div>
          <div class="button">
            <i class="icon">
              <img src="@/assets/images/room/icon5.png" alt="">
            </i>
            <span class="text">刷新</span>
          </div>
        </template>
        <div class="button" @click="collapse = !collapse">
          <i class="icon">
            <img src="@/assets/images/room/icon6.png" alt="">
          </i>
          <span class="text">{{ collapse ? '展开' : '收起' }}</span>
        </div>
      </div>
      <div class="footer">
        <div class="ball-info">
          <div class="item">
            <i class="ball"></i>
            <span class="count">X715</span>
          </div>
          <div class="item">
            <i class="point"></i>
            <span class="count">X1,715</span>
          </div>
          <div class="magnification">4倍</div>
        </div>
        <div class="gaming" :class="{ 'left-hand': handIsLeft }" v-if="isGaming">
          <div class="left">
            <p class="desc">已投入5枚弹珠，预计可获得5枚</p>
            <div class="buttons">
              <div class="item">
                <span @click="changeBall(5)">+5</span>
              </div>
              <div class="item" @click="changeBall(50)">
                <span>+50</span>
              </div>
              <div class="item" @click="changeBall(9999)">
                <span>+满</span>
              </div>
              <div class="item" @click="changeBall(-stepBall)">
                <img class="sub" src="@/assets/images/room/sub-ball.png" alt="">
              </div>
              <div class="item">
                <input type="number" v-model="ball" @input="ballChange" />
              </div>
              <div class="item" @click="changeBall(stepBall)">
                <img class="add" src="@/assets/images/room/add-ball.png" alt="">
              </div>
            </div>
          </div>
          <div class="right">
            <div class="change-hand" @click="handIsLeft = !handIsLeft">切换{{ handIsLeft ? '右手' : '左手' }}</div>
            <div class="joy-stick">
              <i class="stick" :class="{ 'left': handIsLeft, 'right': !handIsLeft }" ref="stickRef"
                :style="{ 'transform': `translateY(${stickMovePercent}%)` }"></i>
              <span class="percent">{{ stickMovePercent }}%</span>
            </div>
          </div>
        </div>
        <div class="start" v-else>
          <img src="@/assets/images/room/start-game.png" alt="" class="button" @click="clickStart">
        </div>
      </div>
    </div>
  </main>

  <div class="bluetooth-connect-dialog" v-if="showBluetoothConnect">
    <div class="mask" @click="showBluetoothConnect = false"></div>
    <div class="content">
      <p class="text">设备连接</p>
      <p class="desc">请确保蓝牙正常开启，连接手柄需要蓝牙处在开启状态</p>
      <div class="confirm" @click="clickBluetoothConnect">立即连接</div>
    </div>
  </div>

  <WarnningDialog :show="showWarnningDialog" :level="'初级'" :ball="10" @toggleShow="showWarnningDialog = $event">
  </WarnningDialog>
  <ConfirmDialog :show="showConfirmDialog" :level="'初级'" @toggleShow="showConfirmDialog = $event"></ConfirmDialog>
  <BallSuccess :show="showBallSuccess" :ball="10" @toggleShow="showBallSuccess = $event"></BallSuccess>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch, useTemplateRef, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TRTC from 'trtc-sdk-v5';
import WarnningDialog from '@/components/WarnningDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import BallSuccess from '@/components/BallSuccess.vue'
// TRTC资源包
import '../trtc/lib-generate-test-usersig.min'
import genTestUserSig from '../trtc/generateTestUserSig'

const route = useRoute()
const router = useRouter()

const audiences = ref([1, 2, 3, 4, 5, 6, 7, 8])
const collapse = ref(false)
const isGaming = ref(false)
const ball = ref(20)
const stepBall = ref(5)
const minBall = ref(0)
const maxBall = ref(100)
const handIsLeft = ref(false)
const isMoveStick = ref(false)
const stickMovePercent = ref(0)
const stickRef = useTemplateRef('stickRef')
const stickEvent = ref({});
const showWarnningDialog = ref(false)
const showConfirmDialog = ref(false)
const showBallSuccess = ref(false)
const showBluetoothConnect = ref(false)
const liveStream = useTemplateRef('live-stream')
const trtc = TRTC.create()  // 创建 TRTC 实例

onMounted(() => {
  // console.log(111, route.params);
  // console.log(222, route.query);

  // const sdkAppId = 1600135086
  // const userId = '10000'
  // const sdkSecretKey = 'b547fb92700e3db845340995784b11fa0327534e0993af6577b046a82d739a12'
  // const roomId = 10000001
  // createRoom(sdkAppId, userId, sdkSecretKey, roomId)
})

// 创建房间
const createRoom = async (sdkAppId, userId, sdkSecretKey, roomId) => {
  try {
    const { userSig } = genTestUserSig({ sdkAppId, userId, sdkSecretKey })
    const options = {
      enableAutoPlayDialog: false  // 关闭音频
    }
    await trtc.enterRoom({ sdkAppId, userId, userSig, roomId, ...options })
  } catch (error) {
    // console.error('failed to enter room ' + error);
    $toast.info('加入直播间失败')
  }
  // 在进入房间之前，监听 TRTC.EVENT.REMOTE_VIDEO_AVAILABLE 事件，以接收所有远端用户视频发布事件。
  trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
    trtc.startRemoteVideo({ userId, streamType, view: liveStream.value })
  })
}

const changeBall = (value) => {
  ball.value += value
  ball.value = Math.max(minBall.value, ball.value)
  ball.value = Math.min(maxBall.value, ball.value)
}

const ballChange = (event) => {
  ball.value = +event.target.value;
  ball.value = Math.max(minBall.value, ball.value)
  ball.value = Math.min(maxBall.value, ball.value)
}

const clickStart = () => {
  isGaming.value = true
  nextTick(() => {
    initStickEvent()
  })
}

const initStickEvent = () => {
  if (!stickRef.value) {
    return
  }

  stickRef.value.addEventListener('touchstart', event => {
    event.preventDefault()
    isMoveStick.value = true
    stickMovePercent.value = 0
    stickEvent.value = event.targetTouches[0]

    window.addEventListener('touchmove', event => {
      if (!isMoveStick.value) {
        return
      }
      const { top, bottom } = stickRef.value.getBoundingClientRect()
      const max = bottom - top;
      let screenY = event.targetTouches[0].screenY - stickEvent.value.screenY
      screenY = Math.min(screenY, max)
      screenY = Math.max(screenY, 0)
      stickMovePercent.value = parseInt(screenY / max * 100)
    })
    window.addEventListener('touchend', event => {
      isMoveStick.value = false
      stickMovePercent.value = 0
      // 删除时间监听
      stickRef.value.removeEventListener('touchstart', () => { })
      window.removeEventListener('touchmove', () => { })
      window.removeEventListener('touchend', () => { })
    })
  })
}

const clickRouter = (url) => {
  if (!url) {
    return
  }
  router.push({ name: url })
}

const clickBluetoothConnect = async () => {
  showBluetoothConnect.value = false
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.room {
  height: 100%;
  overflow: hidden;

  .live-stream {
    width: 100%;
    height: 100%;
    position: fixed;

    video {
      width: 100%;
      height: 100%;
      background-color: var(--white--);
    }
  }

  .body {
    height: 100%;
    position: relative;
    z-index: 1;

    .tabbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      top: .vw(54)[];
      left: .vw(16)[];
      right: .vw(16)[];

      .status {
        min-width: .vw(94)[];
        height: .vw(30)[];
        display: flex;
        align-items: center;
        border-radius: .vw(45)[];
        background-color: rgba(#272933, 0.75);
        padding: .vw(3)[] .vw(4)[];

        .icon {
          width: .vw(24)[];
          height: .vw(24)[];
          margin-right: .vw(6)[];
        }

        .text {
          flex: 1;
          color: var(--white--);
          font-family: "PingFang SC";
          font-size: .vw(12)[];
          line-height: .vw(12)[];
          font-weight: 400;
          font-style: normal;
          text-align: center;
        }
      }

      .audience-list {
        display: flex;
        align-items: center;

        .user {
          width: .vw(24)[];
          height: .vw(24)[];
          border-radius: 50%;
          border: .vw(1)[] solid rgba(#ffffff, 0.75);
          overflow: hidden;

          &:not(:last-of-type) {
            margin-right: .vw(-8)[];
          }

          .icon {
            width: 100%;
            height: 100%;
          }

          .count {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white--);
            font-family: "PingFang SC";
            font-size: .vw(12)[];
            line-height: .vw(12)[];
            font-weight: 400;
            font-style: normal;
            background-color: rgba(#000000, 0.75);
          }
        }
      }
    }

    .left-button-list {
      width: .vw(64)[];
      display: flex;
      align-items: center;
      flex-direction: column;
      position: absolute;
      top: .vw(190)[];
      left: .vw(16)[];

      .button {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;

        &:not(:last-of-type) {
          margin-bottom: .vw(18)[];
        }

        .icon {
          width: .vw(48)[];
          height: .vw(48)[];
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          background-color: rgba(0, 0, 0, 0.65);
          margin-bottom: .vw(4)[];

          img {
            width: .vw(36)[];
            height: .vw(36)[];
          }
        }

        .text {
          color: var(--white--);
          -webkit-text-stroke-width: .vw(1)[];
          -webkit-text-stroke-color: #835B5B;
          font-family: "HarmonyOS Sans SC";
          font-size: .vw(16)[];
          line-height: .vw(16)[];
          font-weight: 900;
          font-style: normal;
        }
      }
    }

    .right-button-list {
      width: .vw(64)[];
      display: flex;
      align-items: center;
      flex-direction: column;
      position: absolute;
      top: .vw(104)[];
      right: .vw(16)[];

      &.collapse {
        top: .vw(190)[];
      }

      .button {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;

        &:not(:last-of-type) {
          margin-bottom: .vw(18)[];
        }

        .icon {
          width: .vw(48)[];
          height: .vw(48)[];
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          background-color: rgba(0, 0, 0, 0.65);
          margin-bottom: .vw(4)[];

          img {
            width: .vw(36)[];
            height: .vw(36)[];
          }
        }

        .text {
          color: var(--white--);
          -webkit-text-stroke-width: .vw(1)[];
          -webkit-text-stroke-color: #835B5B;
          font-family: "HarmonyOS Sans SC";
          font-size: .vw(16)[];
          line-height: .vw(16)[];
          font-weight: 900;
          font-style: normal;
        }
      }
    }

    .footer {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;

      .ball-info {
        display: flex;
        align-items: center;
        padding: 0 .vw(16)[];
        margin-bottom: .vw(10)[];

        .item {
          min-width: .vw(100)[];
          display: flex;
          align-items: center;
          border-radius: .vw(45)[];
          background-color: rgba(0, 0, 0, 0.45);
          padding: .vw(4)[] .vw(8)[];

          &:not(:last-of-type) {
            margin-right: .vw(9)[];
          }

          .ball,
          .point {
            width: .vw(24)[];
            height: .vw(24)[];
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            margin-right: .vw(8)[];
          }

          .ball {
            background-image: url(@/assets/images/ball.png);
          }

          .point {
            background-image: url(@/assets/images/point.png);
          }

          .count {
            color: var(--white--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
          }
        }

        .magnification {
          height: .vw(32)[];
          color: var(--white--);
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(32)[];
          font-weight: 500;
          font-style: normal;
          align-items: center;
          border-radius: .vw(45)[];
          border: .vw(1)[] solid #FF7716;
          background: var(--006, linear-gradient(153deg, #EB8C67 5.44%, #F5C8B0 80.37%));
          padding: 0 .vw(12)[];
        }
      }

      .gaming {
        display: flex;
        border-radius: .vw(12)[] .vw(12)[] 0 0;
        border: .vw(8)[] solid var(--warning-warning-6-normal-ff-7716, #FF7716);
        background: #FFD1AE;
        box-shadow: 0 0 0 .vw(8)[] #F7B058 inset;
        padding-top: .vw(18)[];
        padding-bottom: .vw(8)[];

        .left {
          padding-left: .vw(20)[];

          .desc {
            color: var(--text--);
            font-family: "PingFang SC";
            font-size: .vw(12)[];
            line-height: .vw(12)[];
            font-weight: 200;
            font-style: normal;
            margin-bottom: .vw(12)[];
          }

          .buttons {
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            .item {
              width: .vw(70)[];
              height: .vw(32)[];
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: .vw(8)[];
              border: .vw(2)[] solid #FF7716;
              background: linear-gradient(153deg, #FFA785 5.44%, #FFD2BA 80.37%);
              overflow: hidden;
              margin-bottom: .vw(10)[];

              &:not(:nth-child(3n+0)) {
                margin-right: .vw(8)[];
              }

              span {
                color: #902904;
                font-size: .vw(16)[];
                line-height: .vw(16)[];
                font-weight: 900;
                font-style: normal;
              }

              .sub,
              .add {
                width: .vw(16)[];
              }

              input {
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                color: var(--light-text--);
                font-size: .vw(16)[];
                line-height: .vw(16)[];
                font-weight: 900;
                font-style: normal;
                text-align: center;
                background-color: #fff;
              }
            }
          }
        }

        .right {
          width: .vw(100)[];
          min-width: .vw(100)[];
          display: flex;
          align-items: center;
          flex-direction: column;
          padding-right: .vw(25)[];

          .change-hand {
            height: .vw(24)[];
            padding: 0 .vw(12)[];
            color: var(--white--);
            font-family: "PingFang SC";
            font-size: .vw(12)[];
            font-weight: 500;
            font-style: normal;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: .vw(8)[];
            border: .vw(1)[] solid #FF7716;
            background: linear-gradient(153deg, #EB8C67 5.44%, #F5C8B0 80.37%);
            margin-bottom: .vw(4)[];
          }

          .joy-stick {
            width: .vw(48)[];
            height: .vw(78)[];
            border-radius: .vw(8)[];
            border: .vw(2)[] solid #D95809;
            background-color: #361608;
            box-shadow: 0 .vw(-4)[] .vw(4)[] 0 #4A1100 inset;
            position: relative;

            &::before {
              content: '';
              width: .vw(30)[];
              height: .vw(46)[];
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url(@/assets/images/room/arrow-top.png);
              position: absolute;
              top: .vw(5)[];
              left: 50%;
              transform: translateX(-50%) rotate(180deg);
            }

            .percent {
              width: 100%;
              color: #C24B16;
              font-family: "PingFang SC";
              font-size: .vw(14)[];
              line-height: .vw(14)[];
              font-weight: 500;
              font-style: normal;
              text-align: center;
              position: absolute;
              bottom: .vw(8)[];
            }

            .stick {
              min-width: .vw(62)[];
              min-height: .vw(30)[];
              display: flex;
              position: absolute;
              top: .vw(0)[];
              transform: translateY(0px);

              &.left {
                left: .vw(11)[];

                &::before {
                  content: '';
                  min-width: .vw(62)[];
                  min-height: .vw(30)[];
                  background-size: 100%;
                  background-position: center;
                  background-repeat: no-repeat;
                  background-image: url(@/assets/images/room/joy-stick.png);
                  transform: rotate(180deg);
                  transform-origin: left;
                }
              }

              &.right {
                left: .vw(11)[];

                &::before {
                  content: '';
                  min-width: .vw(62)[];
                  min-height: .vw(30)[];
                  background-size: 100%;
                  background-position: center;
                  background-repeat: no-repeat;
                  background-image: url(@/assets/images/room/joy-stick.png);
                  transform-origin: left;
                }
              }
            }
          }
        }

        &.left-hand {
          flex-direction: row-reverse;

          .left {
            padding-left: .vw(15)[];
          }

          .right {
            padding-right: 0;
            padding-left: .vw(25)[];
          }
        }
      }

      .start {
        display: flex;
        justify-content: center;
        border-radius: .vw(12)[] .vw(12)[] 0 0;
        border: .vw(8)[] solid var(--warning-warning-6-normal-ff-7716, #FF7716);
        background: #FFD1AE;
        box-shadow: 0 0 0 .vw(8)[] #F7B058 inset;
        padding: .vw(12)[] 0;

        .button {
          width: .vw(120)[];
        }
      }
    }
  }
}

.bluetooth-connect-dialog {
  width: 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(#000311, 0.45);
  position: fixed;
  z-index: 10001;
  left: 0;
  top: 0;

  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .content {
    width: .vw(358)[];
    height: .vw(232)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/room/bluetooth-connect-bg.png);
    position: relative;
    z-index: 10002;
    padding: .vw(24)[];

    &::before {
      content: '';
      width: .vw(88)[];
      height: .vw(88)[];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/room/bluetooth-connect-icon.png);
      position: absolute;
      top: .vw(-11)[];
      right: .vw(12)[];
    }

    .text {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(30)[];
      line-height: .vw(30)[];
      letter-spacing: .vw(5)[];
      font-weight: 900;
      font-style: normal;
      margin-bottom: .vw(37)[];
    }

    .desc {
      color: #332A03;
      font-family: "PingFang SC";
      font-size: .vw(14)[];
      line-height: .vw(22)[];
      font-weight: 500;
      font-style: normal;
      margin-bottom: .vw(11)[];
    }

    .confirm {
      width: 100%;
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
}
</style>
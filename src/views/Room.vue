<template>
  <main class="room">
    <div ref="live-stream" class="live-stream"></div>
    <div class="body">
      <Header :disabledBack="true" @click="back">
        <template #right>
          <div class="room-id">房间：{{ `${tencentRoomId}`.slice(-4) }}</div>
        </template>
      </Header>
      <div class="tabbar">
        <div class="room-status">
          <div class="icon">
            <template v-if="roomInfo.currentPlayer?.avatar">
              <img :src="roomInfo.currentPlayer.avatar" alt="" />
            </template>
            <template v-else>
              <img src="@/assets/images/avatar.png" alt="" />
            </template>
          </div>
          <span class="text">{{ roomUseStatusEnum[roomInfo.useStatus] }}</span>
        </div>
        <div class="status" v-if="sendStatus">{{ sendStatus }}</div>
        <div class="status" v-else-if="countdown">倒计时：{{ countdown }}S</div>
        <div class="audience-list" v-if="memberList.length">
          <div class="user" v-for="(item, index) in Math.min(memberList, 3)" :key="index" @click="clickMember(item)">
            <template v-if="item.avatar">
              <img class="icon" :src="item.avatar" alt="" />
            </template>
            <template v-else>
              <img class="icon" src="@/assets/images/avatar.png" alt="" />
            </template>
          </div>
          <div class="user">
            <span class="count">{{ memberList.length }}</span>
          </div>
        </div>
      </div>
      <!-- 顶部背景板 -->
      <div class="bg-panel" :class="{ 'no-self-room': watchGame }">
        <i class="bg"></i>
        <i class="icon1"></i>
        <i class="icon2"></i>
        <div class="info" v-if="!watchGame">
          <div class="item">
            <span class="text">倍率</span>
            <span class="value">{{ gameInfo.multiplier || 0 }}</span>
          </div>
          <div class="item">
            <span class="text">预计积分</span>
            <span class="value">{{ formatNumberWithCommas(gameInfo.expectedWinPointCard) || 0 }}</span>
          </div>
          <div class="item">
            <span class="text">预计弹珠</span>
            <span class="value">{{ formatNumberWithCommas(gameInfo.expectedWinMarble) || 0 }}</span>
          </div>
        </div>
      </div>
      <div class="right-button-list">
        <div class="button" @click="showSettingDialog = true">
          <i class="icon">
            <img src="@/assets/images/room/setting.png" alt="" />
          </i>
          <img src="@/assets/images/room/text/setting.png" alt="" class="text-icon" />
        </div>
      </div>


      <!-- 弹幕 -->
      <div class="danmaku" :class="{ 'start-game': isStartGame }">
        <div ref="danmaku-list" class="list" v-show="danmakuCollapse && danmakuList.length">
          <div class="item" v-for="(item, index) in danmakuList" :key="index">
            {{ item.content }}
          </div>
        </div>
        <div class="send">
          <div class="input">
            <input type="text" placeholder="发点弹幕吧~" v-model="danmakuContent" @change="sendDanmaku" />
          </div>
          <span class="collapse" @click="danmakuCollapse = !danmakuCollapse">
            {{ danmakuCollapse ? '收起' : '展开' }}
          </span>
        </div>
      </div>
      <div class="footer">
        <div class="ball-info">
          <div class="item">
            <i class="ball"></i>
            <span class="count">X{{ formatNumberWithCommas(marbleAmount) }}</span>
          </div>
          <div class="item">
            <i class="point"></i>
            <span class="count">X{{ formatNumberWithCommas(cardAmount) }}</span>
          </div>
        </div>
        <div class="gaming" :class="{ 'left-hand': handIsLeft }" v-if="isStartGame">
          <div class="left">
            <p class="desc">已投入{{ ball }}枚弹珠，预计可获得{{ gameInfo.expectedWinMarble }}枚</p>
            <div class="buttons" :class="{ 'no-click': gaming }">
              <div class="item">
                <span @click="changeBall(5)">+5</span>
              </div>
              <div class="item">
                <span @click="changeBall(20)">+20</span>
              </div>
              <div class="item" @click="changeBall(50)">
                <span>+50</span>
              </div>
              <div class="item" @click="changeBall(roomInfo.maxMarble)">
                <span>+满</span>
              </div>
              <div class="item">
                <span class="input" @click="inputChange">{{ inputBall }}</span>
              </div>
              <div class="item" @click="changeBall(stepBall)">
                <img class="add" src="@/assets/images/room/add-ball.png" alt="" />
              </div>
            </div>
          </div>
          <div class="right">
            <div class="change-hand" @click="handIsLeft = !handIsLeft">
              切换{{ handIsLeft ? '右手' : '左手' }}
            </div>
            <div class="joy-stick">
              <i class="stick" :class="{ left: handIsLeft, right: !handIsLeft }" ref="stickRef"
                :style="{ transform: `translateY(${stickMovePercent}%)` }"></i>
              <span class="percent">{{ stickMovePercent }}%</span>
            </div>
          </div>
        </div>
        <div class="start" v-else>
          <!-- 暂时无法游戏,其他人在游戏中 -->
          <div v-if="watchGame" class="watch-game">暂时无法游戏,其他人在游戏中</div>
          <img v-else src="@/assets/images/room/start-game.png" alt="" class="button" @click="clickStart" />
        </div>
      </div>
    </div>
  </main>
  <!-- 功能弹窗 -->
  <div class="setting-dialog" v-show="showSettingDialog">
    <div class="mask"></div>
    <div class="content">
      <div class="title">设置功能</div>
      <div class="list">
        <div class="model" @click="showGameRule = true">
          <div class="icon">
            <img src="@/assets/images/room/icon1.png" alt="" />
          </div>
          <div class="text">
            <img src="@/assets/images/room/text/yygz.png" alt="" />
          </div>
        </div>
        <div class="model" v-if="!watchGame" @click="openWinRecord">
          <div class="icon">
            <img src="@/assets/images/room/icon2.png" alt="" />
          </div>
          <div class="text">
            <img src="@/assets/images/room/text/zjjl.png" alt="" />
          </div>
        </div>
        <div class="model" @click="toggleMusic">
          <div class="icon">
            <img src="@/assets/images/room/icon3.png" alt="" />
          </div>
          <div class="text">
            <img src="@/assets/images/room/text/music-off.png" alt="" v-if="musicOn" />
            <img src="@/assets/images/room/text/music-on.png" alt="" v-else />
          </div>
        </div>
        <div class="model" v-if="!watchGame" @click="clickRouter('fault-feedback')">
          <div class="icon">
            <img src="@/assets/images/room/icon7.png" alt="" />
          </div>
          <div class="text">
            <img src="@/assets/images/room/text/gzbg.png" alt="" />
          </div>
        </div>
        <div class="model" v-if="!watchGame" @click="showBluetoothConnect = true">
          <div class="icon">
            <img src="@/assets/images/room/icon8.png" alt="" />
            <i class="check" v-if="false"></i>
          </div>
          <div class="text">
            <img src="@/assets/images/room/text/ljsb.png" alt="" />
          </div>
        </div>
        <div class="model">
          <div class="icon">
            <img src="@/assets/images/room/icon4.png" alt="" />
          </div>
          <div class="text">
            <img src="@/assets/images/room/text/lxkf.png" alt="" />
          </div>
        </div>
        <!-- <div class="model">
          <div class="icon">
            <img src="@/assets/images/room/icon5.png" alt="" />
          </div>
          <div class="text">
            <img src="@/assets/images/room/text/sx.png" alt="" />
          </div>
        </div> -->
      </div>
      <div class="close" @click="showSettingDialog = false"></div>
    </div>
  </div>
  <!-- 蓝牙连接 -->
  <div class="bluetooth-connect-dialog" v-if="showBluetoothConnect">
    <div class="mask" @click="showBluetoothConnect = false"></div>
    <div class="content">
      <p class="text">设备连接</p>
      <p class="desc">请确保蓝牙正常开启，连接手柄需要蓝牙处在开启状态</p>
      <div class="confirm" @click="clickBluetoothConnect">立即连接</div>
    </div>
  </div>
  <!-- 游戏规则 -->
  <div class="game-rule-dialog" v-if="showGameRule">
    <div class="content">
      <p class="text">游戏规则</p>
      <div class="desc">
        <p>一、活动时间</p>
        <p>
          即日起 ——
          活动结束前（具体结束时间将通过小程序公告通知，逾期未参与/未兑换奖励视为自动放弃）
        </p>
        <p>二、参与对象 1. 邀请者：本小程序已注册并完成实名认证的用户（无违规记录）；</p>
        <p>
          2.
          被邀请者：未注册过本小程序的新用户（同一手机号、同一设备、同一身份证号视为同一用户，不可重复参与）。
        </p>
        <p>三、拉新流程（超简单，3步搞定）</p>
        <p>1. 邀请者登录小程序，进入【我的】-【拉新有礼】页面，获取专属拉新二维码/邀请链接；</p>
        <p>2. 邀请者将二维码/链接分享给好友（微信好友、朋友圈均可），邀请好友注册；</p>
        <p>
          3.
          被邀请者通过该二维码/链接，完成小程序注册+实名认证（若有），即视为拉新成功，双方即时解锁对应奖励。
        </p>
      </div>
    </div>
    <div class="confirm" @click="showGameRule = false">知道了</div>
  </div>
  <!-- 中奖记录 -->
  <div class="win-record-dialog" v-if="showWinRecord">
    <div class="content">
      <p class="title">中奖记录</p>
      <div class="list-content">
        <InfiniteScroll :loading="loading" :loadOver="loadOver" :empty="isEmpty" @load="loadMore">
          <template #content>
            <div class="list">
              <div class="item" v-for="(item, index) in recordList" :key="index">
                <div class="info">
                  <p class="text">中奖时间</p>
                  <p class="date">{{ item.winTime }}</p>
                </div>
                <div class="right">
                  <p class="price" v-if="item.winCardCount">+{{ item.winCardCount }}积分</p>
                  <p class="price" v-else-if="item.winMarble">+{{ item.winMarble }}弹珠</p>
                </div>
              </div>
            </div>
          </template>
        </InfiniteScroll>
      </div>
    </div>
    <div class="confirm" @click="showWinRecord = false">知道了</div>
  </div>
  <!-- 弹珠消耗 -->
  <WarnningDialog :show="showWarnningDialog" :level="getRoomLevelName(roomInfo.roomTypeId)" :ball="roomInfo.entryFee"
    @toggleShow="closeWarnningDialog">
  </WarnningDialog>
  <!-- 弹珠支付确认 -->
  <ConfirmDialog :show="showConfirmDialog" :level="roomInfo.roomName" :ball="roomInfo.entryFee"
    :marbleAmount="marbleAmount" @close="closeConfirmDialog" @confirm="clickConfirmDialog"></ConfirmDialog>
  <!-- 中奖 -->
  <BallSuccess :show="showBallSuccess"
    :ball="launchInfo.winPointCard > 0 ? launchInfo.winPointCard : launchInfo.winMarble"
    :type="launchInfo.winPointCard > 0 ? 2 : 1" @toggleShow="showBallSuccess = $event"></BallSuccess>

  <!-- 弹珠输入弹窗  -->
  <van-dialog v-model:show="showBallInputDialog" title="投入弹珠" show-cancel-button cancel-button-color="#848691"
    confirm-button-color="#FFB169" @confirm="ballInputConfirm">
    <div class="dialog-content">
      <Input v-model="inputBall" type="number" placeholder="请输入"></Input>
    </div>
  </van-dialog>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  useTemplateRef,
  nextTick,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TRTC from 'trtc-sdk-v5'
import WarnningDialog from '@/components/WarnningDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import BallSuccess from '@/components/BallSuccess.vue'
import { formatNumberWithCommas, getRoomLevelName, formatTimestamp } from '@/utils'
// TRTC资源包
import '@/trtc/lib-generate-test-usersig.min'
import genTestUserSig from '@/trtc/generateTestUserSig'
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import Input from '@/components/FormData/Input.vue'

const route = useRoute()
const router = useRouter()

// 房间使用状态枚举：0-空闲，1-使用中，10-故障，11-下线
const roomUseStatusEnum = {
  0: '空闲',
  1: '游戏中',
  10: '故障',
  11: '下线',
  12: '调试中',
}

const SDK_APP_ID = 1600137711
const SDK_SECRET_KEY = '46d4f2ecbf0e69bd53f7403056d9c0fe9319bc69e8bdadc2ea529de8ca051ec7'

const roomId = ref(+route.params.id)
const tencentRoomId = ref(+route.query.tencentRoomId)
const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')) || {})
const marbleAmount = ref(0)
const cardAmount = ref(0)
const collapse = ref(false)
const isStartGame = ref(false)
const ball = ref(0)
const stepBall = ref(0)
const handIsLeft = ref(false)
const isMoveStick = ref(false)
const stickMovePercent = ref(0)
const stickRef = useTemplateRef('stickRef')
const stickEvent = ref({})
const showWarnningDialog = ref(false)
const showConfirmDialog = ref(false)
const showBallSuccess = ref(false)
const showBluetoothConnect = ref(false)
const gaming = ref(false)
// // 创建 TRTC 实例
const liveStream = useTemplateRef('live-stream')
const trtc = TRTC.create()

const roomInfo = ref({})
const gameInfo = ref({})
const launchInfo = ref({})
const countdown = ref(0)
const danmakuList = ref([]) // 弹幕列表
const danmakuCollapse = ref(true)
const danmakuContent = ref('')
const danmakuListRef = useTemplateRef('danmaku-list')
const isLockRoom = ref(false)
const startTimer = ref(null)
const watchGame = ref(false)
const sendStatus = ref('')
const musicOn = ref(true)
const memberList = ref([])
const showGameRule = ref(false)
const showWinRecord = ref(false)
// 中奖记录列表
const recordList = ref([])
const loading = ref(false)
const loadOver = ref(false)
const isEmpty = ref(false)
// 本局剩余投递上线
const addMax = ref(0)
// 进入房间时间
const enterRoomTime = ref(formatTimestamp(new Date()))
const pollingRoomStatusTimer = ref(null)
const pollingDanmakuTimer = ref(null)
const showSettingDialog = ref(false)
const asyncGameOrderResultTimer = ref(null)
const showBallInputDialog = ref(false)
const inputBall = ref(0)

onMounted(() => {
  init()
  // 轮询：房间当前状态
  pollingRoomStatusTimer.value = setInterval(() => {
    getRoomStatus()
  }, 5000)
  // 轮询：弹幕列表
  pollingDanmakuTimer.value = setInterval(() => {
    queryDanmaku()
  }, 5000)
})

onBeforeUnmount(() => {
  if (pollingRoomStatusTimer.value) {
    clearInterval(pollingRoomStatusTimer.value)
  }
  if (pollingDanmakuTimer.value) {
    clearInterval(pollingDanmakuTimer.value)
  }
  if (startTimer.value) {
    clearInterval(startTimer.value)
  }
  if (asyncGameOrderResultTimer.value) {
    clearInterval(asyncGameOrderResultTimer.value)
  }
  if (isLockRoom.value) {
    unlockRoom()
  }
  clearTrtc()
})

// 退出房间，清除trtc
const clearTrtc = async () => {
  await trtc.exitRoom();
  trtc.off('*');  // 解除所有事件绑定
  trtc.destroy();
  trtc = null;
}

const back = () => {
  $modal.show({
    content: '确认退出房间吗？',
    onConfirm: () => {
      router.back()
    },
  })
}

const init = async () => {
  $toast.loading()
  await Promise.all([getRoomDetail(), createRoom()])
  $toast.close()
}

const reload = async () => {
  $toast.loading()
  await getRoomDetail()
  $toast.close()
}

const updateCount = () => {
  getUserMarbleAmount()
  getPointCardAmount()
}

// 查询当前用户弹珠余额
const getUserMarbleAmount = async () => {
  try {
    const res = await api.post('/pinball/user/account/getMarbleAmount')
    if (res.code === 200) {
      marbleAmount.value = +res.data
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 查询当前用户积分卡余额
const getPointCardAmount = async () => {
  try {
    const res = await api.post('/pinball/user/account/getPointCardAmount')
    if (res.code === 200) {
      cardAmount.value = +res.data
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 创建房间
const createRoom = async () => {
  const sdkAppId = SDK_APP_ID
  const sdkSecretKey = SDK_SECRET_KEY
  const userId = userInfo.value.userId
  const id = tencentRoomId.value
  try {
    const { userSig } = genTestUserSig({ sdkAppId, userId, sdkSecretKey })
    const options = {
      enableAutoPlayDialog: false, // 关闭音频
    }
    await trtc.enterRoom({ sdkAppId, userId, userSig, roomId: id, ...options })
  } catch (error) {
    $toast.info('加入直播间失败')
  }
  // 在进入房间之前，监听 TRTC.EVENT.REMOTE_VIDEO_AVAILABLE 事件，以接收所有远端用户视频发布事件。
  trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
    trtc.startRemoteVideo({ userId, streamType, view: liveStream.value })
  })
}

// 获取房间详情
const getRoomDetail = async () => {
  try {
    const res = await api.post('/pinball/room/getRoomDetail', { roomId: roomId.value })
    if (res.code === 200) {
      const { useStatus, self, pendingOrder, lockCountdown } = res.data
      if (useStatus > 1) {
        $modal.show({
          content: `房间${roomUseStatusEnum[useStatus]}，请选择其他房间`,
          showCancel: false,
          onConfirm: () => {
            router.back()
          },
        })
        return
      }
      sendStatus.value = ''
      roomInfo.value = res.data
      ball.value = roomInfo.value.entryFee
      addMax.value = roomInfo.value.maxMarble - roomInfo.value.entryFee
      stepBall.value = roomInfo.value.entryFee
      // 查询观战人列表
      getMemberList()
      // 当前是否观战
      if (self === 0 && useStatus === 1) {
        watchGame.value = true
        return
      }
      // 存在已开局的游戏
      if (pendingOrder) {
        if (!isLockRoom.value) {
          isLockRoom.value = true
        }
        isStartGame.value = true
        gameInfo.value = {
          ...gameInfo.value,
          ...pendingOrder
        }
        countdown.value = lockCountdown
        setCountdown()
        nextTick(() => {
          initStickEvent()
        })
      } else {
        const entryRoom = localStorage.getItem('entryRoom')
        if (entryRoom) {
          showWarnningDialog.value = true
          localStorage.removeItem('entryRoom')
        }
      }
      updateCount()
    } else {
      // 把当前房间状态置为故障
      roomInfo.value.useStatus = 10
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 确认订单&锁房
const startGame = async () => {
  try {
    $toast.loading()
    const res = await api.post('/pinball/room/startGame', { roomId: roomId.value })
    $toast.close()
    if (res.code === 200) {
      if (!isLockRoom.value) {
        isLockRoom.value = true
      }
      roomInfo.value.useStatus = 1
      if (!roomInfo.value.currentPlayer) {
        const { avatar, nickName, userId } = userInfo.value
        roomInfo.value.currentPlayer = { avatar, nickName, userId }
      }
      isStartGame.value = true
      gameInfo.value = res.data
      countdown.value = res.data.lockCountdown
      sendStatus.value = ''
      setCountdown()
      nextTick(() => {
        initStickEvent()
      })
      updateCount()
    }
    else if (res.code === 500 && res.message === '房间已被占用') {
      reload()
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 弹珠加投
const addMarble = async (marbleCount) => {
  if (marbleCount < 1) {
    $toast.info(`本局已加投${ball.value}颗弹珠，已达本局加投上限`)
    return
  }
  try {
    const res = await api.post('/pinball/room/addMarble', {
      roomId: roomId.value,
      marbleCount,
      orderId: gameInfo.value.orderId,
    })
    if (res.code === 200) {
      const { actualMarble, lockCountdown, expectedWinMarble, expectedWinPointCard, orderId } = res.data
      ball.value = actualMarble
      addMax.value = roomInfo.value.maxMarble - actualMarble
      countdown.value = lockCountdown
      gameInfo.value = {
        ...gameInfo.value,
        expectedWinMarble,
        expectedWinPointCard,
        orderId
      }
      updateCount()
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 发射弹珠（异步）
const launchBall = async () => {
  try {
    // 力度
    const powerLevel = parseInt(stickMovePercent.value / 5)
    if (powerLevel <= 0) {
      return
    }
    countdown.value = 0
    if (startTimer.value) {
      clearInterval(startTimer.value)
    }
    const res = await api.post('/pinball/room/launchBallAsync', {
      roomId: roomId.value,
      powerLevel,
      orderId: gameInfo.value.orderId,
    })
    if (res.code === 200) {
      gaming.value = true
      sendStatus.value = '发射中'
      // 轮询：异步发射订单结果
      if (!asyncGameOrderResultTimer.value) {
        asyncGameOrderResultTimer.value = setInterval(() => {
          getAsyncGameOrderResult()
        }, 500)
      }
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 查询异步发射结果
const getAsyncGameOrderResult = async () => {
  try {
    const res = await api.post('/pinball/room/getAsyncGameOrderResult', { orderId: gameInfo.value.orderId })
    if (res.code === 200) {
      if (res.data?.orderStatus != 1) {
        return
      }
      sendStatus.value = ''
      gaming.value = false
      // 查询到发射结果，清除定时器
      clearInterval(asyncGameOrderResultTimer.value)
      asyncGameOrderResultTimer.value = null
      if (res.data.winFlag === 1) {
        showBallSuccess.value = true
        launchInfo.value = res.data
      } else {
        $toast.info('很遗憾，未中奖')
        sendStatus.value = '未中奖'
      }
      updateCount()
      // 重置订单信息
      gameInfo.value = {}
      isStartGame.value = false
      addMax.value = roomInfo.value.maxMarble - roomInfo.value.entryFee
      ball.value = roomInfo.value.entryFee
    } else {
      throw new Error()
    }
  } catch (e) {
    $toast.info('系统错误')
    sendStatus.value = ''
    gaming.value = false
    // 重置订单信息
    gameInfo.value = {}
    isStartGame.value = false
    addMax.value = roomInfo.value.maxMarble - roomInfo.value.entryFee
    ball.value = roomInfo.value.entryFee
    // 查询到发射结果，清除定时器
    clearInterval(asyncGameOrderResultTimer.value)
    asyncGameOrderResultTimer.value = null
  }
}

// 查询弹幕消息列表
const queryDanmaku = async () => {
  const { danmakuId, createTime } = danmakuList.value[danmakuList.value.length - 1] || {}
  try {
    const res = await api.post('/pinball/room/queryDanmaku', {
      roomId: roomId.value,
      limit: 100, // 查询条数（最大100）
      sortType: 0, // 0-创建时间倒序（默认），1-创建时间正序
      enterRoomTime: enterRoomTime.value,
      // lastCreateTime: createTime,
      // lastDanmakuId: danmakuId,
    })
    if (res.code === 200) {
      danmakuList.value = res.data || []
      nextTick(() => {
        danmakuListRef.value.scrollTop = 99999999
      })
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 发送弹幕消息
const sendDanmaku = async () => {
  if (!danmakuContent.value) {
    $toast.info('请输入弹幕')
    return
  }
  try {
    const res = await api.post('/pinball/room/sendDanmaku', {
      roomId: roomId.value,
      content: danmakuContent.value,
    })
    if (res.code === 200) {
      danmakuList.value = [...danmakuList.value, res.data] //.splice(-5)
      danmakuContent.value = ''
      nextTick(() => {
        danmakuListRef.value.scrollTop = 99999999
      })
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 中奖记录查询（瀑布式分页）
const winRecordList = async () => {
  // 最后一条记录的游戏订单ID
  const lastOrderId = recordList.value[recordList.value.length - 1]?.orderId || ''
  if (!lastOrderId) {
    recordList.value = []
    loadOver.value = false
    isEmpty.value = false
  }
  try {
    loading.value = true
    const pageSize = 20
    const res = await api.post('/pinball/room/winRecordList', {
      roomId: roomId.value,
      pageSize,
      lastOrderId, // 上一页最后一条记录的游戏订单ID（第一页传空）
    })
    loading.value = false
    if (res.code === 200) {
      const list = res.data.data || []
      recordList.value = [...recordList.value, ...list]
      // 加载完毕
      loadOver.value = list.length < pageSize
      // 空列表
      isEmpty.value = loadOver.value && recordList.value.length === 0
    } else {
      loadOver.value = true
      isEmpty.value = true
    }
  } catch (e) {
    $toast.info('系统错误')
    loading.value = false
  }
}

const loadMore = () => {
  winRecordList()
}

// 解锁
const unlockRoom = async () => {
  try {
    const res = await api.post('/pinball/room/unlockRoom', {
      roomId: roomId.value,
    })
    if (res.code === 200) {
      // ...
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 查询成员列表（Next分页）
const getMemberList = async () => {
  try {
    const res = await api.post('/pinball/room/memberList', {
      next: '',
      pageSize: 3,
      roomId: roomId.value
    })
    if (res.code === 200) {
      memberList.value = res.data.memberList || []
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

// 获取房间使用状态
const getRoomStatus = async () => {
  try {
    const res = await api.post('/pinball/room/getRoomStatus', {
      roomId: roomId.value,
    })
    if (res.code === 200) {
      if (res.data === 0) {
        getRoomDetail()
      }
      if (res.data > 1) {
        clearInterval(pollingRoomStatusTimer.value)
        $modal.show({
          content: `房间${roomUseStatusEnum[res.data]}，请选择其他房间`,
          showCancel: false,
          onConfirm: () => {
            router.back()
          },
        })
      }
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const changeBall = (event) => {
  let value = event
  value = Math.max(roomInfo.value.minMarble, value)
  value = Math.min(addMax.value, value)
  addMarble(value)
}

const inputChange = () => {
  showBallInputDialog.value = true
}

const ballInputConfirm = () => {
  if (inputBall.value < 1) {
    $toast.info('最少投入1颗弹珠')
    return
  }
  let value = inputBall.value
  value = Math.max(roomInfo.value.minMarble, value)
  value = Math.min(addMax.value, value)
  addMarble(value)
  nextTick(() => {
    showBallInputDialog.value = false
  })
}

const clickStart = () => {
  showConfirmDialog.value = true
}

const initStickEvent = () => {
  if (!stickRef.value) {
    return
  }

  stickRef.value.addEventListener('touchstart', (event) => {
    event.preventDefault()
    isMoveStick.value = true
    stickMovePercent.value = 0
    stickEvent.value = event.targetTouches[0]

    window.addEventListener('touchmove', (event) => {
      if (!isMoveStick.value) {
        return
      }
      const { top, bottom } = stickRef.value.getBoundingClientRect()
      const max = bottom - top
      let screenY = event.targetTouches[0].screenY - stickEvent.value.screenY
      screenY = Math.min(screenY, max)
      screenY = Math.max(screenY, 0)
      stickMovePercent.value = parseInt((screenY / max) * 100)
    })
  })
  stickRef.value.addEventListener('touchend', (event) => {
    launchBall()
    isMoveStick.value = false
    stickMovePercent.value = 0
    // 删除时间监听
    stickRef.value.removeEventListener('touchstart', () => { })
    window.removeEventListener('touchmove', () => { })
    stickRef.value.removeEventListener('touchend', () => { })
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

const closeWarnningDialog = (event) => {
  showWarnningDialog.value = event
}

const closeConfirmDialog = (event) => {
  showConfirmDialog.value = false
}

const clickConfirmDialog = (event) => {
  showConfirmDialog.value = false
  startGame()
}

const setCountdown = () => {
  if (countdown.value === 0) {
    return
  }
  if (startTimer.value) {
    clearInterval(startTimer.value)
  }
  startTimer.value = setInterval(() => {
    countdown.value--
    if (countdown.value > 2) {
      return
    }
    // 倒计时结束，自动发射弹珠
    stickMovePercent.value = 50
    launchBall()
    isMoveStick.value = false
    stickMovePercent.value = 0
  }, 1000)
}

const toggleMusic = () => {
  musicOn.value = !musicOn.value
}

const clickMember = (item) => {
  $toast.info(item.nickName)
}

const openWinRecord = () => {
  showWinRecord.value = true
  winRecordList()
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
    overflow: hidden;

    .header {
      background-color: transparent;
      z-index: 1;

      .room-id {
        color: rgba(#fff, 0.8);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
        border-radius: .vw(45)[];
        background-color: rgba(#000, 0.45);
        padding: .vw(8)[] .vw(16)[];
      }
    }

    .tabbar {
      height: .vw(30) [];
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      top: .vw(54) [];
      left: .vw(16) [];
      right: .vw(16) [];
      z-index: 1;

      .room-status {
        height: .vw(30) [];
        display: flex;
        align-items: center;
        border-radius: .vw(45) [];
        background-color: rgba(#272933, 0.75);
        padding: .vw(3) [] .vw(10) [] .vw(3) [] .vw(4) [];
        position: absolute;
        left: 0;

        .icon {
          width: .vw(24) [];
          height: .vw(24) [];
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 50%;
          margin-right: .vw(6) [];

          img {
            width: .vw(24) [];
          }
        }

        .text {
          flex: 1;
          color: var(--white--);
          font-family: 'PingFang SC';
          font-size: .vw(12) [];
          line-height: .vw(12) [];
          font-weight: 400;
          font-style: normal;
          text-align: center;
        }
      }

      .status {
        color: var(--white--);
        font-family: 'PingFang SC';
        font-size: .vw(12) [];
        line-height: .vw(30) [];
        font-weight: 400;
        font-style: normal;
        text-align: center;
        border-radius: .vw(45) [];
        background-color: rgba(#272933, 0.75);
        padding: .vw(0) [] .vw(12) [];
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .audience-list {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;

        .user {
          width: .vw(24) [];
          height: .vw(24) [];
          border-radius: 50%;
          border: .vw(1) [] solid rgba(#ffffff, 0.75);
          overflow: hidden;

          &:not(:last-of-type) {
            margin-right: .vw(-8) [];
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
            font-family: 'PingFang SC';
            font-size: .vw(12) [];
            line-height: .vw(12) [];
            font-weight: 400;
            font-style: normal;
            background-color: rgba(#000000, 0.75);
          }
        }
      }
    }

    .bg-panel {
      width: 100%;
      height: .vw(160)[];
      position: absolute;
      left: 0;
      top: 0;
      background-color: #EFA436;
      overflow: hidden;

      &.no-self-room {
        height: .vw(110)[];
      }

      .bg {
        width: .vw(262)[];
        height: .vw(298)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/room/bg-panel.png);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      .icon1 {
        width: .vw(60)[];
        height: .vw(77)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/room/bg-panel-icon.png);
        position: absolute;
        left: .vw(80)[];
        top: .vw(5)[];
      }

      .icon2 {
        width: .vw(111)[];
        height: .vw(64)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/room/bg-panel-text.png);
        position: absolute;
        left: .vw(147)[];
        top: .vw(8)[];
      }

      .info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        top: .vw(90)[];

        .item {
          display: flex;
          flex-direction: column;

          .text {
            color: #641D03;
            font-family: 'PingFang SC';
            font-size: .vw(16) [];
            line-height: .vw(16) [];
            font-weight: 600;
            font-style: normal;
            margin-bottom: .vw(6)[];
          }

          .value {
            width: .vw(92)[];
            height: .vw(38)[];
            color: #FFD5D5;
            font-family: 'PingFang SC';
            font-size: .vw(24) [];
            line-height: .vw(24) [];
            font-weight: 600;
            font-style: normal;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: .vw(8)[];
            border: 1px solid #FF7716;
            background-color: #641D03;
          }
        }
      }
    }

    .right-button-list {
      width: .vw(64) [];
      display: flex;
      align-items: center;
      flex-direction: column;
      position: absolute;
      top: .vw(180) [];
      right: .vw(16) [];

      &.no-self-room {
        top: .vw(120) [];
      }

      .button {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;

        &:not(:last-of-type) {
          margin-bottom: .vw(12) [];
        }

        .icon {
          width: .vw(42) [];
          height: .vw(42) [];
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          background-color: rgba(0, 0, 0, 0.65);
          margin-bottom: .vw(4) [];

          img {
            width: .vw(28) [];
            height: .vw(28) [];
          }
        }

        .rotate {
          transform: rotate(-180deg);
        }

        .text {
          color: var(--white--);
          -webkit-text-stroke-width: .vw(1) [];
          -webkit-text-stroke-color: #835b5b;
          font-family: 'HarmonyOS Sans SC';
          font-size: .vw(16) [];
          line-height: .vw(16) [];
          font-weight: 900;
          font-style: normal;
        }

        .text-icon {
          height: .vw(18) [];
        }
      }
    }

    .danmaku {
      position: fixed;
      left: .vw(16) [];
      bottom: .vw(148) [];

      &.start-game {
        bottom: .vw(210) [];
      }

      .list {
        width: .vw(180) [];
        max-height: .vw(110) [];
        overflow-x: hidden;
        overflow-y: auto;
        margin-bottom: .vw(4) [];

        .item {
          width: 100%;
          color: var(--white--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(22) [];
          font-weight: 500;
          font-style: normal;
        }
      }

      .send {
        width: .vw(180) [];
        display: flex;
        align-items: center;
        border-radius: .vw(45) [];
        background-color: rgba(0, 0, 0, 0.45);
        padding: .vw(12) [] .vw(24) [];

        .input {
          flex: 1;

          input {
            width: 100%;
            border: none;
            outline: none;
            color: #b7b9c1;
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
            font-weight: 400;
            font-style: normal;
            background-color: transparent;

            &::placeholder {
              color: #b7b9c1;
            }
          }
        }

        .collapse {
          color: var(--white--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 500;
          font-style: normal;
          margin-left: .vw(16) [];
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
        padding: 0 .vw(16) [];
        margin-bottom: .vw(10) [];

        .item {
          // min-width: .vw(100)[];
          display: flex;
          align-items: center;
          border-radius: .vw(45) [];
          background-color: rgba(0, 0, 0, 0.45);
          padding: .vw(4) [] .vw(8) [];

          &:not(:last-of-type) {
            margin-right: .vw(9) [];
          }

          .ball,
          .point {
            width: .vw(24) [];
            height: .vw(24) [];
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            margin-right: .vw(8) [];
          }

          .ball {
            background-image: url(@/assets/images/ball.png);
          }

          .point {
            background-image: url(@/assets/images/point.png);
          }

          .count {
            color: var(--white--);
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
            font-weight: 500;
            font-style: normal;
          }
        }

        .magnification {
          height: .vw(32) [];
          color: var(--white--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(32) [];
          font-weight: 500;
          font-style: normal;
          align-items: center;
          border-radius: .vw(45) [];
          border: .vw(1) [] solid #ff7716;
          background: var(--006, linear-gradient(153deg, #eb8c67 5.44%, #f5c8b0 80.37%));
          padding: 0 .vw(12) [];
        }
      }

      .gaming {
        display: flex;
        border-radius: .vw(12) [] .vw(12) [] 0 0;
        border: .vw(8) [] solid var(--warning-warning-6-normal-ff-7716, #ff7716);
        background: #ffd1ae;
        box-shadow: 0 0 0 .vw(8) [] #f7b058 inset;
        padding-top: .vw(18) [];
        padding-bottom: .vw(8) [];
        position: relative;

        .left {
          padding-left: .vw(20) [];

          .desc {
            color: var(--text--);
            font-family: 'PingFang SC';
            font-size: .vw(12) [];
            line-height: .vw(12) [];
            font-weight: 200;
            font-style: normal;
            margin-bottom: .vw(12) [];
          }

          .buttons {
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            .item {
              width: .vw(70) [];
              height: .vw(32) [];
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: .vw(8) [];
              border: .vw(2) [] solid #ff7716;
              background: linear-gradient(153deg, #ffa785 5.44%, #ffd2ba 80.37%);
              overflow: hidden;
              margin-bottom: .vw(10) [];

              &:not(:nth-child(3n + 0)) {
                margin-right: .vw(8) [];
              }

              span {
                color: #902904;
                font-size: .vw(16) [];
                line-height: .vw(16) [];
                font-weight: 900;
                font-style: normal;
              }

              .sub,
              .add {
                width: .vw(16) [];
              }

              .input {
                width: 100%;
                height: 100%;
                color: var(--light-text--);
                font-size: .vw(16) [];
                line-height: .vw(16) [];
                font-weight: 900;
                font-style: normal;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #fff;
              }
            }
          }
        }

        .right {
          width: .vw(100) [];
          min-width: .vw(100) [];
          display: flex;
          align-items: center;
          flex-direction: column;
          padding-right: .vw(25) [];

          .change-hand {
            height: .vw(24) [];
            padding: 0 .vw(12) [];
            color: var(--white--);
            font-family: 'PingFang SC';
            font-size: .vw(12) [];
            font-weight: 500;
            font-style: normal;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: .vw(8) [];
            border: .vw(1) [] solid #ff7716;
            background: linear-gradient(153deg, #eb8c67 5.44%, #f5c8b0 80.37%);
            margin-bottom: .vw(4) [];
          }

          .joy-stick {
            width: .vw(48) [];
            height: .vw(78) [];
            border-radius: .vw(8) [];
            border: .vw(2) [] solid #d95809;
            background-color: #361608;
            box-shadow: 0 .vw(-4) [] .vw(4) [] 0 #4a1100 inset;
            position: relative;

            &::before {
              content: '';
              width: .vw(30) [];
              height: .vw(46) [];
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url(@/assets/images/room/arrow-top.png);
              position: absolute;
              top: .vw(5) [];
              left: 50%;
              transform: translateX(-50%) rotate(180deg);
            }

            .percent {
              width: 100%;
              color: #c24b16;
              font-family: 'PingFang SC';
              font-size: .vw(14) [];
              line-height: .vw(14) [];
              font-weight: 500;
              font-style: normal;
              text-align: center;
              position: absolute;
              bottom: .vw(8) [];
            }

            .stick {
              min-width: .vw(62) [];
              min-height: .vw(30) [];
              display: flex;
              position: absolute;
              top: .vw(0) [];
              transform: translateY(0px);

              &.left {
                left: .vw(11) [];

                &::before {
                  content: '';
                  min-width: .vw(62) [];
                  min-height: .vw(30) [];
                  background-size: 100%;
                  background-position: center;
                  background-repeat: no-repeat;
                  background-image: url(@/assets/images/room/joy-stick.png);
                  transform: rotate(180deg);
                  transform-origin: left;
                }
              }

              &.right {
                left: .vw(11) [];

                &::before {
                  content: '';
                  min-width: .vw(62) [];
                  min-height: .vw(30) [];
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
            padding-left: .vw(15) [];
          }

          .right {
            padding-right: 0;
            padding-left: .vw(25) [];
          }
        }
      }

      .start {
        display: flex;
        justify-content: center;
        border-radius: .vw(12) [] .vw(12) [] 0 0;
        border: .vw(8) [] solid var(--warning-warning-6-normal-ff-7716, #ff7716);
        background: #ffd1ae;
        box-shadow: 0 0 0 .vw(8) [] #f7b058 inset;
        padding: .vw(12) [] 0;

        .watch-game {
          color: var(--light-text--);
          font-size: .vw(18) [];
          line-height: .vw(18) [];
          font-weight: 400;
          font-style: normal;
          text-align: center;
          padding: .vw(15) [] 0;
        }

        .button {
          width: .vw(120) [];
        }
      }
    }
  }
}

.setting-dialog {
  .mask {
    content: '';
    position: fixed;
    z-index: 10000;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(#272933, 0.75);
  }

  .content {
    width: .vw(328)[];
    height: .vw(442)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/room/setting-dialog-bg.png);
    position: fixed;
    z-index: 10001;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: .vw(24)[];

    &::before {
      content: '';
      width: .vw(89)[];
      height: .vw(95)[];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/room/setting-dialog-icon.png);
      position: absolute;
      top: .vw(-18)[];
      left: .vw(24)[];
    }

    .title {
      color: var(--light-text--);
      font-family: 'PingFang SC';
      font-size: .vw(30) [];
      line-height: .vw(30) [];
      letter-spacing: .vw(5) [];
      font-weight: 900;
      font-style: normal;
      text-align: right;
      margin-right: .vw(15)[];
      margin-bottom: .vw(35)[];
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .model {
        width: .vw(77)[];
        height: .vw(93)[];
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        border-radius: .vw(24)[];
        border: .vw(4)[] solid #FF7716;
        background-color: #B64C01;
        margin-bottom: .vw(24) [];

        &:not(:nth-child(3n + 0)) {
          margin-right: .vw(24) [];
        }

        .icon {
          width: .vw(42)[];
          height: .vw(42)[];
          margin-bottom: .vw(10)[];
          position: relative;

          img {
            width: 100%;
          }

          .check {
            width: .vw(18) [];
            height: .vw(18) [];
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(@/assets/images/check-icon.png);
            position: absolute;
            right: .vw(4) [];
            bottom: .vw(0) [];
          }
        }

        .text {
          max-width: .vw(64)[];
          height: .vw(16)[];

          img {
            height: 100%;
          }
        }
      }
    }

    .close {
      width: .vw(24) [];
      height: .vw(24) [];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/close.png);
      position: absolute;
      bottom: .vw(-60)[];
      left: 50%;
      transform: translateX(-50%);
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
    width: .vw(358) [];
    height: .vw(232) [];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/room/bluetooth-connect-bg.png);
    position: relative;
    z-index: 10002;
    padding: .vw(24) [];

    &::before {
      content: '';
      width: .vw(88) [];
      height: .vw(88) [];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/room/bluetooth-connect-icon.png);
      position: absolute;
      top: .vw(-11) [];
      right: .vw(12) [];
    }

    .text {
      color: var(--light-text--);
      font-family: 'PingFang SC';
      font-size: .vw(30) [];
      line-height: .vw(30) [];
      letter-spacing: .vw(5) [];
      font-weight: 900;
      font-style: normal;
      margin-bottom: .vw(37) [];
    }

    .desc {
      color: #332a03;
      font-family: 'PingFang SC';
      font-size: .vw(14) [];
      line-height: .vw(22) [];
      font-weight: 500;
      font-style: normal;
      margin-bottom: .vw(11) [];
    }

    .confirm {
      width: 100%;
      height: .vw(48) [];
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--white--);
      font-size: .vw(16) [];
      line-height: .vw(16) [];
      font-weight: 500;
      font-style: normal;
      border-radius: .vw(45) [];
      border: 1px solid #ff3a64;
      background: linear-gradient(90deg, #fd689a 0%, #ffab2d 100%);
    }
  }
}

&.no-click {
  pointer-events: none !important;
}

.game-rule-dialog {
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

  .content {
    width: .vw(358) [];
    height: .vw(553) [];
    display: flex;
    flex-direction: column;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/invitation/new-user-dialog-bg.png);
    position: relative;
    z-index: 10002;
    padding: .vw(32) [] .vw(19) [] .vw(16) [] .vw(19) [];
    margin-bottom: .vw(13) [];

    &::before {
      content: '';
      width: .vw(96) [];
      height: .vw(85) [];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/invitation/new-user-dialog-icon.png);
      position: absolute;
      top: .vw(-7) [];
      right: .vw(14) [];
    }

    .text {
      color: var(--light-text--);
      font-family: 'PingFang SC';
      font-size: .vw(30) [];
      line-height: .vw(30) [];
      letter-spacing: .vw(5) [];
      font-weight: 900;
      font-style: normal;
      margin-left: .vw(9) [];
      margin-bottom: .vw(17) [];
    }

    .desc {
      flex: 1;
      border-radius: .vw(24) [];
      border: .vw(2) [] solid var(--white--);
      background: linear-gradient(180deg,
          rgba(255, 255, 255, 0.24) 0%,
          rgba(255, 255, 255, 0.75) 100%);
      overflow-x: hidden;
      overflow-y: auto;
      padding: .vw(16) [] .vw(20) [];

      p {
        color: #50525c;
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(22) [];
        font-weight: 500;
        font-style: normal;
      }
    }
  }

  .confirm {
    width: .vw(292) [];
    height: .vw(48) [];
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white--);
    font-size: .vw(16) [];
    line-height: .vw(16) [];
    font-weight: 500;
    font-style: normal;
    border-radius: .vw(45) [];
    border: 1px solid #ff3a64;
    background: linear-gradient(90deg, #fd689a 0%, #ffab2d 100%);
  }
}

.win-record-dialog {
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

  .content {
    width: .vw(358) [];
    height: .vw(553) [];
    display: flex;
    flex-direction: column;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/invitation/new-user-dialog-bg.png);
    position: relative;
    z-index: 10002;
    padding: .vw(32) [] .vw(19) [] .vw(16) [] .vw(19) [];
    margin-bottom: .vw(13) [];

    &::before {
      content: '';
      width: .vw(96) [];
      height: .vw(85) [];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/invitation/new-user-dialog-icon.png);
      position: absolute;
      top: .vw(-7) [];
      right: .vw(14) [];
    }

    .title {
      color: var(--light-text--);
      font-family: 'PingFang SC';
      font-size: .vw(30) [];
      line-height: .vw(30) [];
      letter-spacing: .vw(5) [];
      font-weight: 900;
      font-style: normal;
      margin-left: .vw(9) [];
      margin-bottom: .vw(17) [];
    }

    .list-content {
      flex: 1;
      border-radius: .vw(24) [];
      border: .vw(2) [] solid var(--white--);
      background: linear-gradient(180deg,
          rgba(255, 255, 255, 0.24) 0%,
          rgba(255, 255, 255, 0.75) 100%);
      overflow-x: hidden;
      overflow-y: auto;
      padding: .vw(13) [] .vw(16) [];

      .list {
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: .vw(9) [];
          background-color: #fff;
          padding: .vw(16) [];

          &:not(:last-of-type) {
            margin-bottom: .vw(8) [];
          }

          .info {
            .text {
              color: var(--light-text--);
              font-family: 'PingFang SC';
              font-size: .vw(16) [];
              line-height: .vw(16) [];
              font-weight: 500;
              font-style: normal;
              margin-bottom: .vw(8) [];
            }

            .date {
              color: var(--text--);
              font-family: 'PingFang SC';
              font-size: .vw(14) [];
              line-height: .vw(14) [];
              font-weight: 400;
              font-style: normal;
            }
          }

          .right {
            .price {
              color: #f20c32;
              font-family: 'PingFang SC';
              font-size: .vw(16) [];
              line-height: .vw(16) [];
              font-weight: 500;
              font-style: normal;
              text-align: center;
            }
          }
        }
      }
    }
  }

  .confirm {
    width: .vw(292) [];
    height: .vw(48) [];
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white--);
    font-size: .vw(16) [];
    line-height: .vw(16) [];
    font-weight: 500;
    font-style: normal;
    border-radius: .vw(45) [];
    border: 1px solid #ff3a64;
    background: linear-gradient(90deg, #fd689a 0%, #ffab2d 100%);
  }
}

.dialog-content {
  padding: .vw(20)[] .vw(40)[];
  margin: 0 auto;

  :deep .input {
    text-align: center !important;
  }
}
</style>

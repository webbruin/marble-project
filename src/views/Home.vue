<template>
  <main class="home">
    <div class="title">弹珠潮玩</div>
    <div class="room-tab">
      <div class="item" :class="{ 'light': roomParams.roomLevel === item.level }" v-for="(item, index) in roomLevelList"
        :key="index" @click="clickRoomTab(item)">
        <img class="icon" :src="item.icon" alt="">
        <span class="text" :class="{ light: roomParams.roomLevel == item.level }">{{ item.name }}</span>
      </div>
      <div class="more" @click="moreRoomTab">更多</div>
    </div>
    <div class="banner">
      <img src="@/assets/images/home/banner.png" alt="">
    </div>
    <div class="entry">
      <div class="left">
        <div class="recharge" @click="showRechargeDialog = true">
          <p class="text">弹珠充值</p>
          <p class="desc">弹珠充值充值中心</p>
          <img src="@/assets/images/home/recharge-icon.png" alt="" class="icon">
        </div>
      </div>
      <div class="right">
        <div class="sign-in" @click="clickCheckIn">
          <p class="text">每日签到</p>
          <p class="desc">签到获得弹珠</p>
          <img src="@/assets/images/home/sign-in-icon.png" alt="" class="icon">
        </div>
        <div class="rank" @click="clickRanking">
          <p class="text">排行榜</p>
          <p class="desc">查看积分排行榜</p>
          <img src="@/assets/images/home/Rank-icon.png" alt="" class="icon">
        </div>
      </div>
    </div>
    <div class="filter">
      <div class="item" :class="{ light: roomParams.sortType === item.type }" v-for="(item, index) in sortTypeList"
        :key="index">
        <span @click="clickFilter(item)">{{ item.name }}</span>
        <template v-if="item.sort">
          <div class="sort" :class="{ 'low': roomParams.order === 'low', 'hight': roomParams.order === 'hight' }"></div>
        </template>
      </div>
    </div>
    <div class="room-list">
      <div class="item" v-for="(item, index) in roomList" :key="index" @click="clickRoom(item)">
        <div class="status">
          <img v-if="item.useStatus === 1" class="icon" src="@/assets/images/home/room-gaming.png" alt="">
          <img v-else class="icon" src="@/assets/images/home/room-idle.png" alt="">
          <span class="text">{{ roomUseStatusEnum[item.useStatus] }}</span>
        </div>
        <div class="user-list" v-if="item.currentPlayerCount">
          <div class="user" v-for="userIndex in Math.min(item.currentPlayerCount, 3)" :key="userIndex">
            <img class="avatar" src="@/assets/images/avatar.png" alt="">
          </div>
          <div class="user">
            <span class="count">{{ item.currentPlayerCount }}</span>
          </div>
        </div>
        <div class="room-name">{{ item.roomName }}</div>
        <div class="room-ball">
          <img class="icon" src="@/assets/images/ball.png" alt="">
          <span class="count">X{{ item.entryFee }} 起</span>
        </div>
      </div>
    </div>
    <RechargeDialog :show="showRechargeDialog" @toggleShow="showRechargeDialog = $event"></RechargeDialog>
  </main>

</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RechargeDialog from '../components/RechargeDialog.vue'

const route = useRoute()
const router = useRouter()

// 房间使用状态枚举：0-空闲，1-使用中，10-故障，11-下线
const roomUseStatusEnum = {
  0: '空闲',
  1: '使用中',
  10: '故障',
  11: '下线'
}

const roomLevelList = ref([
  {
    name: '初级房间',
    level: 1,
    icon: new URL(`@/assets/images/home/low-icon.png`, import.meta.url).href,
  },
  {
    name: '中级房间',
    level: 2,
    icon: new URL(`@/assets/images/home/middle-icon.png`, import.meta.url).href,
  },
  {
    name: '高级房间',
    level: 3,
    icon: new URL(`@/assets/images/home/hight-icon.png`, import.meta.url).href,
  }
])
const sortTypeList = ref([
  { name: '推荐', type: 'recommend' },
  { name: '热度', type: 'hot' },
  { name: '空闲', type: 'idle' },
  { name: '价格', type: 'price', sort: true },
])

const roomParams = ref({
  roomLevel: 1,  // 房间等级：1-初级，2-中级，3-高级
  sortType: 'recommend',  // 推荐-recommend 热度-hot 空闲-idle 价格-price
  order: '',  // 低到高-low 高到低-hight
})
// 房间列表
const roomList = ref([])
// 
const showRechargeDialog = ref(false)

onMounted(() => {
  getRoomList()
})

watch(
  () => roomParams.value, (newData, oldData) => {
    getRoomList()
  },
  {
    deep: true
  }
)

const getRoomList = async () => {
  const res = await api.post('/homepage/listRooms', roomParams.value)
  if (res.code === 200) {
    roomList.value = res.data
  } else {
    $toast.info(res.message)
  }
}

const clickRoomTab = (item) => {
  roomParams.value.roomLevel = item.level
}

const moreRoomTab = () => {
  // router.push('');
}

const clickCheckIn = () => {
  router.push({ name: 'check-in' });
}

const clickRanking = () => {
  router.push({ name: 'ranking' });
}

const clickFilter = (item) => {
  roomParams.value.sortType = item.type
  // 价格排序
  if (roomParams.value.sortType === 'price') {
    if (roomParams.value.order === 'low') {
      roomParams.value.order = 'hight'
    } else {
      roomParams.value.order = 'low'
    }
  }
}

const clickRoom = (item) => {
  if (item.useStatus !== 0) {
    $toast.info(`该房间目前处于${roomUseStatusEnum[item.useStatus]}中`)
    return
  }
  const { id, cameraDeviceId, machineCode } = item
  router.push({ name: 'room', params: { id }, query: { cameraDeviceId, machineCode } });
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.home {
  background-color: #F0EDDE;
  position: relative;

  &::before {
    content: '';
    width: 100%;
    height: .vw(300)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/home/home-bg.png);
    position: absolute;
    top: 0;
  }

  >div {
    position: relative;
  }

  .title {
    color: var(--light-text--);
    font-size: .vw(32)[];
    line-height: .vw(32)[];
    font-weight: 900;
    padding: .vw(12)[] .vw(18)[] .vw(12)[] .vw(18)[];
  }

  .room-tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .vw(16)[];
    margin-bottom: .vw(16)[];

    .item {
      width: .vw(100)[];
      height: .vw(42)[];
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;

      &:nth-of-type(1) {
        background-image: url(@/assets/images/home/low-room.png);
      }

      &:nth-of-type(2) {
        background-image: url(@/assets/images/home/middle-room.png);
      }

      &:nth-of-type(3) {
        background-image: url(@/assets/images/home/hight-room.png);
      }

      .icon {
        width: .vw(30)[];
        height: .vw(30)[];
        margin-right: .vw(3)[];
      }

      .text {
        color: var(--light-text--);
        font-size: .vw(14)[];
        font-weight: 600;
        font-style: normal;
      }

      &.light {
        &:nth-of-type(1) {
          background-image: url(@/assets/images/home/low-room-selected.png);
        }

        &:nth-of-type(2) {
          background-image: url(@/assets/images/home/middle-room-selected.png);
        }

        &:nth-of-type(3) {
          background-image: url(@/assets/images/home/hight-room-selected.png);
        }
      }
    }

    .more {
      width: .vw(30)[];
      height: .vw(42)[];
      font-size: .vw(12)[];
      font-weight: 500;
      font-style: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: .vw(6)[];
      border: .vw(2)[] solid var(--light-text--);
      background: linear-gradient(180deg, #FFD332 0%, #FFF7DC 100%);
      padding: 0 .vw(8)[];
    }
  }

  .banner {
    padding: 0 .vw(16)[];
    margin-bottom: .vw(16)[];

    img {
      width: 100%;
      border-radius: .vw(16)[];
      border: .vw(2)[] solid var(--light-text--);
      overflow: hidden;
    }
  }

  .entry {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .vw(16)[];
    margin-bottom: .vw(16)[];

    .left {
      margin-right: .vw(8)[];

      .recharge {
        width: .vw(171)[];
        height: .vw(149)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/home/recharge-bg.png);
        position: relative;
        overflow: hidden;

        &::after {
          content: '';
          width: .vw(59)[];
          height: .vw(45)[];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/home/recharge-go.png);
          transform: rotate(-0.452deg);
          position: absolute;
          bottom: .vw(-2)[];
          right: .vw(-5)[];
        }

        .text {
          color: var(--light-text--);
          font-size: .vw(24)[];
          line-height: .vw(28)[];
          font-weight: 900;
          font-style: normal;
          position: absolute;
          top: .vw(21)[];
          left: .vw(15)[];
        }

        .desc {
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(24)[];
          font-weight: 400;
          font-style: normal;
          position: absolute;
          top: .vw(49)[];
          left: .vw(15)[];
        }

        .icon {
          width: .vw(96)[];
          height: .vw(96)[];
          aspect-ratio: 1/1;
          position: absolute;
          left: 0;
          bottom: 0;
        }
      }
    }

    .right {
      .sign-in {
        width: .vw(174)[];
        height: .vw(86)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/home/sign-in-bg.png);
        position: relative;
        overflow: hidden;
        margin-bottom: .vw(8)[];

        .text {
          color: var(--light-text--);
          font-size: .vw(24)[];
          line-height: .vw(28)[];
          font-weight: 900;
          font-style: normal;
          position: absolute;
          top: .vw(15)[];
          left: .vw(13)[];
        }

        .desc {
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(24)[];
          font-weight: 400;
          font-style: normal;
          position: absolute;
          top: .vw(46)[];
          left: .vw(16)[];
        }

        .icon {
          width: .vw(48)[];
          height: .vw(54)[];
          aspect-ratio: 8/9;
          position: absolute;
          top: .vw(1)[];
          right: .vw(9)[];
        }
      }

      .rank {
        width: .vw(174)[];
        height: .vw(56)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/home/rank-bg.png);
        position: relative;
        overflow: hidden;

        .text {
          color: var(--light-text--);
          font-size: .vw(14)[];
          line-height: .vw(24)[];
          font-weight: 900;
          font-style: normal;
          position: absolute;
          top: .vw(8)[];
          left: .vw(15)[];
        }

        .desc {
          color: var(--text--);
          font-family: "PingFang SC";
          font-size: .vw(12)[];
          line-height: .vw(12)[];
          font-weight: 400;
          font-style: normal;
          position: absolute;
          top: .vw(32)[];
          left: .vw(15)[];
        }

        .icon {
          width: .vw(40)[];
          height: .vw(40)[];
          aspect-ratio: 1/1;
          position: absolute;
          top: .vw(8)[];
          right: .vw(17)[];
        }
      }
    }
  }

  .filter {
    display: flex;
    padding: 0 .vw(16)[];
    margin-bottom: .vw(16)[];
    overflow-x: auto;
    overflow-y: hidden;

    .item {
      display: flex;
      align-items: center;

      &:not(:last-of-type) {
        margin-right: .vw(24)[];
      }

      span {
        width: .vw(32)[];
        color: var(--text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(28)[];
        font-weight: 500;
        font-style: normal;
      }

      .sort {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        margin-left: .vw(6)[];

        &::before {
          content: '';
          width: .vw(6)[];
          height: .vw(6)[];
          border-top: .vw(1)[] solid var(--text--);
          border-left: .vw(1)[] solid var(--text--);
          border-bottom: .vw(1)[] solid transparent;
          border-right: .vw(1)[] solid transparent;
          transform: rotate(45deg);
        }

        &::after {
          content: '';
          width: .vw(6)[];
          height: .vw(6)[];
          border-top: .vw(1)[] solid transparent;
          border-left: .vw(1)[] solid transparent;
          border-bottom: .vw(1)[] solid var(--text--);
          border-right: .vw(1)[] solid var(--text--);
          transform: rotate(45deg);
        }

        &.low {
          &::before {
            border-top: .vw(1)[] solid var(--light-text--);
            border-left: .vw(1)[] solid var(--light-text--);
          }
        }

        &.hight {
          &::after {
            border-bottom: .vw(1)[] solid var(--light-text--);
            border-right: .vw(1)[] solid var(--light-text--);
          }
        }
      }
    }

    .light {
      span {
        width: .vw(48)[];
        color: var(--light-text--);
        font-size: .vw(24)[];
        line-height: .vw(24)[];
        background-size: 90%;
        background-position: center .vw(7)[];
        background-repeat: no-repeat;
        background-image: url(@/assets/images/home/filter-select-bg.png);
      }
    }
  }

  .room-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 .vw(16)[];

    .item {
      width: .vw(166)[];
      height: .vw(175)[];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/home/room-bg.png);
      border-radius: .vw(12)[];
      margin-bottom: .vw(10)[];
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        width: 100%;
        height: .vw(72)[];
        border-radius: 0 0 .vw(12)[] .vw(12)[];
        background: linear-gradient(179deg, rgba(0, 0, 0, 0.00) -22.52%, rgba(0, 0, 0, 0.45) 99.13%);
        position: absolute;
        bottom: 0;
      }

      .status {
        display: flex;
        align-items: center;
        border-radius: .vw(45)[];
        background-color: rgba(#272933, 0.75);
        padding: .vw(3)[] .vw(8)[];
        position: absolute;
        top: .vw(12)[];
        left: .vw(6)[];

        .icon {
          width: .vw(12)[];
          height: .vw(12)[];
          margin-right: .vw(6)[];
        }

        .text {
          color: var(--white--);
          font-family: "PingFang SC";
          font-size: .vw(12)[];
          line-height: .vw(12)[];
          font-weight: 400;
          font-style: normal;
        }
      }

      .user-list {
        display: flex;
        align-items: center;
        position: absolute;
        top: .vw(12)[];
        right: .vw(15)[];

        .user {
          width: .vw(18)[];
          height: .vw(18)[];
          border-radius: 50%;
          border: .vw(1)[] solid rgba(#ffffff, 0.75);
          overflow: hidden;

          &:not(:last-of-type) {
            margin-right: .vw(-4)[];
          }

          .avatar {
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

      .room-name {
        color: var(--white--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 500;
        font-style: normal;
        position: absolute;
        bottom: .vw(44)[];
        left: .vw(9)[];
      }

      .room-ball {
        display: flex;
        align-items: flex-end;
        position: absolute;
        bottom: .vw(11)[];
        left: .vw(9)[];

        .icon {
          width: .vw(23)[];
          height: .vw(24)[];
          margin-right: .vw(10)[];
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
    }
  }
}
</style>
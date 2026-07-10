<template>
  <main class="my">
    <div class="user">
      <div class="avatar">
        <template v-if="userInfo.avatar">
          <img :src="userInfo.avatar" alt="" />
        </template>
        <template v-else>
          <img src="@/assets/images/avatar.png" alt="" />
        </template>
      </div>
      <div class="info">
        <p class="name">{{ userInfo.nickName || userInfo.userName }}</p>
        <p class="id">ID:{{ userInfo.userId }}</p>
      </div>
      <div class="entry" @click="clickRouter('edit-user-info')"></div>
    </div>
    <div class="vip">
      <div class="info">
        <div class="level">
          <img src="@/assets/images/my/crown.png" alt="" class="icon" />
          <span class="text">当前会员等级为：{{ userLevelInfo.levelName }}</span>
        </div>
        <div class="progress">
          <p :style="{ width: `${userLevelInfo.totalRechargeAmount / userLevelInfo.needRechargeAmount}%` }"></p>
        </div>
        <div class="count">
          {{ userLevelInfo.totalRechargeAmount }}/{{ userLevelInfo.needRechargeAmount }}
        </div>
        <i class="vip-icon" :class="`level${userLevelInfo.levelValue}`"></i>
      </div>
    </div>
    <div class="order">
      <div class="info">
        <p class="title">我的订单</p>
        <p class="entry" @click="clickRouter('order')">查看全部订单</p>
      </div>
      <div class="status">
        <div class="item" @click="clickRouter('order', { type: 'pending' })">
          <i class="icon status1"></i>
          <p class="text">待付款</p>
        </div>
        <div class="item" @click="clickRouter('order', { type: 'shipment' })">
          <i class="icon status2"></i>
          <p class="text">待发货</p>
        </div>
        <div class="item" @click="clickRouter('order', { type: 'beReceived' })">
          <i class="icon status3"></i>
          <p class="text">待收货</p>
        </div>
        <div class="item" @click="clickRouter('order', { type: 'refunded' })">
          <i class="icon status4"></i>
          <p class="text">退款/售后</p>
        </div>
      </div>
    </div>
    <div class="service">
      <div class="info">
        <p class="title">我的服务</p>
      </div>
      <div class="status">
        <div class="item" @click="clickRouter('use-record')">
          <i class="icon service1"></i>
          <p class="text">使用记录</p>
        </div>
        <div class="item" @click="clickRouter('recharge-record')">
          <i class="icon service6"></i>
          <p class="text">充值记录</p>
        </div>
        <div class="item" @click="clickRouter('ball-record')">
          <i class="icon service3"></i>
          <p class="text">弹珠记录</p>
        </div>
        <div class="item" @click="clickRouter('point-card-record')">
          <i class="icon service7"></i>
          <p class="text">积分记录</p>
        </div>
      </div>
      <div class="status">
        <div class="item" @click="clickRouter('address')">
          <i class="icon service2"></i>
          <p class="text">地址管理</p>
        </div>
        <div class="item" @click="clickRouter('invitation')">
          <i class="icon service5"></i>
          <p class="text">邀请好友</p>
        </div>
        <div class="item" @click="clickRouter('feedback-record')">
          <i class="icon service4"></i>
          <p class="text">反馈记录</p>
        </div>
        <div class="item" @click="clickRouter('setting')">
          <i class="icon service5"></i>
          <p class="text">设置</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const userInfo = ref({})
const userLevelInfo = ref({})

onMounted(() => {
  init()
})

const init = async () => {
  $toast.loading()
  await getUserInfo()
  $toast.close()
}

const getUserInfo = async () => {
  const res = await api.post('/pinball/user/info/getUserInfo')
  if (res.code === 200) {
    userInfo.value = res.data
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    getLevelInfo(userInfo.value)
  }
}

// 查询用户等级详情
const getLevelInfo = async ({ userId, levelValue }) => {
  const res = await api.post('/pinball/level/user/getLevelInfo', { userId, levelValue })
  if (res.code === 200) {
    userLevelInfo.value = res.data
    localStorage.setItem('userLevelInfo', JSON.stringify(userLevelInfo.value))
  }
}

const clickRouter = (name, params = {}, query = {}) => {
  if (!name) {
    return
  }
  router.push({ name, params, query })
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.my {
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(@/assets/images/my/my-bg.png);
  background-color: #f6f6f6;
  padding-top: .vw(30) [];

  .user {
    display: flex;
    align-items: center;
    padding: 0 .vw(24) [];
    margin-bottom: .vw(28) [];

    .avatar {
      width: .vw(48) [];
      height: .vw(48) [];
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: .vw(48) [];
      border: .vw(2) [] solid var(--white--);
      box-shadow: 0 .vw(4) [] .vw(4) [] 0 rgba(0, 0, 0, 0.15);
      overflow: hidden;
      margin-right: .vw(12) [];

      img {
        width: 100%;
      }
    }

    .info {
      flex: 1;

      .name {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(18) [];
        line-height: .vw(18) [];
        font-weight: 600;
        font-style: normal;
        margin-bottom: .vw(8) [];
      }

      .id {
        color: var(--text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
      }
    }

    .entry {
      width: .vw(24) [];
      height: .vw(24) [];
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: .vw(45) [];
      background-color: var(--white--);
      box-shadow: 0 .vw(4) [] .vw(8) [] 0 rgba(126, 23, 237, 0.15);

      &::before {
        content: '';
        width: .vw(16) [];
        height: .vw(16) [];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/arrow-right.png);
      }
    }
  }

  .vip {
    border-radius: .vw(9) [];
    background: linear-gradient(90deg, #2d2f2f 0%, #535353 100%);
    margin: 0 .vw(16) [];
    margin-bottom: .vw(8) [];

    .info {
      position: relative;
      padding: .vw(9) [] .vw(16) [];

      .level {
        display: flex;
        align-items: center;
        margin-bottom: .vw(9) [];

        .icon {
          width: .vw(24) [];
          height: .vw(24) [];
          margin-right: .vw(9) [];
        }

        .text {
          color: var(--gold--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 400;
          font-style: normal;
        }
      }

      .progress {
        height: .vw(4) [];
        border-radius: .vw(9) [];
        background-color: #72747d;
        margin-bottom: .vw(9) [];

        p {
          height: 100%;
          border-radius: .vw(9) [];
          background-color: var(--gold--);
        }
      }

      .count {
        color: var(--gold--);
        font-family: 'PingFang SC';
        font-size: .vw(12) [];
        line-height: .vw(12) [];
        font-weight: 400;
        font-style: normal;
      }

      .vip-icon {
        width: .vw(58) [];
        height: .vw(47) [];
        position: absolute;
        top: .vw(-21) [];
        right: .vw(-8) [];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;

        &.level1 {
          background-image: url(@/assets/images/my/vip-icon1.png);
        }

        &.level2 {
          background-image: url(@/assets/images/my/vip-icon2.png);
        }

        &.level3 {
          background-image: url(@/assets/images/my/vip-icon3.png);
        }

        &.level4 {
          background-image: url(@/assets/images/my/vip-icon4.png);
        }

        &.level5 {
          background-image: url(@/assets/images/my/vip-icon5.png);
        }

        &.level6 {
          background-image: url(@/assets/images/my/vip-icon6.png);
        }
      }
    }
  }

  .order {
    border-radius: .vw(12) [];
    background-color: var(--white--);
    margin: 0 .vw(16) [];
    margin-bottom: .vw(8) [];
    padding: .vw(16) [] .vw(9) [];

    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: .vw(16) [];

      .title {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(16) [];
        line-height: .vw(16) [];
        font-weight: 500;
        font-style: normal;
      }

      .entry {
        color: var(--text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
        display: flex;
        align-items: center;

        &::after {
          content: '';
          width: .vw(16) [];
          height: .vw(16) [];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/arrow-right.png);
          margin-left: .vw(4) [];
        }
      }
    }

    .status {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item {
        display: flex;
        align-items: center;
        flex-direction: column;

        .icon {
          width: .vw(24) [];
          height: .vw(24) [];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          margin-bottom: .vw(11) [];

          &.status1 {
            background-image: url(@/assets/images/my/order1.png);
          }

          &.status2 {
            background-image: url(@/assets/images/my/order2.png);
          }

          &.status3 {
            background-image: url(@/assets/images/my/order3.png);
          }

          &.status4 {
            background-image: url(@/assets/images/my/order4.png);
          }
        }

        .text {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 200;
          font-style: normal;
        }
      }
    }
  }

  .service {
    border-radius: .vw(12) [];
    background-color: var(--white--);
    margin: 0 .vw(16) [];
    margin-bottom: .vw(8) [];
    padding: .vw(16) [] .vw(9) [];

    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: .vw(16) [];

      .title {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(16) [];
        line-height: .vw(16) [];
        font-weight: 500;
        font-style: normal;
      }

      .entry {
        color: var(--text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
        display: flex;
        align-items: center;

        &::after {
          content: '';
          width: .vw(16) [];
          height: .vw(16) [];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/arrow-right.png);
          margin-left: .vw(4) [];
        }
      }
    }

    .status {
      display: flex;
      align-items: center;

      &:not(:last-of-type) {
        margin-bottom: .vw(16) [];
      }

      .item {
        width: .vw(56) [];
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-right: .vw(33)[];

        &:last-of-type {
          margin-right: 0;
        }

        .icon {
          width: .vw(24) [];
          height: .vw(24) [];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          margin-bottom: .vw(11) [];

          &.service1 {
            background-image: url(@/assets/images/my/service1.png);
          }

          &.service2 {
            background-image: url(@/assets/images/my/service2.png);
          }

          &.service3 {
            background-image: url(@/assets/images/my/service3.png);
          }

          &.service4 {
            background-image: url(@/assets/images/my/service4.png);
          }

          &.service5 {
            background-image: url(@/assets/images/my/service5.png);
          }

          &.service6 {
            background-image: url(@/assets/images/my/service6.png);
          }

          &.service7 {
            background-image: url(@/assets/images/my/service7.png);
          }
        }

        .text {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 200;
          font-style: normal;
        }
      }
    }
  }
}
</style>

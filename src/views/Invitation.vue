<template>
  <main class="invitation">
    <Header title="邀请好友"></Header>
    <div class="body">
      <div class="rule" @click="showNewUser = true">规则</div>
      <div class="invitation-bg">
        <img src="@/assets/images/invitation/invitation-bg.png" alt="">
      </div>
      <div class="share">
        <div class="title">邀请好友</div>
        <div class="info">
          <div class="people">
            <div class="count">40</div>
            <div class="desc">已邀请人数</div>
          </div>
          <div class="price">
            <div class="count">
              ￥1,135.00
              <span class="withdrawal">提现</span>
            </div>
            <div class="desc">已奖励金额</div>
          </div>
        </div>
        <div class="button" @click="clickShare">分享海报</div>
      </div>
      <div class="invite-list" v-if="inviteList.length">
        <div class="title">我的邀请</div>
        <div class="invite-table">
          <div class="header-row">
            <div class="desc">好友</div>
            <div class="desc">充值金额</div>
            <div class="desc">邀请时间</div>
          </div>
          <div class="row" v-for="(item, index) in inviteList" :key="index">
            <div class="user">
              <div class="avatar">
                <img src="@/assets/images/avatar.png" alt="">
              </div>
              <div class="info">
                <p class="name">王天成</p>
                <p class="id">ID：156151</p>
              </div>
            </div>
            <div class="price">￥84,511</div>
            <div class="date">2025.01.22</div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div class="real-name-auth-dialog" v-if="showRealNameAuth">
    <div class="mask" @click="showRealNameAuth = false"></div>
    <div class="content">
      <p class="text">提示</p>
      <p class="desc">拉新好友需要实名认证喔~</p>
      <div class="confirm" @click="clickRealNameAuth">前去认证</div>
    </div>
  </div>

  <div class="new-user-dialog" v-if="showNewUser">
    <div class="content">
      <p class="text">拉新规则</p>
      <div class="desc">
        <p>一、活动时间</p>
        <p>即日起 —— 活动结束前（具体结束时间将通过小程序公告通知，逾期未参与/未兑换奖励视为自动放弃）</p>
        <p>二、参与对象 1. 邀请者：本小程序已注册并完成实名认证的用户（无违规记录）；</p>
        <p>2. 被邀请者：未注册过本小程序的新用户（同一手机号、同一设备、同一身份证号视为同一用户，不可重复参与）。</p>
        <p>三、拉新流程（超简单，3步搞定）</p>
        <p>1. 邀请者登录小程序，进入【我的】-【拉新有礼】页面，获取专属拉新二维码/邀请链接；</p>
        <p>2. 邀请者将二维码/链接分享给好友（微信好友、朋友圈均可），邀请好友注册；</p>
        <p>3. 被邀请者通过该二维码/链接，完成小程序注册+实名认证（若有），即视为拉新成功，双方即时解锁对应奖励。</p>
      </div>
    </div>
    <div class="confirm" @click="showNewUser = false">知道了</div>
  </div>

  <div class="share-qr-code-dialog" v-if="showShareQrCode">
    <div class="content">
      <img src="@/assets/images/invitation/share-text1.png" alt="" class="text1">
      <img src="@/assets/images/invitation/share-text2.png" alt="" class="text2">
      <div class="qr-code" v-if="shareQrCode">
        <img :src="shareQrCode" alt="">
      </div>
    </div>
    <div class="confirm">截图保存图片</div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { generateQRCode, getQRCodeDataURL } from '@/utils/qrcode'

const router = useRouter()

const inviteList = ref([
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
])
const showRealNameAuth = ref(false)
const showNewUser = ref(false)
const showShareQrCode = ref(false)
const shareQrCode = ref('')

onMounted(async () => {

})

const clickShare = () => {
  if (true) {
    showRealNameAuth.value = true
    return
  }
  // shareQrCode.value = await getQRCodeDataURL('https://docs.qq.com/doc/DYWZkeWdDQVNvaGhv', { margin: 3 })
  // showShareQrCode.value = true
}

const clickRealNameAuth = () => {
  showRealNameAuth.value = false
  router.push({ name: 'real-name-auth' })
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.invitation {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    background: linear-gradient(180deg, #FCE5DA 0%, #FCE0B9 100%);
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;

    .rule {
      width: .vw(40)[];
      height: .vw(104)[];
      color: var(--white--);
      font-family: "PingFang SC";
      font-size: .vw(18)[];
      line-height: .vw(32)[];
      font-weight: 500;
      font-style: normal;
      display: flex;
      align-items: center;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/invitation/rule-bg.png);
      position: absolute;
      top: .vw(122)[];
      right: 0;
      padding: 0 .vw(13)[];
    }

    .invitation-bg {
      width: 100%;

      img {
        width: 100%;
      }
    }

    .share {
      border-radius: .vw(30)[];
      border: .vw(1)[] solid var(--white--);
      background: linear-gradient(180deg, #FF6464 0%, #FFFAF0 100%);
      margin: 0 .vw(18)[] .vw(22)[];
      padding-bottom: .vw(55)[];

      .title {
        width: .vw(160)[];
        height: .vw(48)[];
        display: flex;
        align-items: center;
        justify-self: center;
        justify-content: center;
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(18)[];
        line-height: .vw(18)[];
        font-weight: 500;
        font-style: normal;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/invitation/title-bg.png);
        margin-bottom: .vw(34)[];
      }

      .info {
        display: flex;
        align-items: center;
        margin-bottom: .vw(34)[];

        .people {
          flex: 5;
        }

        .price {
          flex: 6;
        }

        .people,
        .price {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;

          .count {
            display: flex;
            align-items: center;
            color: var(--white--);
            font-family: "PingFang SC";
            font-size: .vw(24)[];
            line-height: .vw(24)[];
            font-weight: 500;
            font-style: normal;
            margin-bottom: .vw(18)[];

            .withdrawal {
              display: flex;
              align-items: center;
              color: var(--white--);
              font-family: "PingFang SC";
              font-size: .vw(10)[];
              line-height: .vw(14)[];
              font-weight: 400;
              font-style: normal;
              margin-left: .vw(8)[];

              &::after {
                content: '';
                width: .vw(14)[];
                height: .vw(14)[];
                background-size: 100%;
                background-position: center;
                background-repeat: no-repeat;
                background-image: url(@/assets/images/arrow-right-white.png);
                margin-left: .vw(4)[];
              }
            }
          }

          .desc {
            color: var(--white--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
          }
        }
      }

      .button {
        width: .vw(292)[];
        height: .vw(48)[];
        display: flex;
        align-items: center;
        justify-self: center;
        justify-content: center;
        color: var(--white--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 500;
        font-style: normal;
        border-radius: .vw(45)[];
        border: .vw(1)[] solid #FF3A64;
        background: linear-gradient(90deg, #FD689A 0%, #FFAB2D 100%);
      }
    }

    .invite-list {
      border-radius: .vw(30)[];
      border: .vw(1)[] solid var(--white--);
      background: linear-gradient(180deg, #FF6464 -43.18%, #FFFAF0 99.95%);
      margin: 0 .vw(18)[] .vw(22)[];
      padding-bottom: .vw(26)[];

      .title {
        width: .vw(160)[];
        height: .vw(48)[];
        display: flex;
        align-items: center;
        justify-self: center;
        justify-content: center;
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(18)[];
        line-height: .vw(18)[];
        font-weight: 500;
        font-style: normal;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/invitation/title-bg.png);
        margin-bottom: .vw(16)[];
      }

      .invite-table {
        margin-left: .vw(20)[];
        margin-right: .vw(18)[];

        .header-row {
          display: flex;
          align-items: center;

          .desc {
            color: var(--light-text--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;

            &:nth-of-type(1) {
              flex: 1;
            }

            &:nth-of-type(2) {
              width: .vw(65)[];
              margin-right: .vw(25)[];
            }

            &:nth-of-type(3) {
              width: .vw(75)[];
            }
          }
        }

        .row {
          display: flex;
          align-items: center;
          margin-top: .vw(16)[];

          .user {
            flex: 1;
            display: flex;
            align-items: center;

            .avatar {
              width: .vw(36)[];
              height: .vw(36)[];
              margin-right: .vw(10)[];

              img {
                width: 100%;
                height: 100%;
              }
            }

            .info {
              .name {
                color: var(--light-text--);
                font-family: "PingFang SC";
                font-size: .vw(14)[];
                line-height: .vw(14)[];
                font-weight: 500;
                font-style: normal;
                margin-bottom: .vw(5)[];
              }

              .id {
                color: var(--text--);
                font-family: "PingFang SC";
                font-size: .vw(12)[];
                line-height: .vw(12)[];
                font-weight: 400;
                font-style: normal;
              }
            }
          }

          .price {
            width: .vw(65)[];
            color: var(--light-text--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
            margin-right: .vw(25)[];
          }

          .date {
            width: .vw(75)[];
            color: var(--light-text--);
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

}

.real-name-auth-dialog {
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
    height: .vw(208)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/invitation/real-name-auth-bg.png);
    position: relative;
    z-index: 10002;
    padding: .vw(21)[] .vw(30)[];

    &::before {
      content: '';
      width: .vw(88)[];
      height: .vw(120)[];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/invitation/real-name-auth-icon.png);
      position: absolute;
      top: .vw(-25)[];
      right: .vw(21)[];
    }

    .text {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(30)[];
      line-height: .vw(30)[];
      letter-spacing: .vw(5)[];
      font-weight: 900;
      font-style: normal;
      margin-bottom: .vw(32)[];
    }

    .desc {
      color: #332A03;
      font-family: "PingFang SC";
      // font-family: "MF WenYan (Noncommercial)";
      font-size: .vw(20)[];
      line-height: .vw(24)[];
      font-weight: 500;
      font-style: normal;
      margin-bottom: .vw(32)[];
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

.new-user-dialog {
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
    width: .vw(358)[];
    height: .vw(553)[];
    display: flex;
    flex-direction: column;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/invitation/new-user-dialog-bg.png);
    position: relative;
    z-index: 10002;
    padding: .vw(32)[] .vw(19)[] .vw(16)[] .vw(19)[];
    margin-bottom: .vw(13)[];

    &::before {
      content: '';
      width: .vw(96)[];
      height: .vw(85)[];
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/invitation/new-user-dialog-icon.png);
      position: absolute;
      top: .vw(-7)[];
      right: .vw(14)[];
    }

    .text {
      color: var(--light-text--);
      font-family: "PingFang SC";
      font-size: .vw(30)[];
      line-height: .vw(30)[];
      letter-spacing: .vw(5)[];
      font-weight: 900;
      font-style: normal;
      margin-left: .vw(9)[];
      margin-bottom: .vw(17)[];
    }

    .desc {
      flex: 1;
      border-radius: .vw(24)[];
      border: .vw(2)[] solid var(--white--);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.75) 100%);
      overflow-x: hidden;
      overflow-y: auto;
      padding: .vw(16)[] .vw(20)[];

      p {
        color: #50525C;
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(22)[];
        font-weight: 500;
        font-style: normal;
      }
    }
  }

  .confirm {
    width: .vw(292)[];
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

.share-qr-code-dialog {
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
    width: .vw(358)[];
    height: .vw(553)[];
    display: flex;
    flex-direction: column;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/invitation/share-bg.png);
    border-radius: .vw(24)[];
    overflow: hidden;
    position: relative;
    z-index: 10002;
    padding: .vw(32)[] .vw(19)[] .vw(16)[] .vw(19)[];
    margin-bottom: .vw(13)[];

    .text1 {
      width: .vw(160)[];
      position: absolute;
      left: .vw(28)[];
      top: .vw(22)[];
    }

    .text2 {
      width: .vw(160)[];
      position: absolute;
      right: .vw(28)[];
      top: .vw(60)[];
    }

    .qr-code {
      width: .vw(120)[];
      height: .vw(120)[];
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: .vw(24)[];
      overflow: hidden;
      background-color: var(--white--);
      position: absolute;
      bottom: .vw(16)[];
      left: 50%;
      transform: translateX(-50%);

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .confirm {
    width: .vw(292)[];
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
</style>
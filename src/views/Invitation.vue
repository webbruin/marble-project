<template>
  <main class="invitation">
    <Header title="邀请好友"></Header>
    <div class="body">
      <div class="rule">规则</div>
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
        <div class="button">分享海报</div>
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
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

onMounted(() => {

})
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
              margin-right: .vw(30)[];
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
            margin-right: .vw(30)[];
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
</style>
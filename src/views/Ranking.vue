<template>
  <div class="ranking">
    <Header title="排行榜"></Header>
    <div class="top">
      <div class="tabbar">
        <i class="selected" :style="{ 'transform': `translateX(calc(86 / 375 * 100vw * ${tabType - 1}))` }"></i>
        <div class="item" v-for="(item, index) in tabList" :key="index" @click="clickTab(item.type)">
          {{ item.name }}
        </div>
      </div>
      <div class="rank-level">
        <div class="user" v-if="rankList.length">
          <div class="item second">
            <div class="avatar">
              <img src="@/assets/images/avatar.png" alt="">
            </div>
            <p class="name">{{ rankList[1].nickName }}</p>
            <p class="point">
              <i class="icon"></i>
              <span class="text">X{{ rankList[1].totalAmount }}</span>
            </p>
          </div>
          <div class="item first">
            <div class="avatar">
              <img src="@/assets/images/avatar.png" alt="">
            </div>
            <p class="name">{{ rankList[0].nickName }}</p>
            <p class="point">
              <i class="icon"></i>
              <span class="text">X{{ rankList[0].totalAmount }}</span>
            </p>
          </div>
          <div class="item third">
            <div class="avatar">
              <img src="@/assets/images/avatar.png" alt="">
            </div>
            <p class="name">{{ rankList[2].nickName }}</p>
            <p class="point">
              <i class="icon"></i>
              <span class="text">X{{ rankList[2].totalAmount }}</span>
            </p>
          </div>
        </div>
        <div class="level-bg">
          <img src="@/assets/images/rank/ranking-level.png" alt="">
        </div>
      </div>
    </div>
    <div class="list">
      <div class="user" v-for="(item, index) in rankList.slice(3)" :key="index">
        <div class="index">{{ (index + 3) >= 10 ? (index + 3) : `0${index + 3}` }}</div>
        <div class="avatar">
          <img src="@/assets/images/avatar.png" alt="">
        </div>
        <div class="name">{{ item.nickName }}</div>
        <div class="point">
          <i class="icon"></i>
          <span class="text">X{{ item.totalAmount }}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="user">
        <div class="index">未上榜</div>
        <div class="avatar">
          <img src="@/assets/images/avatar.png" alt="">
        </div>
        <div class="name">艾斯君</div>
        <div class="point">
          <i class="icon"></i>
          <span class="text">X823</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import Header from '@/components/Header.vue'

const tabList = ref([
  { name: '日榜', type: 1 },
  { name: '周榜', type: 2 },
  { name: '月榜', type: 3 },
])
const tabType = ref(1)
const rankList = ref([])

onMounted(() => {
  getRankList()
})

const clickTab = (index) => {
  tabType.value = index
  getRankList()
}

const getRankList = async () => {
  $toast.loading()
  const res = await api.post('/ranking/pointCard', tabType.value)
  if (res.code === 200) {
    $toast.close()
    rankList.value = res.data
  } else {
    $toast.info(res.message)
  }
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.ranking {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F6F6F6;
  position: relative;

  .header {
    width: 100%;
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    background-color: transparent;
  }

  .top {
    height: .vw(334)[];
    display: flex;
    justify-content: center;
    position: relative;
    margin-bottom: .vw(16)[];

    &::before {
      content: '';
      width: 100%;
      height: 100%;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(@/assets/images/rank/rank-bg.png);
      filter: blur(.vw(4)[]);
      position: absolute;
    }

    .tabbar {
      position: absolute;
      top: .vw(54)[];
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: .vw(45)[];
      background-color: #EDEDF0;
      border-top: .vw(3)[] solid #EDEDF0;
      border-bottom: .vw(3)[] solid #EDEDF0;
      border-left: .vw(4)[] solid #EDEDF0;
      border-right: .vw(4)[] solid #EDEDF0;

      .selected {
        width: .vw(78)[];
        height: .vw(30)[];
        border-radius: .vw(45)[];
        background-color: var(--white--);
        position: absolute;
        left: 0;
        transition: transform .2s;
      }

      .item {
        width: .vw(78)[];
        height: .vw(30)[];
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 500;
        font-style: normal;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;

        &:not(:last-of-type) {
          margin-right: .vw(8)[];
        }
      }
    }

    .rank-level {
      display: flex;
      align-items: center;
      flex-direction: column;
      position: absolute;
      bottom: .vw(10)[];

      .user {
        width: 105%;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .item {
          display: flex;
          align-items: center;
          flex-direction: column;
          position: relative;

          .avatar {
            width: .vw(48)[];
            height: .vw(48)[];
            border-radius: .vw(48)[];
            border: .vw(2)[] solid #FFF;
            box-shadow: 0 .vw(4)[] .vw(4)[] 0 rgba(0, 0, 0, 0.15);
            margin-bottom: .vw(8)[];

            img {
              width: 100%;
              height: 100%;
            }
          }

          .name {
            color: var(--light-text--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
            margin-bottom: .vw(5)[];
          }

          .point {
            display: flex;
            align-items: center;

            .icon {
              width: .vw(24)[];
              height: .vw(24)[];
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url(@/assets/images/point.png);
            }

            .text {
              color: #643C0A;
              font-family: "PingFang SC";
              font-size: .vw(14)[];
              line-height: .vw(14)[];
              font-weight: 500;
              font-style: normal;
            }
          }

          &.first {
            .avatar::after {
              content: '';
              width: .vw(36)[];
              height: .vw(30)[];
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url(@/assets/images/rank/rank-icon1.png);
              position: absolute;
              top: .vw(-18)[];
              right: .vw(-6)[];
            }
          }

          &.second {
            bottom: .vw(-15)[];

            .avatar::after {
              content: '';
              width: .vw(36)[];
              height: .vw(30)[];
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url(@/assets/images/rank/rank-icon2.png);
              position: absolute;
              top: .vw(-18)[];
              right: .vw(-6)[];
            }
          }

          &.third {
            bottom: .vw(-30)[];

            .avatar::after {
              content: '';
              width: .vw(27)[];
              height: .vw(23)[];
              background-size: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url(@/assets/images/rank/rank-icon3.png);
              position: absolute;
              top: .vw(-11)[];
              right: .vw(-6)[];
            }
          }
        }
      }

      .level-bg {
        width: .vw(294)[];

        img {
          width: 100%;
        }
      }
    }
  }

  .list {
    flex: 1;
    overflow: auto;
    padding: 0 .vw(18)[];

    .user {
      display: flex;
      align-items: center;
      border-radius: .vw(12)[];
      background-color: var(--white--);
      padding: .vw(12)[] .vw(16)[];
      margin-bottom: .vw(8)[];

      .index {
        min-width: .vw(20)[];
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 500;
        font-style: normal;
        margin-right: .vw(8)[];
      }

      .avatar {
        width: .vw(30)[];
        height: .vw(30)[];
        margin-right: .vw(8)[];

        img {
          width: 100%;
          height: 100%;
        }
      }

      .name {
        flex: 1;
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 200;
        font-style: normal;
        margin-right: .vw(8)[];
      }

      .point {
        display: flex;
        align-items: center;

        .icon {
          width: .vw(24)[];
          height: .vw(24)[];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/point.png);
        }

        .text {
          color: #643C0A;
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 500;
          font-style: normal;
        }
      }
    }
  }

  .footer {
    padding: 0 .vw(18)[];
    margin-bottom: .vw(8)[];

    .user {
      display: flex;
      align-items: center;
      border-radius: .vw(12)[];
      background: linear-gradient(153deg, #EB8C67 5.44%, #F5C8B0 80.37%);
      padding: .vw(12)[] .vw(16)[];

      .index {
        min-width: .vw(20)[];
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 500;
        font-style: normal;
        margin-right: .vw(8)[];
      }

      .avatar {
        width: .vw(30)[];
        height: .vw(30)[];
        margin-right: .vw(8)[];

        img {
          width: 100%;
          height: 100%;
        }
      }

      .name {
        flex: 1;
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 200;
        font-style: normal;
        margin-right: .vw(8)[];
      }

      .point {
        display: flex;
        align-items: center;

        .icon {
          width: .vw(24)[];
          height: .vw(24)[];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/point.png);
        }

        .text {
          color: #643C0A;
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
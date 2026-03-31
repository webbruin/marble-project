<template>
  <main class="cart">
    <Header :show-back="false" title="背包">
      <template #right>
        <span class="address-edit">地址管理</span>
      </template>
    </Header>
    <div class="body">
      <div class="tag">
        <div class="all-count">购物车总共15件</div>
        <div class="trash-cart">
          <i class="icon"></i>
          <span class="text">清空购物车</span>
        </div>
      </div>
      <div class="cart-list">
        <template v-for="(item, index) in cartList" :key="index">
          <div class="item">
            <div class="check">
              <i class="select" :class="{ 'selected': item.selected }"></i>
            </div>
            <div class="module">
              <div class="cover">
                <img src="@/assets/images/shop/cover.png" alt="">
              </div>
              <div class="info">
                <p class="name">​​反骨糯米糍​​</p>
                <p class="desc">规格：500克</p>
                <p class="point">积分 554.00</p>
              </div>
            </div>
            <div class="option">
              <i class="sub" :class="{ 'disabled': false }"></i>
              <span class="count">1</span>
              <i class="plus" :class="{ 'disabled': false }"></i>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="footer">
      <div class="select-all">
        <i class="icon"></i>
        <span class="text">全选</span>
      </div>
      <div class="point">
        <p class="text">合计积分</p>
        <p class="count">5,213.00</p>
      </div>
      <div class="checkout">
        <span class="text">去结算（3）</span>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const cartList = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}])

onMounted(() => {

})

</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.cart {
  display: flex;
  flex-direction: column;

  .address-edit {
    color: var(--text--);
    font-family: "PingFang SC";
    font-size: .vw(14)[];
    line-height: .vw(14)[];
    font-weight: 400;
    font-style: normal;
  }

  .body {
    flex: 1;
    padding: .vw(12)[] .vw(16)[];
    overflow-x: hidden;
    overflow-y: auto;

    .tag {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: .vw(8)[];

      .all-count {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 400;
      }

      .trash-cart {
        display: flex;
        align-items: center;

        .icon {
          width: .vw(14)[];
          height: .vw(14)[];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/shop/trash.png);
          margin-right: .vw(8)[];
        }

        .text {
          color: var(--light-text--);
          font-family: "PingFang SC";
          font-size: .vw(14)[];
          line-height: .vw(14)[];
          font-weight: 400;
          font-style: normal;
        }
      }
    }

    .cart-list {
      .item {
        display: flex;
        padding: .vw(16)[];

        .check {
          height: 100%;
          display: flex;
          align-self: center;
          align-items: center;
          margin-right: .vw(8)[];

          .select {
            width: .vw(24)[];
            height: .vw(24)[];
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(@/assets/images/shop/select.png);

            &.selected {
              background-image: url(@/assets/images/shop/selected.png);
            }
          }
        }

        .module {
          flex: 1;
          display: flex;

          .cover {
            width: .vw(56)[];
            height: .vw(56)[];
            margin-right: .vw(8)[];

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
              margin-bottom: .vw(4)[];
            }

            .desc {
              color: var(--text--);
              font-family: "PingFang SC";
              font-size: .vw(12)[];
              line-height: .vw(12)[];
              font-weight: 400;
              font-style: normal;
              margin-bottom: .vw(6)[];
            }

            .point {
              color: var(--orange--);
              font-family: "PingFang SC";
              font-size: .vw(14)[];
              line-height: .vw(14)[];
              font-weight: 500;
              font-style: normal;
            }
          }
        }

        .option {
          display: flex;
          align-items: center;
          align-self: flex-end;
          border: .vw(1.5)[] solid #EDEDF0;
          border-radius: .vw(3)[];

          i,
          span {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          i {
            width: .vw(18)[];
            height: .vw(18)[];
            background-size: 70%;
            background-position: center;
            background-repeat: no-repeat;

            &.disabled {
              opacity: .5;
              pointer-events: none;
            }
          }

          .sub {
            background-image: url(@/assets/images/sub.png);
          }

          .plus {
            background-image: url(@/assets/images/plus.png);
          }

          .count {
            min-width: .vw(30)[];
            height: .vw(18)[];
            color: var(--light-text--);
            font-family: "PingFang SC";
            font-size: .vw(14)[];
            line-height: .vw(14)[];
            font-weight: 500;
            font-style: normal;
            border-left: .vw(1.5)[] solid #EDEDF0;
            border-right: .vw(1.5)[] solid #EDEDF0;
          }
        }
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: .vw(1)[] solid #EDEDF0;
    padding: .vw(8)[] .vw(16)[];

    .select-all {
      display: flex;
      align-items: center;

      .icon {
        width: .vw(24)[];
        height: .vw(24)[];
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url(@/assets/images/shop/select.png);
        margin-right: .vw(8)[];

        &.selected {
          background-image: url(@/assets/images/shop/selected.png);

        }
      }

      .text {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 500;
        font-style: normal;
      }
    }

    .point {
      margin-left: .vw(50)[];

      .text {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(12)[];
        line-height: .vw(12)[];
        font-weight: 400;
        font-style: normal;
        margin-bottom: .vw(4)[];
      }

      .count {
        color: var(--orange--);
        font-family: "PingFang SC";
        font-size: .vw(18)[];
        line-height: .vw(18)[];
        font-weight: 500;
        font-style: normal;
      }
    }

    .checkout {
      border-radius: .vw(45)[];
      background: var(--Warning-Warning4-Hover, #FFB169);
      padding: .vw(12)[] .vw(24)[];

      .span {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 500;
        font-style: normal;
      }
    }
  }
}
</style>
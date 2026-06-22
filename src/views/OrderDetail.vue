<template>
  <main class="order-detail">
    <Header :title="getOrderStatusName(title)"></Header>
    <div class="body">
      <!-- 待支付 -->
      <div class="pay" v-if="orderData.orderStatus === 0">
        <div class="point">
          <span class="text">积分</span>
          <span class="count">{{ formatNumberWithCommas(formatToTwoDecimals(orderData.totalAmount)) }}</span>
        </div>
        <div class="countdown">
          请在<span>29分59秒</span>内支付，过时将被取消
        </div>
        <div class="buttons">
          <div class="cancel">取消订单</div>
          <div class="continue">继续支付</div>
        </div>
      </div>
      <!-- 地址 -->
      <div class="address">
        <div class="title">
          <span class="text">请选择地址</span>
          <i class="arrow"></i>
        </div>
        <div class="info">地址：{{ orderData.recipientAddress }}</div>
      </div>
      <!-- 配送时间及商品信息 -->
      <div class="sku">
        <div class="title">
          <span class="text">{{ orderData.orderStatus <= 1 ? '配送时间' : '送达时间' }}</span>
              <span class="date">(预计3月21日 11:21送达)</span>
        </div>
        <div class="info" v-if="orderData.items.length">
          <div class="cover-list">
            <div class="cover" v-for="(item, index) in orderData.items" :key="index">
              <img :src="item.productImage" alt="">
              <span class="num">X{{ item.quantity }}</span>
            </div>
          </div>
          <div class="count">共8件</div>
        </div>
      </div>
      <!-- 积分 -->
      <div class="total-point">
        <div class="text">合计积分</div>
        <div class="count">{{ formatNumberWithCommas(formatToTwoDecimals(5513)) }}</div>
      </div>
      <!-- 退货审批 -->
      <div class="return-audit" v-if="orderData.orderStatus >= 4">
        <div class="title">退货审批</div>
        <div class="progress">
          <div class="point" :class="{ 'light': true }">提交申请</div>
          <div class="point" :class="{ 'light': false }">审核通过</div>
          <div class="point" :class="{ 'light': false }">退款成功</div>
          <div class="bar">
            <div class="percentage" :style="{ 'width': '0%' }"></div>
          </div>
        </div>
      </div>
      <!-- 退款信息 -->
      <div class="return-info">
        <div class="title">退款信息</div>
        <div class="product-list">
          <div class="product" v-for="(item, index) in 2" :key="index">
            <div class="cover">
              <img src="" alt="">
            </div>
            <div class="info">
              <span class="spu-name">​​反骨糯米糍​​</span>
              <span class="text">规格：500克 月销23件</span>
              <span class="text">单价：积分21.00</span>
              <span class="text">数量：1</span>
            </div>
            <div class="point">积分{{ formatNumberWithCommas(formatToTwoDecimals(581)) }}</div>
          </div>
        </div>
        <div class="total">
          <span class="text">合计积分</span>
          <span class="point">{{ formatNumberWithCommas(formatToTwoDecimals(5253.6)) }}</span>
        </div>
      </div>
      <!-- 其他信息 -->
      <div class="other-info">
        <div class="row">
          <span class="key">退货原因</span>
          <span class="value bold">商品有破损</span>
        </div>
        <div class="row">
          <span class="key">下单编号</span>
          <span class="value">{{ orderData.orderId }}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="button1">删除订单</div>
      <div class="button2">再来一单</div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatNumberWithCommas, formatToTwoDecimals, getOrderStatusName } from '@/utils'

const route = useRoute()
const router = useRouter()

const orderId = route.params.orderId
const title = route.query.orderStatus

const orderData = ref({})

onMounted(() => {
  init()
})

const init = async () => {
  $toast.loading()
  await getOrderDetail()
  $toast.close()
}

const getOrderDetail = async () => {
  try {
    const res = await api.post('/pinball/shop/order/detail', { orderId })
    if (res.code === 200) {
      console.log(111, res.data);
      orderData.value = res.data
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.order-detail {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #f8f8f8;
    padding: .vw(8) [] .vw(18) [];

    >div {
      &:not(:last-of-type) {
        margin-bottom: .vw(8)[];
      }
    }

    .pay {
      display: flex;
      align-items: center;
      flex-direction: column;
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .point {
        padding: .vw(8)[] 0;
        margin-bottom: .vw(6)[];

        .text {
          color: #50525C;
          font-family: 'PingFang SC';
          font-size: .vw(16) [];
          line-height: .vw(24) [];
          font-weight: 500;
          font-style: normal;
        }

        .count {
          color: #FF7716;
          font-family: 'PingFang SC';
          font-size: .vw(24) [];
          line-height: .vw(24) [];
          font-weight: 500;
          font-style: normal;
        }
      }

      .countdown {
        color: var(--text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
        padding: .vw(8)[] 0;
        margin-bottom: .vw(6)[];

        span {
          color: #FF7716;
        }
      }

      .buttons {
        display: flex;
        align-items: center;

        div {
          width: .vw(145)[];
          height: .vw(48)[];
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(16) [];
          line-height: .vw(16) [];
          font-style: normal;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: .vw(45)[];

          &:not(:last-of-type) {
            margin-right: .vw(16)[];
          }
        }

        .cancel {
          font-weight: 400;
          border: 1px solid #EDEDF0;
          background-color: #fff;
        }

        .continue {
          font-weight: 500;
          border: 1px solid transparent;
          background-color: #FFB169;
        }
      }
    }

    .address {
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .vw(8)[] 0;

        .text {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(16) [];
          line-height: .vw(16) [];
          font-weight: 500;
          font-style: normal;
        }

        .arrow {
          width: .vw(14) [];
          height: .vw(14) [];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/arrow-right.png);
        }
      }

      .info {
        color: var(--text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
        padding: .vw(8)[] 0;
      }
    }

    .sku {
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: .vw(8)[];

        .text {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 400;
          font-style: normal;
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

      .info {
        display: flex;
        align-items: center;

        .cover-list {
          flex: 1;
          display: flex;
          align-items: center;
          overflow-x: auto;
          overflow-y: hidden;

          .cover {
            min-width: .vw(56)[];
            width: .vw(56) [];
            height: .vw(56) [];
            position: relative;

            img {
              max-width: 100%;
              max-height: 100%;
              border-radius: .vw(6)[];
            }

            .num {
              color: #FF7716;
              font-family: 'PingFang SC';
              font-size: .vw(7) [];
              line-height: .vw(7) [];
              font-weight: 400;
              font-style: normal;
              border-radius: .vw(45)[];
              border: .vw(1)[] solid #fff;
              background-color: #FFE3E3;
              padding: .vw(1)[] .vw(3)[];
              position: absolute;
              left: .vw(8)[];
              bottom: .vw(4)[];
            }
          }
        }

        .count {
          width: .vw(35) [];
          height: .vw(56) [];
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(7) [];
          line-height: .vw(7) [];
          font-weight: 400;
          font-style: normal;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: .vw(-8)[] 0 .vw(8)[] .vw(-4)[] rgba(0, 0, 0, 0.15);
        }
      }
    }

    .total-point {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .text {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 500;
        font-style: normal;
      }

      .count {
        color: #FF7716;
        font-family: 'PingFang SC';
        font-size: .vw(24) [];
        line-height: .vw(24) [];
        font-weight: 500;
        font-style: normal;
      }
    }

    .return-audit {
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .title {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 500;
        font-style: normal;
        margin-bottom: .vw(8)[];
      }

      .progress {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;

        .point {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(12) [];
          line-height: .vw(17) [];
          font-weight: 500;
          font-style: normal;
          display: flex;
          align-items: center;
          flex-direction: column;

          &::before {
            content: '';
            width: .vw(18)[];
            height: .vw(18)[];
            border-radius: 50%;
            background-color: #E3E3E4;
            margin-bottom: .vw(4)[];
            z-index: 2;
          }

          &.light {
            color: var(--light-text--);

            &::before {
              background-color: #FF7716;
            }
          }
        }

        .bar {
          width: 86%;
          height: .vw(4)[];
          border-radius: .vw(45)[];
          background-color: #E3E3E4;
          overflow: hidden;
          position: absolute;
          left: .vw(23)[];
          top: .vw(8)[];

          .percentage {
            width: 0%;
            height: 100%;
            border-radius: .vw(45)[];
            background-color: #FF7716;
          }
        }
      }
    }

    .return-info {
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[] 0;

      .title {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 500;
        font-style: normal;
        margin-bottom: .vw(8)[];
      }

      .product-list {
        .product {
          display: flex;
          padding: .vw(8)[];
          margin-bottom: .vw(8)[];

          &:not(:last-of-type) {
            border-bottom: 1px solid #E3E3E4;
          }

          .cover {
            min-width: .vw(64)[];
            width: .vw(64) [];
            height: .vw(64) [];
            margin-right: .vw(4)[];

            img {
              max-width: 100%;
              max-height: 100%;
              border-radius: .vw(6)[];
            }
          }

          .info {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-right: .vw(4)[];

            span {
              &:not(:last-of-type) {
                margin-bottom: .vw(4)[];
              }
            }

            .spu-name {
              color: var(--light-text--);
              font-family: 'PingFang SC';
              font-size: .vw(14) [];
              line-height: .vw(14) [];
              font-weight: 500;
              font-style: normal;
            }

            .text {
              color: var(--text--);
              font-family: 'PingFang SC';
              font-size: .vw(12) [];
              line-height: .vw(12) [];
              font-weight: 400;
              font-style: normal;
            }
          }

          .point {
            color: var(--light-text--);
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
            font-weight: 500;
            font-style: normal;
          }
        }
      }

      .total {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 .vw(8)[];

        .text {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 500;
          font-style: normal;
        }

        .point {
          color: var(--light-text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 500;
          font-style: normal;
        }
      }
    }

    .other-info {
      border-radius: .vw(9)[];
      background-color: #fff;
      padding: .vw(8)[];

      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .vw(12)[] 0;

        &:not(:last-of-type) {
          margin-bottom: .vw(8)[];
        }

        .key {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(12) [];
          line-height: .vw(12) [];
          font-weight: 400;
          font-style: normal;
        }

        .value {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(12) [];
          line-height: .vw(12) [];
          font-weight: 400;
          font-style: normal;

          &.bold {
            color: var(--light-text--);
            font-family: 'PingFang SC';
            font-size: .vw(14) [];
            line-height: .vw(14) [];
            font-weight: 500;
            font-style: normal;
          }
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: .vw(72) [];
    display: flex;
    align-items: center;
    padding: 0 .vw(8)[];

    div {
      flex: 1;
      height: .vw(48)[];
      color: var(--light-text--);
      font-family: 'PingFang SC';
      font-size: .vw(16) [];
      line-height: .vw(16) [];
      font-style: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: .vw(45)[];
      margin: 0 .vw(8)[];
    }

    .button1 {
      font-weight: 400;
      border: 1px solid #EDEDF0;
      background-color: #fff;
    }

    .button2 {
      font-weight: 500;
      border: 1px solid transparent;
      background-color: #FFB169;
    }
  }
}
</style>

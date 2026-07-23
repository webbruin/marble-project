<template>
  <div class="guide">
    <div class="arrow"></div>
    <div class="desc">
      <p>1.点击右上角...</p>
      <p>2.选择任意“浏览器”打开</p>
    </div>
    <div class="phone"></div>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.guide {
  min-height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  background-color: rgba(#fff, 1);
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: .vw(92)[];

  .arrow {
    width: .vw(108)[];
    height: .vw(74)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/guide/arrow.png);
    position: absolute;
    top: .vw(34)[];
    right: .vw(31)[];
    z-index: 1;
  }

  .desc {
    margin-bottom: .vw(44)[];

    p {
      color: #50525C;
      font-family: 'PingFang SC';
      font-size: .vw(20) [];
      line-height: .vw(20) [];
      font-weight: 500;
      font-style: normal;

      &:not(:last-child) {
        margin-bottom: .vw(23)[];
      }
    }
  }

  .phone {
    width: .vw(270)[];
    height: .vw(519)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(@/assets/images/guide/phone.png);
    margin-left: .vw(12)[];
  }
}
</style>

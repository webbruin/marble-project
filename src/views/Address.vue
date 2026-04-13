<template>
  <main class="address">
    <Header title="收货地址"></Header>
    <div class="body">
      <div class="item" v-for="(item, index) in addressList" :key="index">
        <div class="user">
          <span class="text">王志华</span>
          <span class="text">18595716778</span>
        </div>
        <div class="info">北京市 朝阳区 凤凰汇6栋1584市</div>
        <div class="options">
          <div class="default">
            <i class="select" :class="{ 'selected': index === 0 }"></i>
            <span class="text">默认地址</span>
          </div>
          <div class="button-list">
            <div class="button" @click="clickEditAddress('edit')">
              <img src="@/assets/images/address/edit.png" alt="" class="icon">
              <span class="text">编辑</span>
            </div>
            <div class="button" @click="clickRemoveAddress(item)">
              <img src="@/assets/images/address/remove.png" alt="" class="icon">
              <span class="text">删除</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="new-address">
      <Button buttonText="新增收货地址" @click="clickEditAddress('new')"></Button>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/FormData/Button.vue'

const route = useRoute()
const router = useRouter()

const addressList = ref([
  {},
  {},
])

onMounted(() => {

})

const clickEditAddress = (type) => {
  router.push({ name: 'edit-address', params: { type } })
}

const clickRemoveAddress = (item) => {
  $modal.show({
    content: '确认删除该地址吗？',
    onConfirm: () => {
      console.log(111, item);
    }
  })
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.address {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F5F6FA;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: .vw(8)[] .vw(18)[] .vw(80)[];

    .item {
      border-radius: .vw(8)[];
      background-color: var(--white--);
      padding: .vw(16)[];

      &:not(:last-of-type) {
        margin-bottom: .vw(8)[];
      }

      .user {
        display: flex;
        align-items: center;
        margin-bottom: .vw(16)[];

        .text {
          color: var(--light-text--);
          font-family: "PingFang SC";
          font-size: .vw(16)[];
          line-height: .vw(16)[];
          font-weight: 500;
          font-style: normal;

          &:not(:last-of-type) {
            margin-right: .vw(15)[];
          }
        }
      }

      .info {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 500;
        font-style: normal;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-bottom: .vw(16)[];
      }

      .options {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .default {
          display: flex;
          align-items: center;

          .select {
            width: .vw(16)[];
            height: .vw(16)[];
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(@/assets/images/address/select.png);
            margin-right: .vw(8)[];

            &.selected {
              background-size: 110%;
              background-image: url(@/assets/images/address/selected.png);
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

        .button-list {
          display: flex;
          align-items: center;

          .button {
            display: flex;
            align-items: center;

            &:not(:last-of-type) {
              margin-right: .vw(16)[];
            }

            .icon {
              width: .vw(16)[];
              height: .vw(16)[];
              margin-right: .vw(8)[];
            }

            .text {
              color: var(--text--);
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

  .new-address {
    position: fixed;
    left: .vw(18)[];
    right: .vw(18)[];
    bottom: .vw(18)[];
  }
}
</style>
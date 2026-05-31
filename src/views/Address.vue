<template>
  <main class="address">
    <Header title="收货地址"></Header>
    <div class="body">
      <template v-if="addressList.length">
        <div class="item" v-for="(item, index) in addressList" :key="index" @click="clickAddress(item)">
          <div class="user">
            <span class="text">{{ item.recipientName }}</span>
            <span class="text">{{ item.recipientPhone }}</span>
          </div>
          <div class="info">
            {{ item.province }} {{ item.city }} {{ item.district }} {{ item.detailAddress }}
          </div>
          <div class="options">
            <div class="default">
              <i class="select" :class="{ 'selected': item.isDefault === 1 }"></i>
              <span class="text">默认地址</span>
            </div>
            <div class="button-list">
              <div class="button" @click="clickEditAddress(item)">
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
      </template>
      <div class="empty" v-else>
        <img src="@/assets/images/empty.png" alt="" class="icon">
        <p class="text">暂无地址</p>
      </div>
    </div>
    <div class="new-address">
      <Button buttonText="新增收货地址" @click="clickNewAddress()"></Button>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/FormData/Button.vue'

const route = useRoute()
const router = useRouter()

const addressList = ref([])

onMounted(() => {
  init()
})

const init = async () => {
  $toast.loading()
  await getAddressList()
  $toast.close()
}

const getAddressList = async () => {
  try {
    const res = await api.post('/shop/address/list', {})
    if (res.code === 200) {
      addressList.value = res.data
    } else {
      $toast.info(res.message)
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const deleteAddress = async (addressId) => {
  try {
    const res = await api.post('/shop/address/delete', { addressId })
    if (res.code === 200) {
      $toast.info('地址删除成功')
      addressList.value = addressList.value.filter(item => item.addressId != addressId)
    } else {
      $toast.info(res.message)
    }
  } catch (e) {
    $toast.info('系统错误')
  }
}

const clickAddress = (item) => {
  if (route.params.type === 'select') {
    localStorage.setItem('selectAddress', JSON.stringify(item))
    router.back()
  }
}

const clickNewAddress = () => {
  router.push({ name: 'edit-address', params: { type: 'new' } })
}

const clickEditAddress = (item) => {
  router.push({ name: 'edit-address', params: { type: 'edit' }, query: { addressId: item.addressId } })
  localStorage.setItem('select-edit-address', JSON.stringify(item))
}

const clickRemoveAddress = ({ addressId }) => {
  $modal.show({
    content: '确认删除该地址吗？',
    onConfirm: () => {
      deleteAddress(addressId)
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

    .empty {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      color: var(--text--);
      font-family: "PingFang SC";
      font-size: .vw(16)[];
      line-height: .vw(16)[];
      font-weight: 500;
      font-style: normal;
      margin-top: .vw(50)[];
      margin-bottom: .vw(50)[];

      .icon {
        width: .vw(132)[];
        height: .vw(132)[];
        margin-bottom: .vw(11)[];
      }

      .text {
        color: var(--text--);
        font-family: "PingFang SC";
        font-size: .vw(12)[];
        line-height: .vw(12)[];
        font-weight: 400;
        font-style: normal;
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
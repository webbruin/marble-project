<template>
  <main class="address">
    <Header :title="`${route.params.type === 'edit' ? '编辑' : '新增'}收货地址`"></Header>
    <div class="body">
      <div class="item">
        <Input v-model="formdata.name" type="text" placeholder="请填写收货人姓名">
          <template #left>
            <span class="text">收货人</span>
          </template>
        </Input>
      </div>
      <div class="item">
        <Input v-model="formdata.mobile" type="number" placeholder="请填写收货人手机号">
          <template #left>
            <span class="text">手机号</span>
          </template>
        </Input>
      </div>
      <div class="item">
        <Input v-model="formdata.area" :readonly="true" type="text" placeholder="请选择省市区" @click="areaVisible(true)">
          <template #left>
            <span class="text">省市区</span>
          </template>
        </Input>
      </div>
      <div class="item">
        <Input v-model="formdata.address" type="text" placeholder="请填写详细地址">
          <template #left>
            <span class="text">详细地址</span>
          </template>
        </Input>
      </div>
      <div class="item">
        <div class="default-address">
          <span class="text">设为默认地址</span>
          <i class="switch" :class="{ 'off': formdata.default }" @click="formdata.default = !formdata.default"></i>
        </div>
      </div>
    </div>
    <div class="edit-address">
      <Button buttonText="保存地址" @click="clickSaveAddress"></Button>
    </div>
  </main>

  <van-popup v-model:show="showAreaPicker" round position="bottom">
    <van-cascader title="请选择所在地区" active-color="#FFB169" :value="cascaderValue" :options="options"
      @close="areaVisible(false)" @finish="areaChange" />
  </van-popup>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Input from '@/components/FormData/Input.vue'
import Button from '@/components/FormData/Button.vue'
import { useCascaderAreaData } from '@vant/area-data';

const route = useRoute()
const router = useRouter()

const formdata = ref({
  name: '',
  mobile: '',
  area: '',
  address: '',
  default: false,
})
const showAreaPicker = ref(false)
const options = useCascaderAreaData();

onMounted(() => {

})

const areaVisible = (event) => {
  showAreaPicker.value = event
}

const areaChange = (event) => {
  areaVisible(false)
  const { selectedOptions } = event
  formdata.value.area = selectedOptions.map(item => item.text).join('/')
}

const clickSaveAddress = () => {
  console.log(222, formdata.value);
  // router.back()
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
    padding: .vw(20)[] .vw(18)[];

    .item {
      &:not(:last-of-type) {
        margin-bottom: .vw(20)[];
      }

      .text {
        color: var(--light-text--);
        font-family: "PingFang SC";
        font-size: .vw(16)[];
        line-height: .vw(16)[];
        font-weight: 400;
        font-style: normal;
        margin-right: .vw(10)[];
      }

      .default-address {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: .vw(14)[];
        background-color: #EFEFEF;
        padding: .vw(10)[] .vw(16)[];

        .text {
          color: #50525C;
          font-family: "PingFang SC";
          font-size: .vw(16)[];
          line-height: .vw(27)[];
          font-weight: 400;
          font-style: normal;
        }

        .switch {
          width: .vw(32)[];
          height: .vw(20)[];
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/address/switch-on.png);

          &.off {
            background-image: url(@/assets/images/address/switch-off.png);
          }
        }
      }
    }
  }

  .edit-address {
    position: fixed;
    left: .vw(18)[];
    right: .vw(18)[];
    bottom: .vw(18)[];
  }
}
</style>
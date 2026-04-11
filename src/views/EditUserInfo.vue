<template>
  <main class="edit-user-info">
    <Header title="完善资料"></Header>
    <div class="body">
      <div class="avatar">
        <Upload accept="image/*" @change="avatarChange">
          <template #content>
            <div class="cover" v-if="formdata.avatar">
              <img :src="formdata.avatar" alt="">
            </div>
            <div class="default" v-else>
              <img src="@/assets/images/avatar.png" alt="">
            </div>
          </template>
        </Upload>
      </div>
      <div class="item">
        <p class="text">昵称</p>
        <Input v-model="formdata.nickName" type="text" placeholder="请输入">
          <template #right>
            <img src="@/assets/images/edit.png" alt="" class="icon">
          </template>
        </Input>
      </div>
      <div class="item">
        <p class="text">性别</p>
        <Gender :value="formdata.gender" :disabled="genderDisabled" @click="clickGender"></Gender>
      </div>
      <div class="item">
        <p class="text">生日</p>
        <Input v-model="formdata.birthday" :readonly="true" type="text" placeholder="请输入" @click="clickBirthday">
          <template #right>
            <img src="@/assets/images/calendar.png" alt="" class="icon">
          </template>
        </Input>
      </div>
      <div class="item">
        <p class="text">居住地</p>
        <Input v-model="formdata.address" :readonly="true" type="text" placeholder="请输入" @click="clickRouter('city')">
          <template #right>
            <img src="@/assets/images/location.png" alt="" class="icon">
          </template>
        </Input>
      </div>
      <div class="item">
        <p class="text">邀请码</p>
        <Input v-model="formdata.invitationCode" type="text" placeholder="请输入"></Input>
      </div>
    </div>
    <div class="submit">
      <Button buttonText="完成" @click="confirm"></Button>
      <p class="desc">注册完成后，您的性别将无法更改</p>
    </div>
  </main>

  <DatePicker :visible="showDatePicker" :modelValue="formdata.birthday" @update:visible="birthdayVisible"
    @change="birthdayChange">
  </DatePicker>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Upload from '@/components/FormData/Upload.vue'
import Input from '@/components/FormData/Input.vue'
import Gender from '@/components/FormData/Gender.vue'
import DatePicker from '@/components/FormData/DatePicker.vue'
import Button from '@/components/FormData/Button.vue'

const router = useRouter()
const userInfo = ref({})
const formdata = ref({
  avatar: '',
  nickName: '',
  gender: '',
  birthday: '',
  address: '',
  invitationCode: '',
})
const genderDisabled = ref(false)
const showDatePicker = ref(false)

onBeforeMount(() => {
  // 展示当前用户个人信息
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    const { avatar, nickName, gender, birthday, address, invitationCode } = JSON.parse(userInfo)
    formdata.value.avatar = avatar
    formdata.value.nickName = nickName
    formdata.value.gender = gender
    formdata.value.birthday = birthday
    formdata.value.address = address
    formdata.value.invitationCode = invitationCode
    if (gender === 1 || gender === 2) {
      genderDisabled.value = true
    }
  }
  // 获取已选择城市
  const city = localStorage.getItem('select-city')
  if (city) {
    const { name } = JSON.parse(city)
    formdata.value.address = name
    localStorage.removeItem('select-city')
  }
})

onMounted(() => {
  const data = localStorage.getItem('userInfo')
  userInfo.value = JSON.parse(data)
})

const avatarChange = (event) => {
  console.log(333, event);
  formdata.value.avatar = event[0]
}

const clickGender = (type) => {
  formdata.value.gender = type
}

const clickBirthday = () => {
  showDatePicker.value = true
}

const birthdayVisible = (event) => {
  showDatePicker.value = event
}

const birthdayChange = (event) => {
  formdata.value.birthday = event
}


const clickRouter = (url) => {
  router.push({ name: url })
}

const confirm = async () => {
  console.log(999, formdata.value);
  // $toast.loading('保存中')
  // const res = await api.post('', formdata.value)
  // if (res.code === 200) {
  //   $toast.info('保存成功')
  //   const timer = setTimeout(() => {
  //     clearTimeout(timer)
  //     router.back()
  //   }, 1500)
  // } else {
  //   $toast.info(res.message)
  // }
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.edit-user-info {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 .vw(18)[];

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: .vw(28)[];
      padding-bottom: .vw(40)[];

      .cover,
      .default {
        width: .vw(88)[];
        height: .vw(88)[];

        img {
          max-width: 100%;
          max-height: 100%;
        }
      }

      .cover {
        border-radius: 50%;
        border: .vw(2)[] solid var(--text--);
      }

      .default {
        position: relative;

        &::after {
          content: '';
          width: .vw(24)[];
          height: .vw(24)[];
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: var(--white--);
          background-size: .vw(18)[] .vw(18)[];
          background-position: center;
          background-repeat: no-repeat;
          background-image: url(@/assets/images/camera.png);
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
    }

    .item {
      &:not(:last-of-type) {
        margin-bottom: .vw(16)[];
      }

      .text {
        color: var(--text--);
        font-family: "PingFang SC";
        font-size: .vw(14)[];
        line-height: .vw(14)[];
        font-weight: 400;
        font-style: normal;
        padding-left: .vw(7)[];
        margin-bottom: .vw(8)[];
      }

      .icon {
        width: .vw(18)[];
        height: .vw(18)[];
        margin-left: .vw(8)[];
      }
    }
  }

  .submit {
    padding: 0 .vw(18)[] .vw(20)[];

    .desc {
      color: #B7B9C1;
      font-family: "PingFang SC";
      font-size: .vw(14)[];
      line-height: .vw(14)[];
      font-weight: 400;
      font-style: normal;
      text-align: center;
      margin-top: .vw(12)[];
    }
  }
}
</style>
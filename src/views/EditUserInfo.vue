<template>
  <main class="edit-user-info">
    <Header title="完善资料"></Header>
    <div class="body">
      <div class="avatar">
        <Upload accept="image/*" @change="avatarChange">
          <template #content>
            <div class="cover" v-if="formdata.avatar">
              <img :src="formdata.avatar" alt="" />
            </div>
            <div class="default" v-else>
              <img src="@/assets/images/avatar.png" alt="" />
            </div>
          </template>
        </Upload>
      </div>
      <div class="item">
        <p class="text">昵称</p>
        <Input v-model="formdata.nickName" type="text" placeholder="请输入">
          <template #right>
            <img src="@/assets/images/edit.png" alt="" class="icon" />
          </template>
        </Input>
      </div>
      <div class="item">
        <p class="text">性别</p>
        <Gender :value="formdata.gender" :disabled="genderDisabled" @click="clickGender"></Gender>
      </div>
      <div class="item">
        <p class="text">生日</p>
        <Input
          v-model="formdata.birthday"
          :readonly="true"
          type="text"
          placeholder="请输入"
          @click="clickBirthday"
        >
          <template #right>
            <img src="@/assets/images/calendar.png" alt="" class="icon" />
          </template>
        </Input>
      </div>
    </div>
    <div class="submit">
      <Button buttonText="完成" @click="confirm"></Button>
      <p class="desc">注册完成后，您的性别将无法更改</p>
    </div>
  </main>

  <van-popup v-model:show="showDatePicker" round position="bottom">
    <van-date-picker
      title="选择日期"
      :min-date="minDate"
      :max-date="maxDate"
      :value="formdata.birthday"
      @cancel="birthdayVisible"
      @confirm="birthdayChange"
    />
  </van-popup>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import Upload from '@/components/FormData/Upload.vue'
import Input from '@/components/FormData/Input.vue'
import Gender from '@/components/FormData/Gender.vue'
import Button from '@/components/FormData/Button.vue'

const router = useRouter()
const formdata = ref({
  avatar: '',
  nickName: '',
  gender: '',
  birthday: '',
})
const genderDisabled = ref(false)
const showDatePicker = ref(false)
const minDate = ref(new Date(1970, 0, 1))
const maxDate = ref(new Date(2070, 0, 1))

onBeforeMount(() => {
  // 展示当前用户个人信息
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    const { avatar, nickName, gender, birthday } = JSON.parse(userInfo)
    formdata.value.avatar = avatar
    formdata.value.nickName = nickName
    formdata.value.gender = gender
    formdata.value.birthday = birthday
    if (gender === 1 || gender === 2) {
      genderDisabled.value = true
    }
  }
})

const avatarChange = async (event) => {
  const formData = event[0]
  try {
    const res = await api.post('/admin/pinball/file/upload', formData)
    if (res.code === 200) {
      formdata.value.avatar = res.data.filePathUrl
    }
  } catch (e) {
    $toast.info('上传失败')
  }
}

const clickGender = (type) => {
  formdata.value.gender = type
}

const clickBirthday = () => {
  showDatePicker.value = true
}

const birthdayVisible = () => {
  showDatePicker.value = false
}

const birthdayChange = (event) => {
  birthdayVisible()
  formdata.value.birthday = event.selectedValues.join('-')
}

const confirm = async () => {
  const { avatar, nickName, gender, birthday } = formdata.value
  const birthdayDateTime = birthday ? birthday + ' 00:00:00' : ''
  try {
    const res = await api.post('/pinball/user/info/updateProfile', {
      avatar,
      nickName,
      gender,
      birthday: birthdayDateTime,
    })
    if (res.code === 200) {
      $toast.success('保存成功')
      const timer = setTimeout(() => {
        clearTimeout(timer)
        router.back()
      }, 1500)
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

.edit-user-info {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 .vw(18) [];

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: .vw(28) [];
      padding-bottom: .vw(40) [];

      .cover,
      .default {
        width: .vw(88) [];
        height: .vw(88) [];

        img {
          width: 100%;
        }
      }

      .cover {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
      }

      .default {
        position: relative;
        border: .vw(2) [] solid var(--text--);

        &::after {
          content: '';
          width: .vw(24) [];
          height: .vw(24) [];
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: var(--white--);
          background-size: .vw(18) [] .vw(18) [];
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
        margin-bottom: .vw(16) [];
      }

      .text {
        color: var(--text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
        padding-left: .vw(7) [];
        margin-bottom: .vw(8) [];
      }

      .icon {
        width: .vw(18) [];
        height: .vw(18) [];
        margin-left: .vw(8) [];
      }
    }
  }

  .submit {
    padding: 0 .vw(18) [] .vw(20) [];

    .desc {
      color: #b7b9c1;
      font-family: 'PingFang SC';
      font-size: .vw(14) [];
      line-height: .vw(14) [];
      font-weight: 400;
      font-style: normal;
      text-align: center;
      margin-top: .vw(12) [];
    }
  }
}
</style>

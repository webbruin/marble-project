<template>
  <main class="fault-feedback">
    <Header title="故障反馈"></Header>
    <div class="body">
      <div class="info">
        <div class="title">您的反馈是？</div>
        <div class="desc">
          <i class="icon edit"></i>
          <span class="text">反馈记录</span>
        </div>
      </div>
      <div class="check-list">
        <div class="item" :class="{ 'selected': params.feedbackType === item.value }"
          v-for="(item, index) in feedbackTypes" :key="index" @click="params.feedbackType = item.value">
          <i class="icon" :class="`${item.icon}${params.feedbackType === item.value ? '-light' : ''}`"></i>
          <span class="text">{{ item.label }}</span>
        </div>
      </div>
      <div class="content">
        <textarea rows="5" placeholder="欢迎您反馈使用跨越速运时遇到的问题和建议，帮助我们做的更好（必填）" v-model="params.content"></textarea>
      </div>
      <div class="info">
        <div class="title">添加图片(选填)</div>
      </div>
      <div class="upload">
        <div class="desc">上传截图能更快解决问题哦({{ params.images.length }}/5)</div>
        <!-- <van-uploader v-model="params.images" multiple :max-count="5" /> -->
        <Upload accept="image/*" :limit="5" @change="imgChange">
          <template #content>
            <div class="cover-list">
              <div class="cover-item" v-for="(item, index) in params.images" :key="index" @click.stop="preview(index)">
                <img class="cover" :src="item" alt="" />
              </div>
              <div class="cover-item" v-if="params.images.length < 5">
                <img class="icon" src="@/assets/images/feedback/upload.png" alt="" />
              </div>
            </div>
          </template>
        </Upload>
      </div>
      <div class="info">
        <div class="title">订单号(选填)</div>
      </div>
      <div class="order-no">
        <input type="text" placeholder="请输入" v-model="params.orderId">
      </div>
    </div>
    <div class="submit">
      <Button buttonText="提交" @click="submit"></Button>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/FormData/Button.vue'
import Upload from '@/components/FormData/Upload.vue'
import { showImagePreview } from 'vant';

const route = useRoute()
const router = useRouter()

const feedbackTypes = ref([
  { value: 1, label: '下单问题', icon: 'icon1' },
  { value: 2, label: '点击问题', icon: 'icon2' },
  { value: 3, label: '费用问题', icon: 'icon3' },
  { value: 4, label: '服务问题', icon: 'icon4' },
  { value: 5, label: '订单问题', icon: 'icon5' },
  { value: 6, label: '积分问题', icon: 'icon6' },
  { value: 7, label: '卡顿/闪现', icon: 'icon7' },
  { value: 8, label: '其他问题', icon: 'icon8' },
])
const params = ref({
  feedbackType: '',
  content: '',
  images: [],
  orderId: '',
})

onMounted(() => { })

const imgChange = async (event) => {
  for (const n in event) {
    const formData = event[n]
    try {
      $toast.loading('上传中')
      const res = await api.post('/admin/pinball/file/upload', formData)
      $toast.close()
      if (res.code === 200) {
        params.value.images.push(res.data.filePathUrl)
      }
    } catch (e) {
      $toast.info(`第${n + 1}张上传失败`)
    }
  }
}

const preview = (index) => {
  showImagePreview({
    images: params.value.images,
    startPosition: index
  })
}

const submit = async () => {
  if (!params.value.feedbackType) {
    $toast.info('请选择反馈类型')
    return
  }
  if (!params.value.content) {
    $toast.info('请选择反馈内容')
    return
  }
  const images = []
  for (const item of params.value.images) {
    console.log(111, item);
    const res = await api.post('/admin/pinball/file/upload', item.file)
    if (res.code === 200) {
      images.push(res.data.filePathUrl)
    }
  }
  const body = {
    ...params.value,
    images
  }
  console.log(222, body);
  return
  try {
    loading.value = true
    const res = await api.post('/pinball/feedback/save', body)
    loading.value = false
    if (res.code === 200) {
      $toast.info('提交成功')
    }
  } catch (e) {
    $toast.info('系统错误')
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.fault-feedback {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #fff;
    padding: .vw(0) [] .vw(18) [];

    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .vw(7)[] 0;

      .title {
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(18) [];
        line-height: .vw(18) [];
        font-weight: 500;
        font-style: normal;
      }

      .desc {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .icon {
          margin-right: .vw(4)[];
        }

        .text {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(14) [];
          font-weight: 500;
          font-style: normal;
        }
      }
    }

    .check-list {
      display: flex;
      flex-wrap: wrap;
      padding: .vw(8)[] 0;

      .item {
        width: .vw(161) [];
        height: .vw(48) [];
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: .vw(9)[];
        background: #E3E3E4;
        padding: .vw(8)[] 0;
        margin-bottom: .vw(16)[];

        &:not(:nth-child(2n + 0)) {
          margin-right: .vw(16) [];
        }

        .icon {
          margin-right: .vw(8)[];
        }

        .text {
          color: var(--text--);
          font-family: 'PingFang SC';
          font-size: .vw(14) [];
          line-height: .vw(16) [];
          font-weight: 500;
          font-style: normal;
        }

        &.selected {
          border: .vw(1)[] solid #FFB169;
          background: var(--warning-light-fff-4-e-6, #FFF4E6);

          .icon {
            stroke: #FFB169;
          }

          .text {
            color: #FFB169;
          }
        }
      }
    }

    .content {
      margin-bottom: .vw(8)[];

      textarea {
        width: 100%;
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(20) [];
        font-weight: 400;
        font-style: normal;
        border-radius: .vw(9)[];
        border: .vw(1)[] solid #DCDCDC;
        padding: .vw(8)[];

        &::placeholder {
          color: var(--text--);
        }
      }
    }

    .upload {
      .desc {
        color: var(--text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(14) [];
        font-weight: 400;
        font-style: normal;
        margin-bottom: .vw(8)[];
      }

      .cover-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .cover-item {
          width: .vw(48)[];
          height: .vw(48)[];
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: .vw(4)[];
          border: .vw(1)[] dashed #E3E3E4;
          overflow: hidden;

          &:not(:last-of-type) {
            margin-right: .vw(6) [];
          }

          .cover {
            width: 100%;
          }

          .icon {
            width: .vw(16)[];
            height: .vw(16)[];
          }
        }
      }

    }

    .order-no {
      input {
        width: 100%;
        color: var(--light-text--);
        font-family: 'PingFang SC';
        font-size: .vw(14) [];
        line-height: .vw(20) [];
        font-weight: 400;
        font-style: normal;
        border: none;
        border-bottom: .vw(1)[] solid #DCDCDC;
        padding: .vw(4)[] 0;

        &::placeholder {
          color: var(--text--);
        }
      }
    }
  }

  .icon {
    width: .vw(16)[];
    height: .vw(16)[];
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;

    &.edit {
      background-image: url(@/assets/images/feedback/edit.png);
    }

    &.icon1 {
      background-image: url(@/assets/images/feedback/icon1.png);
    }

    &.icon1-light {
      background-image: url(@/assets/images/feedback/icon1-light.png);
    }

    &.icon2 {
      background-image: url(@/assets/images/feedback/icon2.png);
    }

    &.icon2-light {
      background-image: url(@/assets/images/feedback/icon2-light.png);
    }

    &.icon3 {
      background-image: url(@/assets/images/feedback/icon3.png);
    }

    &.icon3-light {
      background-image: url(@/assets/images/feedback/icon3-light.png);
    }

    &.icon4 {
      background-image: url(@/assets/images/feedback/icon4.png);
    }

    &.icon4-light {
      background-image: url(@/assets/images/feedback/icon4-light.png);
    }

    &.icon5 {
      background-image: url(@/assets/images/feedback/icon5.png);
    }

    &.icon5-light {
      background-image: url(@/assets/images/feedback/icon5-light.png);
    }

    &.icon6 {
      background-image: url(@/assets/images/feedback/icon6.png);
    }

    &.icon6-light {
      background-image: url(@/assets/images/feedback/icon6-light.png);
    }

    &.icon7 {
      background-image: url(@/assets/images/feedback/icon7.png);
    }

    &.icon7-light {
      background-image: url(@/assets/images/feedback/icon7-light.png);
    }

    &.icon8 {
      background-image: url(@/assets/images/feedback/icon8.png);
    }

    &.icon8-light {
      background-image: url(@/assets/images/feedback/icon8-light.png);
    }

    &.upload {
      background-image: url(@/assets/images/feedback/upload.png);
    }
  }

  .submit {
    position: fixed;
    left: .vw(18) [];
    right: .vw(18) [];
    bottom: .vw(18) [];
  }
}
</style>

<template>
  <div class="upload" @click="clickFile">
    <slot name="content" />
    <input class="file-upload" ref="fileUpload" type="file" :accept="accept" :multiple="limit > 1" :disabled="disabled"
      @change="uploadChange" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  accept: {
    type: String,
  },
  limit: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['change'])
const fileUpload = ref(null)
const maxSize = ref(20)

onMounted(() => {

})

const clickFile = () => {
  if (props.disabled) {
    return
  }
  fileUpload.value.click()
}

const uploadChange = async (event) => {
  const { files } = event.target
  if (files.length > props.limit) {
    $toast.info(`最多选择${props.limit}个文件`)
    return
  }
  $toast.loading('上传中')
  const fileList = []
  for (const file of files) {
    const fileSize = Number((file.size / 1024 / 1024).toFixed(2))
    if (fileSize > maxSize.value) {
      $toast.info(`文件${file.name}尺寸过大，请选择${maxSize.value}M以内的文件`)
      continue
    }
    let formData = new FormData()
    // 上传接口
    formData.append('file', file)
    fileList.push(formData)
  }
  $toast.close()
  emit('change', fileList)
}
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.upload {
  position: relative;

  .file-upload {
    visibility: hidden;
    position: absolute;
    z-index: -999999;
  }

  &.disabled {
    background-color: #FFCA91;
    pointer-events: none;
  }
}
</style>
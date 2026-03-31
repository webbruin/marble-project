<template>
  <main>
    <h1>404</h1>
    <p>页面不存在，请检查地址是否正确</p>
    <router-link to="/">返回首页</router-link>
  </main>
</template>

<script setup>
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}
</style>
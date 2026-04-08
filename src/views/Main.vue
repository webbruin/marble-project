<template>
  <div class="content">
    <router-view />
    <Footer></Footer>
  </div>
</template>

<script setup>
import Footer from '../components/Footer.vue'
</script>

<style scoped lang="less">
.vw(@number) {
  @return: calc(@number / 375 * 100vw);
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;

  main {
    flex: 1;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
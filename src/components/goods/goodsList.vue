<template>
  <div class="goodsList">
    <breadcrumb>
      <span slot="one">商品管理</span>
      <span slot="two">商品列表</span></breadcrumb
    >
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'
export default {
  name: 'goodsList',
  components: {
    breadcrumb,
  },
}
</script>

<style lang="less" scoped>
</style>
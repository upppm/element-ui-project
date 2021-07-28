<template>
  <div class="goodsParameter">
    <breadcrumb>
      <span slot="one">商品管理</span>
      <span slot="two">分类参数</span></breadcrumb
    >
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'

export default {
  name: 'goodsParameter',
  components: {
    breadcrumb,
  },
}
</script>

<style lang="less" scoped>
</style>
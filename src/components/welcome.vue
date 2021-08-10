<template>
  <div>
    <div
      class="block"
      v-for="(fit, index) in getNewApiList.banner.list"
      :key="index"
    >
      <div class="demonstration" style="color: blue">{{ fit.title }}</div>
      <el-image :src="fit.image" fit="fill"></el-image>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'welcome',
  data() {
    return {
      getNewApiList: {},
    }
  },
  created() {
    this.getNewApi()
  },
  methods: {
    async getNewApi() {
      const { data: res } = await axios.get(
        'http://152.136.185.210:7878/api/m5/home/multidata'
      )
      if (res.success == true) {
        this.$message.success('请求成功')
      } else {
        this.$message.error('请求失败')
      }
      console.log(res.data)
      this.getNewApiList = res.data
    },
  },
}
</script>

<style lang="less" scoped>
h3 {
  color: black;
}
</style>
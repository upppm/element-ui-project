<template>
  <div class="hello">
    <div>这是home组件</div>
    <div>{{ msg }}</div>
    <div><el-button type="info" plain @click="backout">退出</el-button></div>
  </div>
</template>

<script>
export default {
  name: 'home',
  props: {
    msg: String,
  },
  methods: {
    backout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
</style>

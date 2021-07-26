<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="content">后台管理系统</div>
      <div class="back">
        <el-button type="info" plain @click="backout">退出</el-button>
      </div>
    </el-header>

    <!-- 页面主体区 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="leftAsideWith">
        <div class="leftClose" @click="leftCloseTh">| | |</div>
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="rgba(51, 51, 51, 0)"
          text-color="#fff"
          active-text-color="#409BFF"
          :unique-opened="true"
          :collapse="leftMenuCollapse"
          :collapse-transition="false"
          :router="true"
          v-for="(item, index) in leftMenu"
          :key="index"
          :default-active="$route.path"
        >
          <el-submenu :index="index + ''">
            <template slot="title">
              <i :class="iconitem[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="(items, indexs) in item.children"
              :key="indexs"
              :index="'/' + items.path"
              @click="pathStore('/' + items.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ items.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧边栏 -->
      <el-main>
        <!-- 放置路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  props: {
    msg: String,
  },

  data() {
    return {
      // 获取左侧导航数据
      leftMenu: [],
      iconitem: [
        'el-icon-s-custom',
        'el-icon-key',
        'el-icon-shopping-cart-full',
        'el-icon-document',
        'el-icon-data-analysis',
      ],
      leftMenuCollapse: false,
      leftAsideWith: '180px',
      activePath: '',
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('setPath')
  },
  methods: {
    backout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.leftMenu = res.data
      console.log(this.leftMenu)
    },
    // 左边收缩展开功能
    leftCloseTh() {
      this.leftMenuCollapse = !this.leftMenuCollapse
      if (this.leftMenuCollapse) return (this.leftAsideWith = '64px')
      this.leftAsideWith = '180px'
    },
    pathStore(res) {
      console.log(res)
      window.sessionStorage.setItem('setPath', res)
      this.activePath = res
    },
  },
}
</script>

<style scoped lang="less">
.el-container {
  height: 100%;
}
.el-header {
  background-color: rgba(51, 51, 51);
  color: rgb(247, 241, 241);
  text-align: left;
  line-height: 60px;
  display: flex;
  div {
    flex: 1;
  }
  .content {
    font-size: 20px;
    font-weight: 500;
  }
  .back {
    text-align: right;
  }
}
.el-aside {
  background-color: rgba(51, 51, 51, 0.9);
  color: #d3dce6;
  text-align: center;
  .el-menu {
    border: none;
    box-sizing: border-box;
    .el-submenu {
      text-align: left;
    }
  }
}

.el-main {
  background-color: rgba(234, 237, 241, 0.8);
  color: #e9eef3;
  text-align: center;
}
.leftClose {
  color: #7a7b7c;
  font-weight: 700;
  background: rgb(88, 88, 88);
}
</style>

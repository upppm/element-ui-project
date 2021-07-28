<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="content">
        <img src="../assets/man2.png" alt="" />
        <div class="content_name">后台管理系统</div>
      </div>
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
              <i :class="iconitem[index]" style="color: #d3dce6"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="(items, indexs) in item.children"
              :key="indexs"
              :index="'/' + items.path"
              @click="pathStore('/' + items.path)"
            >
              <template slot="title">
                <i class="el-icon-menu" style="color: #d3dce6"></i>
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
  background: url(../assets/bgd.jpg);
}
.el-header {
  height: 70px !important;
  background-color: rgba(86, 98, 114, 0.6);
  color: rgb(255, 255, 255);
  text-align: left;
  line-height: 70px;
  display: flex;
  div {
    flex: 1;
  }
  .content {
    position: relative;
    font-size: 38px;
    font-family: 'STKaiti';
    font-weight: 900;
    > img {
      position: absolute;
      left: 1px;
      height: 70px;
    }
    &_name {
      position: relative;
      left: 75px;
    }
  }
  .back {
    text-align: right;
  }
}
.el-aside {
  background-color: rgba(86, 98, 114, 0.6);
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
  // background: url(../assets/bg1.png);
  color: #e9eef3;
  text-align: center;
}
.leftClose {
  color: #a9abaf;
  font-weight: 700;
  background: url(../assets/bg1.png);
}
.i {
  color: #d3dce6;
}
</style>

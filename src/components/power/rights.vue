<template>
  <div class="rights">
    <breadcrumb
      ><span slot="one">权限管理</span>
      <span slot="two">权限列表</span></breadcrumb
    >
    <el-card class="box-card">
      <el-table :data="rightsList" border style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="">
        </el-table-column>
        <el-table-column prop="path" label="路径" width=""> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag :type="tagType[0]" v-show="scope.row.level == 0"
              >一级</el-tag
            >
            <el-tag :type="tagType[1]" v-show="scope.row.level == 1"
              >二级</el-tag
            >
            <el-tag :type="tagType[2]" v-show="scope.row.level == 2"
              >三级</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'
export default {
  name: 'rights',
  created() {
    this.rightsGetList()
  },
  data() {
    return {
      rightsList: [],
      tagType: ['', 'success', 'warning', 'danger', 'info'],
    }
  },
  components: {
    breadcrumb,
  },
  methods: {
    async rightsGetList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200)
        return this.$message.error('获取权限列表失败')
      this.$message.success('获取权限列表成功')
      this.rightsList = res.data
      console.log(res)
    },
  },
}
</script>

<style lang="less" scoped>
div {
  color: black;
}
.box-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>
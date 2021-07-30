<template>
  <div class="goodsList">
    <breadcrumb>
      <span slot="one">商品管理</span>
      <span slot="two">商品列表</span></breadcrumb
    >
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索功能 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="searchList"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchListBtn"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="16" style="text-align: left">
          <el-button type="primary" @click="addListBtn">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="showGoodsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="400">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="">
        </el-table-column>
        <el-table-column label="创建时间" width="110" v-slot="scope"
          >{{ scope.row.add_time | formaDate('yyyy-mm-dd') }}
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="listDelete(scope.row)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="listSizeChange"
        @current-change="listCurrentChange"
        :current-page="listPage.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="listPage.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'
export default {
  name: 'goodsList',
  components: {
    breadcrumb,
  },
  data() {
    return {
      // 搜索框内容
      searchList: '',
      listPage: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      showGoodsList: [],
      listTotal: null,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 拿到商品列表清单
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.listPage,
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取成功')
      this.showGoodsList = res.data.goods
      this.listTotal = res.data.total
      console.log(res)
    },
    // 每页显示多少条
    listSizeChange(val) {
      this.listPage.pagesize = val
      this.getGoodsList()
    },
    // 当前为第几页
    listCurrentChange(val) {
      this.listPage.pagenum = val
      this.getGoodsList()
    },
    // 点击搜索按钮
    searchListBtn() {
      this.listPage.query = this.searchList
      this.getGoodsList()
    },
    // 添加商品按钮
    addListBtn() {
      return this.$router.push({ path: '/goods/add' })
    },
    // 删除商品
    listDelete(all) {
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${all.goods_id}`)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.getGoodsList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
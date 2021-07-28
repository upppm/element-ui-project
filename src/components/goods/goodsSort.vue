<template>
  <div class="goodsSort">
    <breadcrumb>
      <span slot="one">商品管理</span>
      <span slot="two">商品分类</span></breadcrumb
    >
    <!-- 商品分类卡片 -->
    <el-card class="roles-card">
      <div class="roles_btn">
        <el-button type="primary" @click="addSortBtn" class="addSortListBtn"
          >添加分类</el-button
        >
        <!-- 添加分类弹窗 -->
        <el-dialog
          title="添加分类"
          :visible.sync="addSortVisible"
          @close="addSortClose"
          width="50%"
        >
          <el-form
            label-width="80px"
            ref="addSortRef"
            :model="addSortList"
            :rules="addSortRules"
          >
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addSortList.cat_name" type="text"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
              <!-- options用于绑定数据源 -->
              <el-cascader
                :options="parentAddSortList"
                :props="parentAddSortListProps"
                clearable
                v-model="parentAddSortContent"
                change-on-select
                style="width: 50%"
              ></el-cascader>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addSortVisible = false">取 消</el-button>
            <el-button type="primary" @click="addSortIstrue">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 商品分类表格内容 -->
      <tree-table
        :data="sortList"
        style="width: 100%"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <!-- 使用slot-scope接收一行的数据 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: green; font-size: 20px"
            v-show="!scope.cat_deleted"
          ></i>
          <i
            class="el-icon-error"
            style="color: red; font-size: 20px"
            v-show="scope.cat_deleted"
          ></i>
        </template>
        <template slot="level" slot-scope="scope1">
          <el-tag v-show="scope1.row.cat_level === 0" size="medium"
            >一级</el-tag
          >
          <el-tag
            v-show="scope1.row.cat_level === 1"
            type="success"
            size="medium"
            >二级</el-tag
          >
          <el-tag
            v-show="scope1.row.cat_level === 2"
            type="warning"
            size="medium"
            >三级</el-tag
          >
        </template>
        <template slot="operate" slot-scope="scope2">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="sortReviseBtn(scope2.row)"
            >编辑</el-button
          >

          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteSort(scope2.row.cat_id)"
            >删除
          </el-button>
        </template>
      </tree-table>
      <el-dialog title="编辑分类" :visible.sync="reviseSortVisible" width="50%">
        <el-form
          label-width="80px"
          ref="reviseSortRef"
          :rules="reviseSortRules"
          :model="sortContentall"
        >
          <el-form-item label="分类名称" prop="sortContent">
            <el-input
              v-model="sortContentall.sortContent"
              type="text"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="reviseSortVisible = false">取 消</el-button>
          <el-button type="primary" @click="reviseSortIstrue">确 定</el-button>
        </div>
      </el-dialog>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="sortpageInfo.pagenum"
        :page-size="sortpageInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="this.sortTotal"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'

export default {
  name: 'goodsSort',
  components: {
    breadcrumb,
  },
  data() {
    return {
      addSortVisible: false,
      addSortList: {
        cat_name: '',
        // 分类父id
        cat_pid: 0,
        // 分类层级
        cat_level: 0,
      },
      // 父级角色的选择列表
      parentAddSortList: [],
      parentAddSortListProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 获取到的父级角色数据
      parentAddSortContent: [],
      addSortRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      sortList: [],
      // 页码内容
      sortpageInfo: {
        pagenum: 1,
        pagesize: 10,
      },
      goSortpagenum: '',
      sortTotal: null,
      // 树结构列表内容
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 表示将放前列定义为模板列
          type: 'template',
          // 定义模板列的插槽名称
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'level',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate',
        },
      ],
      // 编辑按钮中绑定的内容
      sortContentall: {
        sortContent: '',
        sortContentId: '',
      },

      reviseSortVisible: false,
      reviseSortRules: {
        sortContent: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getSortList()
  },
  methods: {
    // 请求商品分类接口
    async getSortList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.sortpageInfo,
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取成功')
      this.sortTotal = res.data.total
      console.log(res.data)
      this.sortList = res.data.result
    },
    // 添加分类按钮
    addSortBtn() {
      this.addSortVisible = true
      this.sortParcontent()
    },
    // 关闭弹窗重置功能
    addSortClose() {
      this.$refs.addSortRef.resetFields()
      this.parentAddSortContent = []
    },
    // 添加分类确定按钮
    addSortIstrue() {
      console.log(this.addSortList)
      const par = this.parentAddSortContent
      console.log(par)
      if (this.parentAddSortContent.length > 0) {
        this.addSortList.cat_pid =
          this.parentAddSortContent[this.parentAddSortContent.length - 1]
      }
      this.addSortList.cat_level = this.parentAddSortContent.length
      this.$refs.addSortRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addSortList
        )
        if (res.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success('创建成功')
        console.log(res)
      })
      this.addSortVisible = false
      this.getSortList()
    },
    // 获取父级分类内容
    async sortParcontent() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取成功')
      this.parentAddSortList = res.data
      console.log(res)
    },
    // 页码跳转功能
    handleCurrentChange(val) {
      this.sortpageInfo.pagenum = val
      this.getSortList()
      console.log(`当前页: ${val}`)
    },
    // 编辑按钮
    sortReviseBtn(all) {
      this.reviseSortVisible = true
      console.log(all)
      this.sortContentall.sortContent = all.cat_name
      this.sortContentall.sortContentId = all.cat_id
    },
    async reviseSortIstrue() {
      const { data: res } = await this.$http.put(
        `categories/${this.sortContentall.sortContentId}`,
        { cat_name: this.sortContentall.sortContent }
      )
      if (res.meta.status !== 200) return this.$message.error('更新失败')
      this.$message.success('更新成功')
      this.reviseSortVisible = false
      this.getSortList()
      console.log(res)
    },

    // 删除按钮
    deleteSort(tes) {
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${tes}`)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.getSortList()
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
.el-pagination {
  margin-top: 10px;
}
.roles_btn {
  text-align: left;
}
.addSortListBtn {
  margin-bottom: 10px;
}
.zk-table {
  font-size: 15px;
}
</style>
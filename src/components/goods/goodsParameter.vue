<template>
  <div class="goodsParameter">
    <breadcrumb>
      <span slot="one">商品管理</span>
      <span slot="two">分类参数</span></breadcrumb
    >
    <el-card>
      <el-alert
        title="只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-form :inline="true" class="parameter_form">
        <el-form-item label="审批人">
          <el-cascader
            :options="getSortListContent"
            :show-all-levels="false"
            :props="getSortListProps"
            v-model="SortListId"
            @change="SortListChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="SortListId.length > 1 ? false : true"
            class="addParBtn"
            @click="openmany"
            >添加参数</el-button
          >
          <el-table border style="width: 100%" stripe :data="activeParList">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  :key="i"
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="parTagClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加tag标签 -->
                <el-input
                  style="width: 120px"
                  class="input-new-tag"
                  v-if="testBooleanBtn"
                  v-model="testContent"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="">
            </el-table-column>
            <el-table-column label="操作" width="">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="parReviseBtn(scope.row)"
                  >编辑</el-button
                >

                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteRevisePar(scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            :disabled="SortListId.length > 1 ? false : true"
            class="addParBtn"
            @click="openonly"
            >添加属性</el-button
          >
          <el-table border style="width: 100%" stripe :data="coolParList">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  :key="i"
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="parTagClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加tag标签 -->
                <el-input
                  type="text"
                  style="width: 160px"
                  class="input-new-tag"
                  v-if="testBooleanBtn"
                  v-model="testContent"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="">
            </el-table-column>
            <el-table-column label="操作" width="">
              <template v-slot="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="parReviseBtn(scope.row)"
                  >编辑</el-button
                >

                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteRevisePar(scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加属性或参数对话框 -->
      <el-dialog
        :title="activeTitle"
        :visible.sync="activeBtn"
        @close="addParClose"
        width="50%"
      >
        <el-form
          label-width="80px"
          ref="addSortRef"
          :model="avtiveContent"
          :rules="activeRule"
        >
          <el-form-item label="分类名称" prop="avtiveContentText">
            <el-input
              v-model="avtiveContent.avtiveContentText"
              type="text"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="activeBtn = false">取 消</el-button>
          <el-button type="primary" @click="addParIstrue">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑按钮弹窗 -->
      <el-dialog title="添加分类" :visible.sync="activeEditBtn" width="50%">
        <el-form
          label-width="80px"
          ref="editParRef"
          :model="avtiveContent"
          :rules="activeRule"
        >
          <el-form-item label="分类名称" prop="avtiveEditContentText">
            <el-input
              v-model="avtiveContent.avtiveEditContentText"
              type="text"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="activeEditBtn = false">取 消</el-button>
          <el-button type="primary" @click="addParEditIstrue">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'

export default {
  name: 'goodsParameter',
  components: {
    breadcrumb,
  },
  data() {
    return {
      getSortListContent: [],
      getSortListProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      SortListId: '',
      activeName: 'many',
      // 动态及静态请求列表
      activeParList: [],
      coolParList: [],
      parGoodTag: [],

      inputVisible: false,
      // 添加按钮 公用
      activeTitle: '',
      activeBtn: false,
      //  按钮中绑定的内容
      avtiveContent: {
        avtiveContentText: '',
        avtiveEditContentText: '',
        attr_id: '',
      },
      // 校验规则
      activeRule: {
        avtiveContentText: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
        avtiveEditContentText: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 编辑按钮弹窗
      activeEditTitle: '',
      activeEditBtn: false,
      // 新增标签内容
      inputValue: '',
      // 创建一个布尔值
      testBooleanBtn: false,
      testContent: '',
    }
  },
  created() {
    this.getSortList()
  },
  methods: {
    // 获取商品所有分类
    async getSortList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 },
      })
      console.log(res)
      this.getSortListContent = res.data
    },
    SortListChange() {
      console.log(this.SortListId)
      this.getDynamic(
        this.SortListId[this.SortListId.length - 1],
        this.activeName
      )
    },
    // 请求动态参数
    async getDynamic(tes, put) {
      const { data: res } = await this.$http.get(
        `categories/${tes}/attributes`,
        { params: { sel: [put] } }
      )
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取成功')
      if (put === 'only') {
        this.coolParList = res.data
        this.coolParList.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          item.activeTagBoolean = false
          item.activeTagContent = ''
        })
      } else {
        this.activeParList = res.data
        this.activeParList.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          item.activeTagBoolean = false
          item.activeTagContent = ''
        })
      }
      console.log(this.coolParList)
      console.log(this.activeParList)
    },
    // 关闭tag
    parTagClose(index, row) {
      console.log(index)
      row.attr_vals.splice(index)
      this.editTag(row)
    },

    handleInputConfirm(all) {
      console.log('---', all)
      // 编辑修改提交接口
      if (this.testContent.trim().length === 0) {
        this.testContent = ''
        this.testBooleanBtn = false
        return
      }
      all.attr_vals.push(this.testContent.trim())
      this.editTag(all)
      this.testContent = ''
      this.testBooleanBtn = false
    },
    // 封装编辑tag标签接口
    async editTag(all) {
      const { data: res } = await this.$http.put(
        `categories/${this.SortListId[this.SortListId.length - 1]}/attributes/${
          all.attr_id
        }`,
        {
          attr_name: all.attr_name,
          attr_sel: all.attr_sel,
          attr_vals: all.attr_vals.join(','),
        }
      )
      if (res.meta.status !== 200) return this.$message.error('更新失败')
      this.$message.success('更新成功')
      console.log(res)
    },
    // 添加tag标签
    // 这里有一个bug不能随着all中的boolean时实改变v-if中的布尔值
    showInput(all) {
      all.activeTagBoolean = true
      this.testBooleanBtn = all.activeTagBoolean
      console.log(all)
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus(_)
      })
    },

    // tabs 切换
    handleClick() {
      this.getDynamic(
        this.SortListId[this.SortListId.length - 1],
        this.activeName
      )
      if (this.activeName == 'many') {
        return (
          (this.activeTitle = '添加参数'),
          (this.activeEditTitle = '修改动态参数')
        )
      } else {
        this.activeTitle = '添加属性'
        this.activeEditTitle = '修改静态属性'
      }
      console.log(this.activeName)
    },
    // 编辑按钮
    parReviseBtn(all) {
      this.activeEditBtn = true
      console.log(all)
      this.avtiveContent.avtiveEditContentText = all.attr_name
      this.avtiveContent.attr_id = all.attr_id
    },
    // 编辑确定按钮
    addParEditIstrue() {
      // 校验
      this.$refs.editParRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${
            this.SortListId[this.SortListId.length - 1]
          }/attributes/${this.avtiveContent.attr_id}`,
          {
            attr_name: this.avtiveContent.avtiveEditContentText,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
        console.log(res)
        this.handleClick()
        this.activeEditBtn = false
        console.log(res)
      })
    },
    // 删除按钮
    deleteRevisePar(all) {
      console.log(all)
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${
              this.SortListId[this.SortListId.length - 1]
            }/attributes/${all.attr_id}`
          )

          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.handleClick()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 添加属性或参数
    addParVisible() {},
    addParClose() {
      this.$refs.addSortRef.resetFields()
    },
    // 添加打开按钮
    openmany() {
      this.activeBtn = true
    },
    openonly() {
      this.activeBtn = true
    },
    // 添加对话框确定按钮
    addParIstrue() {
      this.$refs.addSortRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${
            this.SortListId[this.SortListId.length - 1]
          }/attributes`,
          {
            attr_name: this.avtiveContent.avtiveContentText,
            attr_sel: this.activeName,
          }
        )
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success('创建成功')
        console.log(res)
        this.handleClick()
        this.activeBtn = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
.parameter {
  &_form {
    text-align: left;
  }
}
.el-alert {
  margin-bottom: 15px;
}
.el-tag {
  margin-right: 10px;
}
.el-tab-pane {
  text-align: left;
}
.addParBtn {
  margin-bottom: 10px;
}
</style>
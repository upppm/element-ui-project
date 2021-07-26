<template>
  <div>
    <breadcrumb></breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="10">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="getUserPar.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户对话框 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserBtn">添加用户</el-button>
          <el-dialog
            title="添加用户"
            :visible.sync="addUers"
            width="50%"
            :before-close="handleClose"
            @close="closeDialog"
          >
            <el-form
              :model="addForm"
              :rules="addFormRules"
              ref="addFormRef"
              label-width="70px"
            >
              <el-form-item label="用户名" prop="username">
                <el-input type="text" v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input type="text" v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobail">
                <el-input type="text" v-model="addForm.mobail"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addUers = false">取 消</el-button>
              <el-button type="primary" @click="confirmBtn">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <el-table :data="users" border style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width=""> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="">
            <!-- 修改按钮 -->
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
            ></el-button>
            <!-- 设置按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="角色分配"
              placement="top-end"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getUserPar.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="getUserPar.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'
export default {
  name: 'users',
  components: {
    breadcrumb,
  },
  data() {
    // 邮箱校验规则
    var validateEmail = (rule, value, callback) => {
      // 邮箱的正则表达式
      const regemail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regemail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
      if (value === '') {
        callback(new Error('请输入邮箱内容'))
      }
    }
    // 电话校验规则
    var validateMobail = (rule, value, callback) => {
      // 电话的正则表达式
      const regemail = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
      if (regemail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
      if (value === '') {
        callback(new Error('请输入邮箱内容'))
      }
    }
    return {
      getUserPar: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      total: null,
      users: [],
      // 控制添加用户对话框
      addUers: false,
      // 对话框from内容及规则
      addForm: {
        username: '',
        password: '',
        email: '',
        mobail: '',
      },
      // 校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 4,
            max: 10,
            message: '长度在 4 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur',
          },
        ],
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        mobail: [
          { required: true, validator: validateMobail, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.getUserPar,
      })
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.users = res.data.users
      this.total = res.data.total
      console.log(this.total)
      console.log(this.users)
    },
    // 监听pagesize改变的事件，选择条数的值发生改变触发
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getUserPar.pagesize = val
      this.getUserList()
    },
    // 页码值发生改变时触发
    handleCurrentChange(val) {
      this.getUserPar.pagenum = val
      this.getUserList()
      console.log(`当前页: ${val}`)
    },
    // 监听开关状态的改变
    async stateChange(val) {
      const { data: res } = await this.$http.put(
        `users/${val.id}/state/${val.mg_state}`
      )
      if (res.meta.status != 200) {
        val.mg_state = !val.mg_state
        return this.$message.error('更新用户数据失败')
      }
      this.$message.success('更新用户数据成功')
    },
    // 关闭增加用户对话框
    handleClose() {
      this.addUers = !this.addUers
    },
    addUserBtn() {
      this.addUers = !this.addUers
    },
    // 关闭重置表单
    closeDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加预验证
    confirmBtn() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success('创建成功')
        console.log(res)
        this.addUers = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important  ;
}
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
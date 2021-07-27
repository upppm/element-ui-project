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
              label-width="70px"
              ref="addFormRef"
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
              <el-form-item label="手机号" prop="mobile">
                <el-input type="text" v-model="addForm.mobile"></el-input>
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
        <el-table-column label="操作" width="200">
          <template v-slot="scopes">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="reviseBtn(scopes.row.id)"
            ></el-button>
            <el-dialog
              title="修改用户"
              :visible.sync="reviseVisible"
              @close="closeRevise"
            >
              <el-form
                :model="reviseList"
                label-width="70px"
                ref="reviseRef"
                :rules="addFormRules"
              >
                <el-form-item label="用户名">
                  <el-input v-model="reviseList.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="reviseList.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="reviseList.mobile"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="reviseVisible = false">取 消</el-button>
                <el-button type="primary" @click="reviseIstrue(scopes.row.id)"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteBtn(scopes.row.id)"
            >
            </el-button>
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
                @click="setupBtn(scopes.row)"
              ></el-button>
            </el-tooltip>
            <!-- 角色分配按钮 -->
            <el-dialog
              title="分配角色"
              :visible.sync="setupVisible"
              width="50%"
            >
              <el-form :model="reviseList" label-width="70px">
                <el-form-item label="当前用户">
                  <el-input v-model="reviseList.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="当前角色">
                  <el-input v-model="reviseList.role_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="分配角色">
                  <el-select v-model="bindRolesList" placeholder="请选择活角色">
                    <!-- 这里的value指的是记录到model中的内容 -->
                    <el-option
                      v-for="item in rolesList"
                      :label="item.roleName"
                      :value="item.id"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="setupVisible = false">取 消</el-button>
                <el-button type="primary" @click="setupIstrue">确 定</el-button>
              </span>
            </el-dialog>
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
        mobile: '',
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
        mobile: [
          { required: true, validator: validateMobail, trigger: 'blur' },
        ],
      },
      // 修改按钮弹窗内容
      reviseVisible: false,
      reviseList: {
        username: '',
        email: '',
        mobile: '',
      },
      setupVisible: false,
      // 拿到的角色列表
      rolesList: [],
      // 绑定到的角色内容
      bindRolesList: '',
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
    // 修改按钮点击事件
    async reviseBtn(all) {
      this.reviseVisible = true
      console.log(all)
      const { data: res } = await this.$http.get(`users/${all}`)
      if (res.meta.status !== 200)
        return this.$message.error('获取用户信息失败')
      this.$message.success('获取用户信息成功')
      this.reviseList = res.data
      console.log(res)
    },
    // 点击修改按钮确认事件
    reviseIstrue(all) {
      this.$refs.reviseRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `users/${all}`,
          this.reviseList
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        console.log(res)
        this.reviseVisible = false
      })
    },
    // 关闭对话框时重置内容
    closeRevise() {
      // this.$refs.reviseRef.resetFields()
    },
    // 删除用户按钮
    async deleteBtn(all) {
      const test = await this.$confirm(
        '此操作将永久删除该用户信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
      console.log(test)
      if (test == 'confirm') {
        const res = await this.$http.delete(`users/${all}`)
        if (res.data.meta.status !== 200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
        this.getUserList()
        location.reload()
        console.log(res)
      }
    },
    // 角色分配按钮
    async setupBtn(all) {
      this.reviseList = all
      // 获取所有角色
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取成功')
      console.log(res)
      this.rolesList = res.data
      console.log(this.rolesList)
      this.setupVisible = true
    },
    // 点击确定按钮，分配角色
    async setupIstrue() {
      if (this.bindRolesList) {
        const { data: res } = await this.$http.put(
          `users/${this.reviseList.id}/role`,
          { rid: this.bindRolesList }
        )
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        this.$message.success('获取成功')
        console.log(res)
      }
      this.getUserList()
      this.setupVisible = false
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
.el-button {
  margin-left: 10px;
}
</style>
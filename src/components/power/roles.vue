<template>
  <div class="roles">
    <breadcrumb>
      <span slot="one">权限管理</span>
      <span slot="two">角色列表</span>
    </breadcrumb>
    <!-- 添加角色按钮 -->
    <el-card class="roles-card">
      <div class="roles_btn">
        <el-button type="primary" @click="addRoleBtn">添加角色</el-button>
        <el-dialog
          title="添加角色"
          :visible.sync="addRolesVisible"
          @close="addRolesClose"
        >
          <el-form
            label-width="80px"
            ref="addRolesRef"
            :model="addRolesList"
            :rules="addRolesRules"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addRolesList.roleName" type="text"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="addRolesList.roleDesc" type="text"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addRolesVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRolesIstrue">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <el-table :data="rolesList" border style="width: 100%" stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :gutter="20"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="[
                'bottomborder',
                index1 === 0 ? 'topboder' : '',
                'vcenter',
              ]"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5"
                ><el-tag
                  closable
                  type=""
                  @close="removeTag3(item1.id, scope.row)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'topboder', 'vcenter']"
                >
                  <el-col :span="8"
                    ><el-tag
                      closable
                      type="success"
                      @close="removeTag3(item2.id, scope.row)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <li class="el-icon-caret-right"></li>
                  </el-col>
                  <el-col :span="16"
                    ><el-tag
                      ref="removeTag"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeTag3(item3.id, scope.row)"
                    >
                      {{ item3.authName }}
                    </el-tag></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="">
        </el-table-column>
        <el-table-column label="操作" width="320px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="rolesReviseBtn(scope.row.id)"
              >编辑</el-button
            >
            <el-dialog
              title="修改角色"
              :visible.sync="rolesVisible"
              append-to-body
            >
              <el-form
                label-width="80px"
                :model="reviseRlesList"
                :rules="addRolesRules"
                ref="reviseRles"
              >
                <el-form-item label="角色名称" prop="roleName">
                  <el-input
                    type="text"
                    v-model="reviseRlesList.roleName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                  <el-input
                    type="text"
                    v-model="reviseRlesList.roleDesc"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="rolesVisible = false">取 消</el-button>
                <el-button
                  type="primary"
                  @click="rolesReviseIstrue(scope.row.id)"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row.id)"
              >删除
            </el-button>
            <!-- 权限分配按钮 -->

            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="rolesPowerBtn(scope.row)"
              >权限分配</el-button
            >
            <!-- 权限分配按钮弹窗 -->
            <el-dialog
              title="分配权限"
              :visible.sync="rolesPowerVisible"
              width="50%"
              @close="rolesPowerClose"
            >
              <el-tree
                :data="rolesPowerList"
                show-checkbox
                :props="rolesPowerProps"
                node-key="id"
                default-expand-all
                :default-checked-keys="defTreeKeys"
                ref="rolesPowerTree"
              >
              </el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="rolesPowerVisible = false">取 消</el-button>
                <el-button type="primary" @click="rolesPowerIstrue"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'
export default {
  name: 'roles',
  components: {
    breadcrumb,
  },
  created() {
    this.rolesGetList()
  },
  data() {
    return {
      rolesList: [],
      // 添加角色
      addRolesVisible: false,
      // 添加角色校验规则
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 4 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 添加按钮中的用户
      addRolesList: {
        roleName: '',
        roleDesc: '',
      },
      rolesVisible: false,
      // 编辑按钮中的角色查询
      reviseRlesList: {},
      rolesaddList: {},
      addrolesRules: {},
      // 权限分配按钮弹窗
      rolesPowerVisible: false,
      rolesPowerList: [],
      rolesPowerProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认选中的节点id值数组
      defTreeKeys: [],
      powerId: '',
    }
  },
  methods: {
    // 角色列表数据
    async rolesGetList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取成功')
      this.rolesList = res.data
      console.log(res)
    },
    // 添加角色按钮
    addRoleBtn() {
      this.addRolesVisible = true
    },
    // 关闭添加角色弹框重置内容
    addRolesClose() {
      this.$refs.addRolesRef.resetFields()
      this.addRolesList.roleDesc = ''
    },
    // 添加角色确定按钮
    async addRolesIstrue() {
      const { data: res } = await this.$http.post('roles', this.addRolesList)
      if (res.meta.status !== 201) return this.$message.error('创建失败')
      this.$message.success('创建成功')
      console.log(res)
      this.addRolesVisible = false
      this.rolesGetList()
    },
    // 编辑按钮功能
    async rolesReviseBtn(all) {
      this.rolesVisible = true
      console.log(all)
      const { data: res } = await this.$http.get(`roles/${all}`)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取成功')
      this.reviseRlesList = res.data
      console.log(this.reviseRlesList)
    },
    // 编辑确认按钮
    async rolesReviseIstrue(all) {
      this.$refs.reviseRles.validate(async (valid) => {
        if (!valid) return
        console.log(this.reviseRlesList)
        const { data: res } = await this.$http.put(
          `roles/${all}`,
          this.reviseRlesList
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        console.log(res)
        this.rolesVisible = false
        this.rolesGetList()
      })
    },
    // 删除按钮
    deleteRoles(all) {
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${all}`)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.rolesGetList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
      console.log(all)
    },
    // 展开下拉栏内容
    // 是否删除三级菜单
    removeTag3(rightId, role) {
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            role.children = res.data
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 权限分配按钮
    async rolesPowerBtn(ress) {
      this.powerId = ress.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      } else {
        this.$message.success('获取权限列表成功!')
      }
      this.rolesPowerList = res.data
      // 使用递归的形式调用三级节点内容
      this.recRolesPower(ress, this.defTreeKeys)
      console.log(this.defTreeKeys)
      this.rolesPowerVisible = true
      console.log(res)
    },
    // 封装一个递归函数
    recRolesPower(obj, all) {
      if (!obj.children) {
        return all.push(obj.id)
      }
      obj.children.forEach((item) => {
        this.recRolesPower(item, all)
      })
    },
    // 关闭权限分配重置数组
    rolesPowerClose() {
      this.defTreeKeys = []
    },
    // 角色授权提交
    async rolesPowerIstrue() {
      const key = [
        ...this.$refs.rolesPowerTree.getHalfCheckedKeys(),
        ...this.$refs.rolesPowerTree.getCheckedKeys(),
      ]
      console.log(this.powerId)
      // 请求的内容是一字符串拼接的方式
      const parm = key.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.powerId}/rights`,
        {
          rids: parm,
        }
      )
      if (res.meta.status !== 200) return this.$message.error('更新失败')
      this.$message.success('更新成功')
      this.rolesGetList()
      this.rolesPowerVisible = false
      console.log(res)
    },
  },
}
</script>

<style lang="less" scoped>
.roles_btn {
  text-align: left;
  .el-button {
    margin-bottom: 20px;
  }
}
.el-button {
  margin-left: 10px;
}
.el-card {
  margin-top: 10px;
}
.el-tag {
  margin: 10px 0;
}
.topboder {
  border-top: 1px solid rgb(238, 238, 238);
}
.bottomborder {
  border-bottom: 1px solid rgb(238, 238, 238);
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-tag {
  margin-left: 10px;
}
</style>
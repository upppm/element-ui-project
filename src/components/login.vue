<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="avatar" />
      </div>
      <!-- 登录区 -->
      <div>
        <el-form
          label-width="0px"
          class="login_form"
          :model="form"
          :rules="loginrules"
          ref="loginRef"
        >
          <!-- 账号区 -->
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model="form.username"
            ></el-input>
          </el-form-item>
          <!-- 密码区 -->
          <el-form-item prop="password">
            <el-input
              type="password"
              prefix-icon="el-icon-lock"
              v-model="form.password"
            ></el-input>
          </el-form-item>
          <!-- 按钮区 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="isTrue">登录</el-button>
            <el-button type="info" @click="reactLogin">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456',
      },
      // 表单验证规则对象
      loginrules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 4,
            max: 10,
            message: '长度在 4 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 4,
            max: 15,
            message: '长度在 4 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    isTrue() {
      this.$refs.loginRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.form)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    reactLogin() {
      this.$refs.loginRef.resetFields()
    },
  },
  open2() {
    this.$message({
      message: '恭喜你，这是一条成功消息',
      type: 'success',
    })
  },
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
  &_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      background-color: #fff;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  &_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
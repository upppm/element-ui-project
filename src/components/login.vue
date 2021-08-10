<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/man1.png" alt="avatar" />
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
    <div class="position">
      <div class="background1">
        <div class="background2"></div>
        <div class="box">
          <div class="bear"></div>
        </div>
      </div>
    </div>
    <div style="text-align: left">
      <input type="text" @input="inputMsee" v-bind:value="message" style="" />{{
        message
      }}
    </div>

    <!-- <div>{{ message }}</div> -->
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
      message: '我是双向绑定事件',
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
  created() {
    console.log(this.form)
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        console.log(i)
      }, 1000)
    }
  },
  methods: {
    inputMsee(event) {
      console.log(event)
      return (this.message = event.target.value)
    },
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
  background: url(../assets/imgbag1.jpg) no-repeat;
  background-size: 100%;
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
.position {
  position: relative;
  top: 75%;
}

.box {
  position: absolute;
  left: 0;
  top: 65px;
  animation: box 4s forwards;
}

.box .bear {
  height: 100px;
  width: 195.5px;
  background: url(../assets/bear.png);
  background-position: 0px 0px;
  animation: bear 0.7s steps(8) infinite;
}

@keyframes box {
  0% {
  }

  100% {
    left: 50%;
  }
}

@keyframes bear {
  0% {
  }

  100% {
    background-position: -1604px 5px;
  }
}

@keyframes bg1 {
  0% {
  }

  100% {
    background-position: -2100px;
  }
}

@keyframes bg2 {
  0% {
  }

  100% {
    background-position: -2100px;
  }
}

.background1 {
  position: relative;
  width: 100%;
  height: 175px;
  background: url(../assets/bg2.png);
  background-size: 1300px;
  animation: bg2 30s linear infinite;
}

.background1 .background2 {
  position: absolute;
  bottom: 0%;
  margin-bottom: -5px;
  width: 100%;
  height: 120px;
  background: url(../assets/bg1.png);
  background-size: 1400px;
  animation: bg1 18s linear infinite;
}
</style>
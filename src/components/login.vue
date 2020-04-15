<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="inputBox">
        <!-- label-width="80px" 指定form宽度-->
        <el-form ref="loginFormRef" :model="input" :rules="rules">
          <el-form-item prop="username">
            <el-input
              v-model="input.username"
              prefix-icon="iconfont icon-xingmingyonghumingnicheng"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="input.password"
              prefix-icon="iconfont icon-mima"
              type="password"
            >
            </el-input>
          </el-form-item>
          <div class="loginbtn">
            <el-button type="primary" @click="onSubmit('input')">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.input);
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        // 将登录成功之后的token保存到sessionStorage
        sessionStorage.setItem("token", res.data.token);
        this.$message.success("登录成功");
        this.$router.push("/home");
      });
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields();
      //   console.log(this);
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.inputBox {
  transform: translateY(-25%);
  width: 80%;
}
.avatar {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  box-sizing: border-box;
  transform: translateY(-50%);
  background: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.loginbtn {
  display: flex;
  justify-content: space-evenly;
}
</style>
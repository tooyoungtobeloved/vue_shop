<template>
  <el-container>
    <el-header>
      <div class="headLeft">
        <img src="../assets/logo.png" alt="logo" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="outLogin">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <h5>自定义颜色</h5>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
            <!-- <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>-->
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    outLogin() {
      console.log("退出登录");
      console.log(this);
      this.$message.success("退出成功");
      sessionStorage.clear();
      setTimeout(() => {
        this.$router.push("/login");
      }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #455a64;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .headLeft {
    color: #03a9f4;
    font-size: 1.2rem;
    font-weight: 1000;
    display: flex;
    align-items: center;
    img {
      max-width: 50px;
    }
  }
}
.el-container {
  background-color: #ff0;
  height: 100vh;
}
.el-aside {
  background-color: #0d47a1;
}
</style>

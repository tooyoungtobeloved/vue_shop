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
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="close" @click="changeClose">
          {{ isCollapse === true ? "|||" : "三" }}
        </div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#03a9f4"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="'/' + item.path"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveStatus('/' + subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList();
    this.activePath = sessionStorage.getItem("path");
  },
  data() {
    return {
      menuList: [],
      isCollapse: false,
      activePath: ""
    };
  },
  methods: {
    outLogin() {
      this.$message.success("退出成功");
      sessionStorage.clear();
      setTimeout(() => {
        this.$router.push("/login");
      }, 500);
    },
    saveStatus(path) {
      sessionStorage.setItem("path", path);
      this.activePath = path;
    },
    changeClose() {
      this.isCollapse = !this.isCollapse;
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
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
  background-color: #545c64;
  .close {
    color: #ffffff;
    text-align: center;
    cursor: pointer;
    letter-spacing: 0.2rem;
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: none;
}
</style>

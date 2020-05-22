<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
            <!-- 添加用户 -->
            <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="diagClose">
              <!-- 内容主题区域 -->
              <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <!-- 按钮区域 -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUser">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 修改用户信息 -->
            <el-dialog
              title="修改用户"
              :visible.sync="editDiaglogVisible"
              width="50%"
              @close="editFormClose"
            >
              <!-- 内容主题区域 -->
              <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                  <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <!-- 按钮区域 -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="editDiaglogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 分配角色信息 -->
            <el-dialog
              title="分配角色"
              :visible.sync="setRoleDiaglogVisible"
              width="50%"
              @close="resetRole"
            >
              <div>
                <p>当前的用户：{{ userinfo.username }}</p>
                <p>当前的角色：{{ userinfo.role_name }}</p>
                <p>
                  分配新角色：
                  <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option
                      v-for="role in roleList"
                      :key="role.id"
                      :label="role.roleName"
                      :value="role.id"
                    ></el-option>
                  </el-select>
                </p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDiaglogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRole()">确 定</el-button>
              </span>
            </el-dialog>
          </el-col>

          <!-- 用户列表 -->
          <el-table :data="userList" style="width: 100%" border stripe>
            <el-table-column type="index" label="索引"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态">
              <template v-slot="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  @change="userStateChange(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 修改 -->
                <el-tooltip class="item" content="修改" placement="top" :enterable="false">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    @click="showEditDiaglogVisible(scope.row)"
                  ></el-button>
                </el-tooltip>
                <!-- 删除 -->
                <el-tooltip class="item" content="删除" placement="top" :enterable="false">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    @click="deleteUser(scope.row.id)"
                  ></el-button>
                </el-tooltip>
                <!-- 分配 -->
                <el-tooltip class="item" content="分配" placement="top" :enterable="false">
                  <el-button
                    type="warning"
                    icon="el-icon-setting"
                    size="small"
                    @click="showSetRoleDiaglogVisible(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      var re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      var rules = new RegExp(re);
      if (!rules.test(value)) {
        return callback(new Error("邮箱格式不正确"));
      }
      callback();
    };
    var checkMobile = (rule, value, callback) => {
      var re = /^[1][3,4,5,7,8][0-9]{9}$/;
      var rules = new RegExp(re);
      if (!rules.test(value)) {
        return callback(new Error("手机号码格式不正确"));
      }
      callback();
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDiaglogVisible: false,
      setRoleDiaglogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editForm: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      userinfo: {},
      roleList: [],
      selectedRoleId: ""
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      this.total = res.data.total;
      this.userList = res.data.users;
    },
    // 监听pageSize改变 每页显示的数目
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.queryInfo.pagesize = pageSize;
      this.getUserList();
    },
    //监听页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStateChange(user) {
      const { data: res } = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("修改用户状态失败");
        user.mg_state = !user.mg_state;
      }
      this.$message.success("更新用户状态成功");
    },
    //关闭对话框时重置表单的数据
    diagClose() {
      this.$refs.addFormRef.resetFields();
    },
    //修改表单的预验证,通过ref拿到表单的引用对象验证
    saveUser() {
      this.$refs.addFormRef.validate(async validator => {
        //检验通过上传用户
        if (validator) {
          const { data: res } = await this.$http.post("users", this.addForm);
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg);
          }
          this.$message.success("添加用户成功");
          this.dialogVisible = false;
          this.getUserList();
        }
      });
    },
    showEditDiaglogVisible(rowInfo) {
      this.editForm.username = rowInfo.username;
      this.editForm.email = rowInfo.email;
      this.editForm.mobile = rowInfo.mobile;
      this.editForm.id = rowInfo.id;
      this.editDiaglogVisible = true;
    },
    editFormClose() {
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async validator => {
        if (validator) {
          const { data: res } = await this.$http.put(
            "/users/" + this.editForm.id,
            {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          );
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.editDiaglogVisible = false;
          this.getUserList();
          this.$message.success(res.meta.msg);
        }
      });
    },
    // 删除用户
    async deleteUser(id) {
      const result = await this.$confirm("是否确认删除该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      //返回值为字符串，确认为confirm,取消cancel
      if (result === "cancel") {
        return this.$message.info("已经取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getUserList();
    },
    // 显示分配权限的对话框
    async showSetRoleDiaglogVisible(userinfo) {
      this.userinfo = userinfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
      this.setRoleDiaglogVisible = true;
    },
    async setRole() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      const { data: res } = this.$http.put(`user/${this.userinfo.id}/role`, {
        rid: this.selectedRoleId
      });
      if (res.meta.status !== 200) return this.$message.error("分配权限角色");
      this.$message.success("分配角色成功");
      this.getUserList();
      this.showSetRoleDiaglogVisible = false;
    },
    // 重置角色对象
    resetRole() {
      this.selectedRoleId = "";
      this.userinfo = {};
    }
  }
};
</script>

<style lang="less" scoped>
</style>
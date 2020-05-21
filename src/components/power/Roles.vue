<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
        <el-col>
          <el-table :data="roleList" border>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 一级权限 -->
                <el-row
                  v-for="(item, index) in scope.row.children"
                  :key="item.id"
                  :class="['borderbottom', 'vcenter',index === 0 ? 'bordertop' : '']"
                >
                  <el-col :span="5">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item.id)"
                    >{{ item.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <!-- 二级权限 -->
                    <el-row
                      v-for="(item2, index2) in item.children"
                      :key="item2.id"
                      :class="[index2 === 0 ? '' : 'bordertop']"
                    >
                      <el-col :span="6">
                        <el-tag
                          type="success"
                          closable
                          @close="removeRightById(scope.row, item2.id)"
                        >{{ item2.authName }}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <!-- 三级权限 -->
                        <el-tag
                          v-for="item3 in item2.children"
                          :key="item3.id"
                          type="warning"
                          closable
                          @close="removeRightById(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-setting"
                  @click="showSetRightDialog(scope.row)"
                >分配</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="closedialog">
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defNodes"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList();
  },
  data() {
    return {
      dialogVisible: false,
      roleList: [],
      //   所有权限的数据
      rightList: [],
      treeProps: {
        children: "children",
        label: "authName"
      },
      defNodes: [],
      roleId: ""
    };
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.roleList = res.data;
    },
    removeRightById(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then(function(data) {
              const { data: res } = data;
              console.log(res);
              if (res.meta.status != 200) {
                return this.$message.error("删除权限失败");
              }
              role.children = res.data;
              //   通过数据的重新赋值 不刷新页面移除权限
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("/rights/tree");
      if (res.meta.status != 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.rightList = res.data;
      this.getLeafNodes(role, this.defNodes);

      this.dialogVisible = true;
    },
    // 递归获取子节点的id
    getLeafNodes(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.map(item => {
        this.getLeafNodes(item, arr);
      });
    },
    // 保存分配的权限
    async allowRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes()
      ].join(",");
      const {
        data: res
      } = await this.$http.post(`/roles/${this.roleId}/rights`, { rids: keys });
      if (res.meta.status !== 200) return this.$message.error("分配权限失败");
      this.$message.success("分配权限成功");
      this.getRoleList();
      this.dialogVisible = false;
    },
    closedialog() {
      console.log(this.defNodes);
      this.defNodes = [];
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.bordertop {
  border-top: 1px solid #eee;
}
.borderbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

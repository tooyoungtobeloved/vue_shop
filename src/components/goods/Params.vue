<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关的参数！" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品分类的区域 -->
      <el-row class="catgro">
        <el-col>
          <span class="word">请选择商品分类</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name'
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="setAddPropVisible">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialog(scope.row.attr_id)"
                  >编辑
                </el-button>
                <el-button type="danger" icon="el-icon-edit" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="setAddPropVisible">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-edit"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      center
      @close="closeDialog"
    >
      <el-form :model="addProp" :rules="addPropRules" ref="addPropFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addProp.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setProp">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数/属性的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      center
      @close="closeEditDialog"
    >
      <el-form :model="editProp" :rules="editPropRules" ref="editPropFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editProp.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPropDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表 => 级联选择框的渲染的数据源
      cateList: [],
      // 级联选择框选择到的值
      selectedCateKeys: [],
      // 被激活页签的名称
      activeName: "many",
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 添加属性的对话框
      addDialogVisible: false,
      addProp: {
        attr_name: ""
      },
      addPropRules: {
        attr_name: [{ required: true, message: "请输入参数的名称", trigger: "blur" }]
      },
      editDialogVisible: false,
      editProp: {
        attr_name: ""
      },
      editPropRules: {
        attr_name: [{ required: true, message: "请输入参数的名称", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有的商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cateList = res.data;
    },
    // 级联选择框变化触发的函数
    handleChange() {
      // 选中的不是三级分类
      this.getParamsData();
    },
    // Tab页签点击事件的处理函数
    handleTabClick() {
      // console.log(this.activeName);
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        this.$message.error("请选择三级分类");
        return;
      }
      // 根据所选分类的ID,和当前所处的面板,获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      res.data.map(item => {
        // item.attr_vals == "" ? [] : item.attr_vals.split(" ");
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputTagValue = "";
      });
      // console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 点击显示添加属性的对话框
    setAddPropVisible() {
      this.addDialogVisible = true;
    },
    // 关闭对话框的回调函数
    closeDialog() {
      this.$refs.addPropFormRef.resetFields();
    },
    // 确定添加的处理函数
    setProp() {
      this.$refs.addPropFormRef.validate(async valida => {
        if (!valida) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addProp.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功!");
      });
      this.getParamsData();
      this.addDialogVisible = false;
    },
    // 显示修改的对话框
    async editDialog(attr_id) {
      // 查询最新的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取参数信息失败！");
      this.editProp = res.data;
      this.editDialogVisible = true;
    },
    // 关闭修改对话框的处理
    closeEditDialog() {
      this.$refs.editPropFormRef.resetFields();
      this.editProp = {};
    },
    // 点击确定修改对话框
    editPropDialog() {
      this.$refs.editPropFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editProp.attr_id}`,
          {
            attr_name: this.editProp.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) return this.$message.error("修改参数失败");
        this.$message.success("修改参数成功");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // 删除参数操作
    async removeParams(attr_id) {
      const result = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (result !== "confirm") return this.$message.info("已取消删除");
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除参数失败");
      this.$message.success("删除参数成功");
      this.getParamsData();
    },
    handleInputConfirm(row) {
      if (row.inputTagValue.trim().length === 0) {
        row.inputTagValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputTagValue.trim());
      row.inputTagValue = "";
      this.saveParams(row);
      row.inputVisible = false;
    },
    // 保存参数对应的标签
    async saveParams(row) {
      // 发起请求， 保持这次操作
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数失败！");
      }
      this.$message.success("修改参数成功");
    },
    // 按钮与输入框的切换
    showInput(row) {
      row.inputVisible = true;
      // 当页面被重新渲染
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveParams(row);
    }
    // 标签的删除事件
  },
  computed: {
    // 如果按钮需要被禁用返回true 否则返回false
    isBtnDisabled() {
      return this.selectedCateKeys.length !== 3;
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>

<style lang="less" scope>
.catgro {
  margin: 15px 0px;
}
.word {
  margin-right: 20px;
}
.el-table {
  margin-top: 20px !important;
}
.el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 90px !important;
  margin-left: 10px;
  vertical-align: bottom;
}
.button-new-tag {
  margin-left: 10px !important;
}
</style>

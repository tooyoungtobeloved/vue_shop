<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 渲染数据表格 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="95px"
        ></el-table-column>
        <el-table-column label="是否付款" width="80px">
          <template v-slot="scope">
            <el-tag
              type="danger"
              v-if="scope.row.pay_status === '0'"
              size="mini"
            >
              未付款
            </el-tag>
            <el-tag type="primary" v-else size="mini">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="160px">
        </el-table-column>
        <el-table-column label="下单时间" width="160px">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog"
            >
            </el-button>
            <el-tooltip
              effect="dark"
              content="物流详情"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showProgressBox()"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 编辑的对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="dialogVisible"
        width="30%"
        @close="dialogClose"
      >
        <el-form
          :model="addressForm"
          label-width="100px"
          :rules="addressFormRules"
          ref="addressFormRef"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              :props="{ expandTrigger: 'hover' }"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <!-- 显示进度的对话框 -->
      <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
        <span>无物流信息 未使用时间线组件</span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      orderList: [],
      dialogVisible: false,
      addressForm: {
        address1: "",
        address2: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请输入省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      cityData,
      progressVisible: false,
      progressInfo: ""
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败");
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    // 页面条数变化的处理
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getOrderList();
    },
    // 页数发生变化的回调
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum;
      this.getOrderList();
    },
    showEditDialog() {
      this.dialogVisible = true;
    },
    dialogClose() {
      this.$refs.addressFormRef.resetFields();
    },
    async showProgressBox() {
      // const { data: res } = await this.$http.get("/kuaidi/804909574412544580");
      // if (res.meta.status !== 200) return this.$message.error("获取物流信息败");
      // this.progressInfo = res.data;
      // console.log(this.progressInfo);
      this.progressVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
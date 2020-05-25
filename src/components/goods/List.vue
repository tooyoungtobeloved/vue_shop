<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <!-- 搜索部分 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="closeQuery"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsListByQuery"
            >
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表数据表格 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" width="160px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        hide-on-single-page
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 3
      },
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryinfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败!");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      this.$message.success("获取商品列表成功！");
    },
    handleSizeChange(newPageSize) {
      this.queryinfo.pagesize = newPageSize;
      this.getGoodsList();
    },
    handleCurrentChange(newCurrentPage) {
      this.queryinfo.pagenum = newCurrentPage;
      this.getGoodsList();
    },
    getGoodsListByQuery() {
      if (this.queryinfo.query === "")
        return this.$message.error("请输入搜索关键字");
      this.getGoodsList();
    },
    closeQuery() {
      this.queryinfo.pagenum = 1;
      this.getGoodsList();
    },
    // 删除商品
    removeById(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`);
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.$message.success("删除成功");
          this.getGoodsList();
        })
        .catch(() => {
          this.$message.info("已经取消删除");
        });
    },
    // 添加商品
    addGoods() {
      this.$router.push("goods/add");
    }
  }
};
</script>

<style lang="less" scoped>
</style>
// 客户列表管理
<template>
  <div class="app-container">
    <el-form
      :model="advSearch"
      class="adv-search"
      label-width="100px"
      label-position="right"
      ref="advSearch"
    >
      <el-row >
        <el-col :sm="9" :lg="5">
          <el-form-item label="用户名">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="9" :lg="5">
          <el-form-item label="手机号码">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :sm="9" :lg="5">
          <el-form-item prop="time" label="注册时间">
            <el-date-picker
              v-model="advSearch.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :sm="9" :lg="5">
          <el-form-item label="角色类型">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="9" :lg="5">
          <el-form-item label="就读学校">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="9" :lg="5">
          <el-form-item label="">
            <el-button type="primary" @click="getCustomerList">查询</el-button>
            <el-button
              type="primary"
              class="reset"
              @click="$refs.advSearch.resetFields()"
              >重置</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      :data="customerList"
      :cell-style="tableStyle.body"
      :header-cell-style="tableStyle.header"
      class="table"
    >
      <el-table-column prop="" label="头像"></el-table-column>
      <el-table-column prop="" label="用户名"></el-table-column>
      <el-table-column prop="" label="手机号码"></el-table-column>
      <el-table-column prop="" label="角色类型"></el-table-column>
      <el-table-column prop="" label="就读阶段"></el-table-column>
      <el-table-column prop="" label="就读学校"></el-table-column>
      <el-table-column prop="" label="留学意向国"></el-table-column>
      <el-table-column prop="" label="英语语言成绩"></el-table-column>
      <el-table-column prop="" label="英语测试结果"></el-table-column>
      <el-table-column prop="" label="是否签订合同"></el-table-column>
      <el-table-column prop="" label="注册时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="primary" @click="onEdit(scope.$index)">编辑</el-link>
          <el-link class="orange">查看</el-link>
          <el-link type="success">跟踪</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex-center row" style="height: 60px">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="page.total"
        :page-size="page.size"
        :current-page.sync="page.number"
        @current-change="handleCurrentChange"
      >
      </el-pagination>

      <el-dialog :visible.sync="showDialog">
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="onConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import table from "@/mixins/table";
export default {
  data() {
    const that = this;
    return {
      advSearch: {
        // 高级查询表单
        time: "",
        startTime: "",
        endTime: "",
      },

      form: {
        // 编辑客户弹框表单
      },

      customerList: [], // 客户列表

      page: {
        // 分页相关
        total: 1,
        size: 8,
        number: 1,
      },

      showDialog: false,
    };
  },
  watch: {
    "advSearch.time": function (time) {
      this.advSearch.startTime = time[0];
      this.advSearch.endTime = time[1];
    },
  },
  mixins: [table],
  methods: {
    // 分页 切换页面
    handleCurrentChange(curr) {
      this.page.number = curr;
      this.getCustomerList();
    },

    // 获取客户列表
    getCustomerList() {},

    // “编辑客户”弹框 “确认”按钮点击事件处理函数
    onConfirm() {},

    onEdit(index) {
      const customer = this.customerList[index];
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.orange {
  background-color: #F7931E;
  border-color: #F7931E;
  color: #FFFFFF;
}

.row {
  display: flex;
}

// 表格上方高级查询覆盖默认样式
.adv-search {
  .reset {
    background: #fff;
    color: #4381E6;
    border-color: #4381E6;
  }

  ::v-deep .el-input {
    width: 240px;
  }
  ::v-deep .el-form-item__label::after {
    content: ":";
  }
}


.table {
  // 表头字体
  ::v-deep  th {
    font-size: 16px !important;
  }
}
</style>
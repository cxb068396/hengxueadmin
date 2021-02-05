<template>
  <div class="app-container">
    <el-form :model="advSearch" inline class="adv-search" ref="advSearch" label-suffix=":">
      <el-row>
        <el-form-item prop="username" label="操作人">
          <el-input v-model="advSearch.username" placeholder="请输入" class="" clearable></el-input>
        </el-form-item>
        <el-form-item prop="time" label="操作日期">
          <el-date-picker
            v-model="advSearch.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="select">查询</el-button>
        <el-button type="primary" class="reset" @click="onReset">重置</el-button>
        <el-button class="orange" @click="removeLog" v-permission="'del_logs'">批量清除</el-button>
      </el-row>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      :data="operations"
      @selection-change="handleSelectionChange"
      :row-style="tableStyle.rowStyle"
      :cell-style="tableStyle.body"
      :header-cell-style="tableStyle.header"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="username" label="操作者"></el-table-column>
      <!-- :formatter="timeFormatter" -->
      <el-table-column
        prop="create_time"
        label="创建时间"      
      ></el-table-column>
      <el-table-column prop="ip" label="IP地址"></el-table-column>
      <el-table-column prop="content" label="操作记录"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="primary" @click="removeLogs(scope.row)" v-permission="'del_logs'">清除日志</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex-center row" style="height: 60px">
      <el-pagination
        :page-size="pagesize"
        layout="prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :total="count"
      ></el-pagination>
      <!-- <el-button type="primary" @click="handleSelectionChange">确定</el-button><br> -->
    </div>
    <div class="pag-bottom" v-if="count>0">共{{count}}条记录  第{{currentPage}}/{{Math.ceil(count/10)}}页</div>
    <div class="pag-bottom" v-else>共{{count}}条记录  第{{currentPage}}/1页</div>
  </div>
</template>

<script>
import table from "@/mixins/table";
import { getLogs, delLogs } from "@/api/sys/role";
export default {
  data() {
    const that = this;
    return {
      search: "",
      operations: [], // 操作日志列表
      advSearch: {
        // 高级查询表单
        username: "",
        time: "",
        date_start: "",
        date_end: ""
      },
      selected: [], // 表格选中行的id
      total: 0,
      pagesize: 10, //每页多少数据
      currentPage: 1, //默认当前页为第一页(初始页)
      count: 0,
    };
  },
  watch: {
    "advSearch.time": function(time) {
      if (!time) {
        this.advSearch.date_start = "";
        this.advSearch.date_end = "";
      } else {
        this.advSearch.date_start = time[0];
        this.advSearch.date_end = time[1];
      }
    }
  },
  mixins: [table],
  created() {
    this.getLogs();
  },
  methods: {
    //  操作日志接口
    getLogs() {
      const { username, date_start, date_end } = this.advSearch;
      getLogs(this.currentPage - 1, this.pagesize, username, date_start, date_end)
        .then(res => {
          this.operations = res.mes.list;
          this.count = res.mes.count;
        })
        .catch(err => {
          console.log(err);
          if(err.code === '400'){
            this.$message({type: 'error',message: err.mes})
          }
        });
    },

    // 重置高级查询表单
    onReset() {
      this.$refs.advSearch.resetFields()
      this.getLogs();
    },

    // 获取操作日志列表数据
    select() {
      const search = this.search;
      console.log(search);
      this.getLogs();
    },

    // 分页
    handleCurrentChange(pageNumber) {
      this.page.number = pageNumber;
      this.getOperationsList();
    },

    // 批量删除
    removeLog(index) {
      var that = this;
      delLogs(that.selected)
        .then(res => {
          this.getLogs();
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 点击删除单个
    removeLogs(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var that = this;
          delLogs(row.id)
            .then(res => {
              this.getLogs();
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },

    // 表格复选框选中事件处理，参数是当前仍然选中的行，
    // 未有任何选中时的返回是空数组
    handleSelectionChange(selected) {
      // console.log(val);
      this.selected = selected.map(row => row.id).join();
      console.log(this.selected);
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.getLogs();
      console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      //改变当前页
      this.currentPage = currentPage;
      this.getLogs();
      console.log(this.currentPage);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";

.orange {
  background-color: #f7931e;
  border-color: #f7931e;
  color: #ffffff;
}
.pag-bottom{
  width: 100%;
  font-size: 8px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  text-align: center;
  display: block;
  margin-top: 5px;
}
</style>

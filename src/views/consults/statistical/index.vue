咨询管理
<template>
  <div class="app-container">
    <!-- 高级查询 -->
    <el-form inline :model="advSearch" label-suffix=":">
      <el-form-item label="筛选">
        <el-radio-group v-model="advSearch.time">
          <el-radio-button :label="0">今天</el-radio-button>
          <el-radio-button :label="1">最近7天</el-radio-button>
          <el-radio-button :label="2">最近30天</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="顾问">
        <el-input placeholder="请输入" clearable v-model="advSearch.name"></el-input>
      </el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="initAdvSearch">重置</el-button>
    </el-form>
    <!-- 数据表格 -->
    <el-table :cell-style="tableStyle.body" :header-cell-style="tableStyle.header" :data="list">
      <!-- <el-table-column type="selection"></el-table-column> -->
      <el-table-column prop="username" label="顾问"></el-table-column>
      <el-table-column prop="conversation_count" label="总会话数"></el-table-column>
      <el-table-column prop="effective_conversation_count" label="有效会话数"></el-table-column>
      <el-table-column prop="average_respone_time" label="平均首次响应时长"></el-table-column>
      <el-table-column prop="conversation_time" label="平均响应时长"></el-table-column>
      <!-- <el-table-column prop="" label="主动发起会话数量"></el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <div class="flex-center row" style="height: 60px">
      <pagination :page.sync="page" @pagination="onPagination"></pagination>
    </div>
  </div>
</template>

<script>
import table from "@/mixins/table";
import { getStatistical } from "@/api/consult.js";

export default {
  data() {
    return {
      advSearch: {
        time: "",
        name: "",
      },
      list: []
    };
  },

  mixins: [table],
  created() {
    this.initAdvSearch();
    const name = this.$route.query.name
    this.advSearch.name = name?name: ''
    this.getList()

    // console.log(this.$route)
  },
  methods: {
    // 初始化高级查询表单
    initAdvSearch() {
      this.advSearch = {
        time: 0,
        name: "",
      };
      this.page.number = 1
      this.getList()
    },
    // 重置高级查询
    resetAdvSearch() {},

    search(){
      this.getList()
    },

    // 获取咨询列表数据
    async getList() {
      try {
        const res = await getStatistical({
          ...this.advSearch,
          page: this.page.number - 1,
          strip: this.page.size
        });
        this.list = res.mes.customer_service
        this.page.total = res.mes.total
      } catch (err) {
        console.log(err)
      }
    },
    // 分页
    onPagination(page) {
      this.page = page;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";
</style>

// 咨询管理
<template>
  <div class="app-container container" :style="`overflow: ${showChatWin?'hidden':'scroll'}`">
    <!-- 高级查询 -->
    <el-form inline :model="advSearch" label-suffix=":">
      <el-form-item label="筛选">
        <el-radio-group v-model="advSearch.time" @change="getList">
          <el-radio-button :label="0">今天</el-radio-button>
          <el-radio-button :label="1">最近7天</el-radio-button>
          <el-radio-button :label="2">最近30天</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户&顾问">
        <el-input placeholder="请输入" clearable v-model="advSearch.name"></el-input>
      </el-form-item>
      <el-button type="primary" @click="getList">查询</el-button>
      <el-button @click="initAdvSearch">重置</el-button>
    </el-form>

    <!-- 数据表格 -->
    <el-table :cell-style="tableStyle.body" :header-cell-style="tableStyle.header" :data="list">
      <el-table-column prop="name" label="客户名"></el-table-column>
      <el-table-column prop="username" label="接待顾问">
        <template slot-scope="scope">
          <el-link type="primary" @click="toGuwen(scope.row.username)">{{scope.row.username}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="create_at" label="会话开始时间"></el-table-column>
      <el-table-column prop="source" label="来源终端">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.source === 1">web</el-tag>
          <el-tag v-if="scope.row.source === 2">app</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="source_page" label="来源页面"></el-table-column>
      <el-table-column prop="ip" label="客户IP地址"></el-table-column>
      <!-- <el-table-column prop="satisfaction" label="满意度">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.satisfaction === 1">满意</el-tag>
          <el-tag v-if="scope.row.satisfaction === 2">不满意</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">已处理</el-tag>
          <el-tag v-if="scope.row.status === 2">未处理</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- v-permission="'conversation_history'" -->
          <el-link type="primary" @click="showConsult(scope.$index)" >查看</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex-center row" style="height: 60px">
      <pagination :page.sync="page" @pagination="onPagination"></pagination>
    </div>

    <!-- 聊天窗口 -->
    <!-- :member="member"
      :access-info="accessInfo" -->
    <chat-window :visible.sync="showChatWin"></chat-window>
  </div>
</template>

<script>
import table from "@/mixins/table";
import ChatWindow from "./ChatWindow";
import { getHistories, getHistoryDetail } from "@/api/consult.js";

import store from "../store";
export default {
  data() {
    return {
      advSearch: {
        time: 0
      },
      list: [],
      histories: null, // 聊天历史

      showChatWin: false, // 控制显示咨询窗口
      store,
      sendInfo: null
    };
  },
  components: { ChatWindow },
  mixins: [table],
  created() {
    this.initAdvSearch();
    // this.getList();
  },
  methods: {
    // 初始化高级查询
    initAdvSearch() {
      this.advSearch = {
        time: 0,
        name: ""
      };
      this.page.number = 1
      this.getList()
    },

    // 后台绑定client_id
    bindClientId(id) {
      bindClientId(id)
        .then(res => {
          this.sendInfo = res;
          this.store.setSendOpt(res);
          // console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取咨询列表数据
    async getList() {
      try {
        const res = await getHistories({
          ...this.advSearch,
          page: this.page.number - 1,
          strip: this.page.size
        });
        this.list = res.mes.conversation;
        this.page.total = res.mes.total;
      } catch (err) {
        console.log(err);
      }
    },

    // 分页
    onPagination(page) {
      this.page = page;
      this.getList();
    },

    toGuwen(name){
      this.$router.push(`/consults/statistical?name=${name}&from=consults/conversation_history`)
    },

    // 查看 点击事件处理函数
    showConsult(index) {
      let id = this.list[index].id;
      getHistoryDetail(id)
        .then(res => {
          this.store.setMember(res.mes.member);
          this.store.setAccessInfo(res.mes.conversation);
          this.store.setRecord(res.mes.conversation_record);
          this.store.setUser(res.mes.user);
          this.showChatWin = true;
        })
        .catch(err => {
          console.log(err);
        });
      // this.showChatWin = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";
.container {
  position: relative;
  height: calc(100vh - 84px);
}
</style>

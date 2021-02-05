咨询管理
<template>
  <div class="app-container container" :style="`overflow: ${showChatWin?'hidden':'scroll'}`"> 
    <el-form inline :model="advSearch">
      <el-form-item label="筛选:">
        <el-radio-group v-model="advSearch.time" @change="getConsultList">
          <el-radio-button :label="0">今天</el-radio-button>
          <el-radio-button :label="1">最近7天</el-radio-button>
          <el-radio-button :label="2">最近30天</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="advSearch.status">
          <el-option :value="0" label="全部"></el-option>
          <el-option :value="1" label="已处理"></el-option>
          <el-option :value="2" label="未处理"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getConsultList">查询</el-button>
      <el-button @click="resetAdvSearch">重置</el-button>
    </el-form>
    <el-table
      :cell-style="tableStyle.body"
      :header-cell-style="tableStyle.header"
      :data="consultList"
    >
      <el-table-column prop="name" label="咨询者"></el-table-column>
      <el-table-column prop="last_message" label="咨询内容"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="qq" label="QQ"></el-table-column>
      <el-table-column prop="source" label="来源终端">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.satisfaction === 1">web</el-tag>
          <el-tag v-if="scope.row.satisfaction === 2">app</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_at" label="咨询时间"></el-table-column>
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

    <div class="flex-center row" style="height: 60px">
      <pagination :page.sync="page" @pagination="onPagination"></pagination>
    </div>
    <chat-window :visible.sync="showChatWin" v-if="showChatWin"></chat-window>
  </div>
</template>

<script>
import table from "@/mixins/table";
import ChatWindow from "./ChatWindow";
import { getConsultList, getHistoryDetail, bindClientId } from "@/api/consult.js";
import store from "../store.js";
import wsocket from "@/utils/ws.js";
export default {
  data() {
    return {
      advSearch: {
        time: 0, // time: 0昨天 1最近七天 2最近三十天
        status: 0
      },
      consultList: [], // 咨询列表数据
      showChatWin: false, // 控制显示咨询窗口
      store
    };
  },
  components: { ChatWindow },
  mixins: [table],
  created() {
    this.getConsultList();
    wsocket.initWebSocket("", msg => {
      // console.log(msg.data);
      let data = JSON.parse(msg.data);
      if (data.type === "init") {
        this.bindClientId(data.client_id);
      }
    });
    this.store.setWs(wsocket.$ws);
  },
  methods: {
    // 重置高级查询
    resetAdvSearch() {
      this.advSearch = {
        time: 0,
        status: 0
      };
      this.page.number = 1
      this.getConsultList()
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
    async getConsultList() {
      try {
        const res = await getConsultList({
          ...this.advSearch,
          page: this.page.number - 1,
          strip: this.page.size
        });
        this.consultList = res.mes.conversation;
        this.page.total = res.mes.total;
      } catch (err) {
        console.log(err);
      }
    },

    // 分页
    onPagination(page) {
      this.page = page;
      this.getConsultList();
    },

    showConsult(index) {
      let id = this.consultList[index].id;
      getHistoryDetail(id)
        .then(res => {
          this.store.setMember(res.mes.member);
          this.store.setAccessInfo(res.mes.conversation);
          this.store.setRecord(res.mes.conversation_record);
          this.store.setUser(res.mes.user);
          this.store.setConsultId(id)
          this.showChatWin = true;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";

.container {
  position: relative;
  height: calc(100vh - 84px);
  overflow: scroll;
}
</style>

// 咨询聊天窗口
<template>
  <div class="app-container chat-container" v-if="visible">
    <div class="header flex-between">
      <div>咨询聊天窗口</div>
      <i class="close-icon el-icon-circle-close" @click="onClose" />
    </div>
    <div class="body flex-fill">
      <!-- 左边 -->
      <div class="left">
        <div class="query-area flex-center">
          <div class="query flex-start">
            <i class="magnifier el-icon-search" />
            <input class="query_input" type="text" placeholder="请输入" v-model="name" />
            <!-- <el-input class="query_input" placeholder="请输入" v-model="name" clearable=""></el-input> -->
            <button class="query_button">查询</button>
          </div>
        </div>

        <!-- 咨询者列表 -->
        <div class="consult-list scroll-bar">
          <template v-for="(item, index) in consultList">
            <consult-list-item
              :class="`${selectedInd === index ? 'active' : ''}`"
              :key="item.id"
              :consult-info="item"
              :index="index"
              @clicked="
                index => {
                  selectedInd = index;
                }
              "
            ></consult-list-item>
          </template>
        </div>

        <div class="tip c-999" v-if="total > 0">当前接待人数：{{ total }}人</div>
      </div>

      <!-- 中间 -->
      <div class="middle flex-start column">
        <div class="chat-history flex-1 flex-start column scroll-bar">
          <!-- consult 咨询者 replyer 回复者 -->
          <template v-for="item in record">
            <!-- eslint-disable-next-line  -->
            <div class="time-row">
              <span>{{ item.create_at }}</span>
            </div>
            <!-- eslint-disable-next-line  -->
            <replay-mes
              :avatar="user.picture"
              :content="item.content"
              v-if="item.send_type == 1"
            ></replay-mes>
            <!-- eslint-disable-next-line  -->
            <consult-mes :avatar="member.image" :content="item.content" v-else></consult-mes>
          </template>
        </div>

        <div class="toolbar flex-between">
          <div class="left-tool">
            <emoji-picker
              v-if="showEmojiPicker"
              :include="['people']"
              :showSearch="false"
              :showPreview="false"
              :showCategories="false"
              @select="addEmoji"
              class="emoji-pop"
              style="height: 288px;position: absolute;bottom: -116px;left: -20px;"
            ></emoji-picker>
            <!-- <img
              src="@/assets/icon/icon-4.png"
              alt=""
              class="tool-icon"
              @click="showEmojiPicker = !showEmojiPicker"
            /> -->
            <svg-icon
              icon-class="hx-icon-emoji"
              class="tool-icon"
              @click="showEmojiPicker = !showEmojiPicker"
              :style="`color: ${showEmojiPicker ? '#6486FF' : '#999999'}`"
            ></svg-icon>
            <!-- <img src="@/assets/icon/icon-2.png" alt="" class="tool-icon" />
            <img src="@/assets/icon/icon-1.png" alt="" class="tool-icon" />
            <img src="@/assets/icon/icon-3.png" alt="" class="tool-icon" /> -->
          </div>
          <div class="right-tool">
            <!-- <img src="@/assets/icon/icon-6.png" alt="" class="tool-icon" />
            <img src="@/assets/icon/icon-5.png" alt="" class="tool-icon" /> -->
            <div class="btn-send" @click="send">
              发送
            </div>
          </div>
        </div>
        <!-- <div contenteditable class="input">请输入您的回复</div> -->
        <textarea v-model="sendMessage" class="input" placeholder="输入信息后回车发送"></textarea>
      </div>

      <!-- 右边 -->
      <div class="right flex-start column">
        <div class="title ma-bt-16">个人信息</div>
        <img :src="member.image ? member.image : defaultAvatar" class="avatar" alt="" />
        <div class="username ma-bt-16 c-333 font-16">
          {{ member.name ? member.name : "游客" }}
        </div>
        <template v-if="member.name">
          <div style="width: 244px;">
            <div class="ma-b-16">
              <span class="label">真实姓名：</span>
              <span class="content">{{ member.name }}</span>
            </div>
            <div class="ma-b-16">
              <span class="label">年龄：</span>
              <span class="content">{{ member.age }}</span>
            </div>
            <div class="ma-b-16">
              <span class="label">手机号码：</span>
              <span class="content">{{ member.phone }}</span>
            </div>
            <div class="ma-b-16">
              <span class="label">邮箱：</span>
              <span class="content">{{ member.email }}</span>
            </div>
            <div class="ma-b-16">
              <span class="label">就读阶段：</span>
              <span class="content">{{ member.stage }}</span>
            </div>
            <!-- <div class="ma-b-16">
              <span class="label">QQ：</span>
              <span class="content">1062269958</span>
            </div> -->
          </div>
        </template>
        <!-- <template></template> -->
        <textarea class="textarea" v-if="member.name">留言备注</textarea>
        <!-- <div class="constumer-status ma-t-16">已保存到客户列表</div> -->
        <div class="title ma-bt-16">访问信息</div>
        <div style="width: 244px;">
          <div class="ma-b-16">
            <span class="label">IP地址：</span>
            <span class="content">{{ accessInfo.ip }}</span>
          </div>
          <div class="ma-b-16">
            <span class="label">来源终端：</span>
            <span class="content" v-if="accessInfo.source === 1">Web端</span>
            <span class="content" v-else-if="accessInfo.source === 2">App端</span>
          </div>
          <div class="ma-b-16">
            <span class="label">会话页：</span>
            <span class="content">{{ accessInfo.source_page }}</span>
          </div>
          <div class="ma-b-16">
            <span class="label">着陆页：</span>
            <span class="content">{{ accessInfo.first_page }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHistoryDetail, send, queryConsult } from "@/api/consult.js";
import { Picker } from "emoji-mart-vue"; //引入组件
import store from "../store";
import mixin from "../mixin";

export default {
  components: { "emoji-picker": Picker },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      selectedInd: 0, // 点击选中的咨询者索引，默认为0
      consultList: [], // 左侧咨询者列表,
      store,
      sendMessage: "", // 要发送的消息
      name: "",
      total: 0,
      showEmojiPicker: false
    };
  },
  computed: {
    sendOpt() {
      return this.store.state.sendOpt;
    },
    ws() {
      return this.store.state.ws;
    },
    consultId() {
      return this.store.state.consultId;
    }
  },
  watch: {
    selectedInd: function(index) {
      const id = this.consultList[index].id;
      getHistoryDetail(id)
        .then(res => {
          this.store.setMember(res.mes.member);
          this.store.setAccessInfo(res.mes.conversation);
          this.store.setRecord(res.mes.conversation_record);
          this.store.setUser(res.mes.user);
        })
        .catch(err => {
          console.log(err);
        });
    },
    consultId: function(id) {
      this.consultList.forEach((n, i) => {
        if (n.id == id) {
          this.selectedInd = i;
        }
      });
    }
  },
  created() {
    this.consultList = [];
    this.queryConsult();
    this.ws.onmessage = msg => {
      const data = JSON.parse(msg.data);
      if (data.type === "send") {
        this.record.push({
          send_type: 2,
          content: data.message
        });
      }
    };
  },
  mounted() {},
  mixins: [mixin],
  methods: {
    // 查询咨询者列表
    queryConsult() {
      queryConsult(this.name)
        .then(res => {
          // console.log(res);
          this.total = res.total;
          this.consultList = res.conversation;
          this.consultList.forEach((n, i) => {
            if (n.id == this.consultId) {
              this.selectedInd = i;
            }
          });
        })
        .catch(err => {});
    },
    onClose() {
      this.$emit("update:visible", false);
    },
    send() {
      if (!this.sendMessage.trim()) {
        this.$message({ type: "error", message: "请输入有效信息" });
        return;
      }
      const data = {
        uid: this.sendOpt.uid,
        to_uid: this.accessInfo.uniqid,
        message: this.sendMessage
      };
      send(data)
        .then(res => {
          this.record.push({
            send_type: 1,
            content: this.sendMessage
          });
          this.sendMessage = "";
        })
        .catch(err => {});
      // this.store.state.ws(JSON.stringify(data));
    },
    addEmoji(e) {
      this.sendMessage += e.native;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";
@import "~@/assets/styles/chatwin.scss";

.chat-container {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;

  background: #f4f4f4;
  height: 100%;
  width: 100%;
}

.middle {
  .chat-history {
    max-height: 580px;
  }
}

.left {
  border-radius: 0px 0 0 16px;
  background: #fff;
  position: relative;
  .tip {
    margin: 24px auto;
    text-align: center;
  }

  .query-area {
    height: 76px;
    background: #fff;
    .query {
      width: 276px;
      height: 36px;
      border: 1px solid #4381e6;
      border-radius: 18px;
      overflow: hidden;
    }
    .magnifier {
      color: #4381e6;
      font-size: 18px;
      margin-left: 14px;
      margin-right: 10px;
    }
    .query_button {
      width: 60px;
      height: 100%;
      border: none;
      color: #fff;
      box-shadow: none;
      background: #4381e6;
    }
    .query_input {
      flex: 1;
      height: 70px;
      border: none;
      color: #d6d6d6;
      box-shadow: none;
      outline: none;
    }
  }
  .consult-list {
    background: #fff;
    height: 616px;
    overflow: scroll;
    .active {
      background: #f4f4f4;
    }
  }
}

@media screen and (max-width: 1366px) {
  .left {
    .consult-list {
      height: 440px;
    }
  }
  .middle {
    .chat-history {
      max-height: 372px;
    }
  }
}
@media screen and (max-width: 1440px) and (min-width: 1367px) {
  .left {
    .consult-list {
      height: 566px;
    }
  }
  .middle {
    .chat-history {
      max-height: 498px;
    }
  }
}

.btn-send {
  width: 80px;
  height: 32px;
  margin-right: 88px;
  color: #fff;
  text-align: center;
  background: #6385ff;
  font-size: 16px;
  line-height: 32px;
  cursor: pointer;
}

.emoji-pop {
  height: 288px;
  transform: translate(-10px, -160px);
  position: absolute;
}
</style>

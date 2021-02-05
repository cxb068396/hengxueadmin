// 咨询聊天窗口
<template>
  <div class="app-container ref" v-show="visible">
    <div class="chat-container">
      <div class="header flex-between">
        <div>咨询聊天窗口</div>
        <i class="close-icon el-icon-circle-close" @click="onClose" />
      </div>
      <div class="body flex-fill">
        <!-- 中间 -->
        <div class="middle flex-start column">
          <div class="chat-history flex-1 flex-start column scroll-bar">
            <!-- consult 咨询者 replyer 回复者 -->
            <template v-for="item in record">
              <!-- eslint-disable-next-line -->
              <div class="time-row">
                <span>{{ item.create_at }}</span>
              </div>
              <!-- eslint-disable-next-line -->
              <replay-mes
                :avatar="user.picture"
                :content="item.content"
                v-if="item.send_type == 1"
              ></replay-mes>
              <!-- eslint-disable-next-line -->
              <consult-mes :avatar="member.image" :content="item.content" v-else></consult-mes>
            </template>

            <!-- <div class="connect-info">14:10:28 客服关闭</div>
            <div class="chat-seperate-line flex-between">
              <div class="dash-line"></div>
              <div>以上为历史信息</div>
              <div class="dash-line"></div>
            </div>
            <div class="connect-info">14:12:28 客户进入</div>
            <div>14:15:30客户长时间未回复，5分钟后系统将自动关闭会话</div> -->
          </div>
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
  </div>
</template>

<script>
import store from "../store";
import chat from "../mixin";
// import "@/assets/styles/chatwin.scss";

export default {
  mixins: [chat],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      store // 共享变量
    };
  },

  created() {},

  methods: {
    onClose() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";
@import "~@/assets/styles/chatwin.scss";

.ref {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.6);
}
.chat-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #f4f4f4;
  height: 780px;
  width: auto;
  border-radius: 16px 16px;
  overflow: hidden;
}
.body {
  height: calc(100% - 60px);
}
.middle {
  height: 100%;
  width: 860px;
  .chat-history {
    height: 100%;
  }
}

@media screen and (max-width: 1366px) {
  .middle {
    width: 650px;
  }

  .chat-container {
    height: 570px;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1440px) {
  .middle {
    width: 650px;
  }
  .chat-container {
    height: 700px;
  }
}
</style>

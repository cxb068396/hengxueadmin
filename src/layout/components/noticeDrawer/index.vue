<!-- 消息提示框 -->
<template>
  <el-drawer
    title="消息提示"
    :modal="false"
    :withHeader="true"
    :visible.sync="$store.state.user.showHiteMessage"
    direction="rtl"
  >
    <el-card shadow="hover" v-for="(item, index) in hiteMessage" :key="index">
      <!-- <router-link :to="item.url" @click="onMesClick">
          
        <span class="card-sp1">{{ item.title }}</span>
        <span class="card-sp2">{{ item.time }}</span>
      </router-link> -->
      <div @click="onMesClick(item.id, item)" :class="`${item.cate === 2? 'link':''}`" style="cursor: pointer;">
        <span class="card-sp1">{{ item.title }}</span>
        <span class="card-sp2">{{ item.time }}</span>
      </div>
    </el-card>
  </el-drawer>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import EventCenter from "@/utils/EventCenter";
import { readMessage } from "@/api/information/informations";

export default {
  data() {
    return {};
  },
  // 计算属性
  computed: {
    ...mapState({
      hiteMessage: state => state.user.hiteMessage
    })
  },
  //引入组件
  components: {},
  // 方法
  methods: {
    // ...mapMutations("Minus_Hite_Mes"),
    onMesClick(id, mes) {
      if (mes.cate === 2) {
        var link = document.createElement("a");
        link.setAttribute("href", mes.message);
        link.setAttribute("target", "_blank");
        link.style.cssText = "opacity: 0;";
        document.body.appendChild(link);
        link.click();
        link.remove();
        readMessage(id)
        return;
      } else if (mes.cate === 1) {
        localStorage.setItem("showMessage", id);
        this.$bus.$emit('showMessage',id)
        this.$router.push(`/informations/message_management`);
      }

      this.$store.commit("toggleShowHiteMessage");
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-drawer {
  //top: $header-height + 45px;
  //position: fixed;
  bottom: 0;
  right: 0;
  width: 400px !important;
  -webkit-box-shadow: -3px -3px 8px rgba(0, 0, 0, 0.2);
  box-shadow: -3px -3px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
}
::v-deep .el-drawer__header {
  text-align: left;
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 700;
}
::v-deep .el-drawer__body {
  overflow-y: auto;
  padding-top: 5px;
}
::v-deep .el-card {
  height: 50px;
  line-height: 50px;
  padding: 0px;
  .el-card__body {
    height: 50px;
    line-height: 50px;
    padding: 0px;
    .card-sp1 {
      text-align: left;
      padding-left: 10px;
      float: left;
      width: 55%;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
    .card-sp2 {
      text-align: right;
      padding-right: 10px;
      float: right;
      width: 35%;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
  }
}

.link{
  color: #4381e6;
}
</style>

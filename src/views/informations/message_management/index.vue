<template>
  <div class="app-container">
    <el-form
      :model="messageSearch"
      class="adv-search"
      label-width="80px"
      label-position="right"
      ref="messageSearchRef"
      label-suffix=":"
    >
      <div class="grid-c">
        <el-form-item label="标题" prop="title">
          <el-input placeholder="请输入" v-model="messageSearch.title"></el-input>
        </el-form-item>

        <el-form-item label="推送类型" prop="cate">
          <el-select v-model="messageSearch.cate" placeholder="请选择">
            <el-option
              v-for="item in cates"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" label-width="auto">
          <el-button type="primary" @click="getmessageList">查询</el-button>
          <el-button type="primary" class="reset" @click="resetAdvSearch">
            重置
          </el-button>
        </el-form-item>
        <div style="text-align: right;">
          <el-button
            type="warning"
            icon="el-icon-plus"
            @click="addMessage"
            v-permission="'add_message'"
          >
            新增消息
          </el-button>
        </div>
      </div>
    </el-form>

    <el-table
      :data="messageList"
      :cell-style="tableStyle.body"
      :header-cell-style="tableStyle.header"
      class="table"
    >
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="cate" label="推送类型">
        <template slot-scope="scope">
          <span v-if="scope.row.cate == 1">文章</span>
          <span v-if="scope.row.cate == 2">链接</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容/链接" width="400px"></el-table-column>
      <el-table-column prop="sender_name" label="推送人"></el-table-column>
      <el-table-column prop="receiver_name" label="接收人"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">未读</el-tag>
          <el-tag v-if="scope.row.status === 2">已读</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="getMessagedetail(scope.$index, scope.row)"
            style="cursor: pointer;"
          >
            查看
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex-center row" style="height: 60px">
      <pagination
        v-show="total > 0"
        :total="total"
        :limit.sync="messageSearch.strip"
        :page.sync="messageSearch.page"
        @pagination="getmessageList"
      />
    </div>

    <el-dialog :visible="showDialog" @close="handleclose" class="dialog">
      <el-form
        label-position="right"
        label-width="100px"
        ref="addMessageFormRefs"
        :model="MessageForm"
        :rules="addRules"
        label-suffix=":"
        :disabled="formMode === 'ADD' ? false : true"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            placeholder="请输入标题"
            class="form-input"
            v-model="MessageForm.title"
            style="width: 260px"
          ></el-input>
        </el-form-item>
        <el-form-item label="接收人" prop="receiver">
          <el-input
            style="width: 260px"
            v-model="MessageForm.receiver"
            placeholder="请输入接收人名字"
          ></el-input>
        </el-form-item>
        <el-form-item label="消息类型">
          <el-radio v-model="MessageForm.cate" label="1">内容</el-radio>
          <el-radio v-model="MessageForm.cate" label="2">链接</el-radio>
        </el-form-item>
        <el-form-item
          v-if="MessageForm.cate === '1'"
          label="消息内容"
          prop="content"
          :rules="{ required: true, trigger: 'blur', message: '内容/链接不能为空' }"
        >
          <el-input
            v-model="MessageForm.content"
            autosize
            type="textarea"
            class="hx-textarea"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="链接"
          prop="content"
          v-if="MessageForm.cate === '2'"
          :rules="linkValidator"
        >
          <el-input
            placeholder="请输入链接"
            class="form-input"
            v-model="MessageForm.content"
            style="width: 260px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="title">{{ formMode === "ADD" ? "新增消息" : "编辑消息" }}</div>
      <div slot="footer" class="dialog-footer" v-if="formMode === 'ADD'">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="preserve">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import table from "@/mixins/table";
import Pagination from "@/components/Pagination";
import { addMessage, getMessage, addProducrt, readMessage } from "@/api/information/informations";
// import TinymecEditor from "@/components/TEditor";
import EventCenter from "@/utils/EventCenter";

export default {
  components: {
    Pagination
    //  TinymecEditor
  },
  data() {
    return {
      pictureUrl: process.env.VUE_APP_BASE_API + "/admin/upload_img_message",
      showDialog: false,
      formMode: "ADD",
      total: 0,
      disabled: false,
      //查询条件
      messageSearch: {
        page: 1,
        strip: 10,
        title: "",
        cate: ""
      },
      messageList: [],
      MessageForm: {
        cate: "1",
        title: "",
        content: "",
        receiver: ""
      },
      cates: [
        {
          value: "1",
          label: "文章"
        },
        {
          value: "2",
          label: "链接"
        }
      ],
      addRules: {
        title: [{ required: true, trigger: "blur", message: "标题不能为空" }],
        receiver: [{ required: true, trigger: "blur", message: "接收人不能为空" }]
      },

      linkValidator: {
        required: true,
        pattern: /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/,
        message: "请输入有效的链接"
      }
    };
  },

  watch: {
    showDialog: function(flag) {
      if (!flag) {
        this.MessageForm = {
          cate: "1",
          title: "",
          content: "",
          receiver: ""
        };
      }
    }
  },

  mounted() {
    this.getmessageList();
    this.$bus.$on("showMessage", id => {
      this.showMessage(id, this.messageList);
    });
  },
  mixins: [table],
  methods: {
    //获取消息列表
    async getmessageList() {
      const res = await getMessage({ ...this.messageSearch, page: this.messageSearch.page - 1 });
      if (res.code == "200") {
        this.messageList = res.mes.list;
        this.total = res.mes.count;

        if (localStorage.getItem("showMessage")) {
          this.showMessage(localStorage.getItem("showMessage"), res.mes.list);
        }
      }
    },
    // 点击顶部导航栏 消息，显示消息
    showMessage(id, list) {
      list.forEach(ele => {
        if (ele.id == id) {
          this.showDialog = true;
          this.formMode = "EDIT";
          this.MessageForm.cate = ele.cate + "";
          this.MessageForm.title = ele.title;
          this.MessageForm.content = ele.content;
          this.MessageForm.receiver = ele.receiver_name;
          this.disabled = true;
          localStorage.removeItem("showMessage");
          readMessage(ele.id).then(res => {
            ele.status = 2;
          });
        }
      });
    },
    resetAdvSearch() {
      this.$refs.messageSearchRef.resetFields();
      this.messageSearch.page = 1;
      this.getmessageList();
    },
    //显示新增消息弹框
    addMessage() {
      this.showDialog = true;
      this.formMode = "ADD";
    },
    //编辑
    getMessagedetail(index, row) {
      if (row.cate === 2) {
        var link = document.createElement("a");
        link.setAttribute("href", row.content);
        link.setAttribute("target", "_blank");
        link.style.cssText = "opacity: 0;";
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }
      this.showDialog = true;
      this.formMode = "EDIT";
      this.MessageForm.cate = row.cate + "";
      this.MessageForm.title = row.title;
      this.MessageForm.content = row.content;
      this.MessageForm.receiver = row.receiver_name;
      this.disabled = true;
      readMessage(row.id).then(res => {
        row.status = 2;
        // this.$set(this.messageList[index],'status',2)
      });
    },
    //新增消息
    async preserve() {
      if (this.formMode == "ADD") {
        this.$refs.addMessageFormRefs.validate(async valid => {
          // console.log(valid)
          if (valid) {
            const res = await addMessage(this.MessageForm);
            if (res.code == "200") {
              this.showDialog = false;
              this.getmessageList();
              this.$message({ type: "success", message: "添加消息成功" });
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    //tabs切换时的事件
    handleClick(tab, event) {
      this.MessageForm.cate = tab.name;
      if (this.formMode == "ADD") {
        this.$refs["addMessageFormRefs"].resetFields();
      }
    },
    //重置表单
    handleclose() {
      this.$nextTick(() => {
        this.$refs["addMessageFormRefs"].resetFields();
        this.showDialog = false;
        this.disabled = false;
      });
    }
  },
  beforeDestroy(){
    this.$bus.$off('showMessage')
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";
.dialog {
  min-width: 1440px;
  box-sizing: border-box;
}
.orange {
  background-color: #f7931e;
  border-color: #f7931e;
  color: #ffffff;
}

.table {
  // 表头字体
  ::v-deep th {
    font-size: 16px !important;
  }
}

.hx-textarea {
  width: 80%;

  padding: 10px;
  ::v-deep .el-textarea__inner {
    height: 12em;
  }
}

.grid-c {
  // width: calc(100% - 60px);
  width: 100% ;
  display: grid;
  grid-template-columns: repeat(2, 340px) 1fr 1fr;
  grid-column-gap: 20px;
  grid-template-areas: "a b c " "d e f ";
}

@media screen and (max-width: 1366px) {
  .grid-c {
    grid-template-columns: repeat(2, 310px) 1fr 1fr;
  }
}
</style>

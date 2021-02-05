<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tab-style">
      <el-tab-pane label="常用语" name="first">
        <div class="index-top">
          <span class="index-top-word">搜索:</span>
          <el-input
            v-model="words"
            size="medium"
            clearable
            placeholder="请输入常用语"
            style="width: 260px"
            class="index-top-inp"
          />
          <el-row style="display: inline-block">
            <el-button type="primary" style="margin-left: 25px" @click="select">查询</el-button>
            <el-button style="color: #4381e6" @click="reset">重置</el-button>
          </el-row>
          <el-button type="warning" class="index-top-add" @click="dialogAdd = true">
            + 新增常用语
          </el-button>
          <el-dialog
            title="新增常用语"
            :visible.sync="dialogAdd"
            :append-to-body="true"
            style="width: 680px; margin-left: 35%"
          >
            <el-form :model="form" ref="addFormRef" :rules="rules">
              <el-form-item label="常用语:" :label-width="formLabelWidth" prop="words">
                <el-input
                  v-model="form.words"
                  autocomplete="off"
                  placeholder="请输入"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
              <el-form-item label="描述:" :label-width="formLabelWidth" prop="description">
                <el-input
                  v-model="form.description"
                  autocomplete="off"
                  placeholder="请输入"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
              <el-button @click="dialogAdd = false">取 消</el-button>
              <el-button type="primary" @click="addContent">保 存</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="index-table">
          <el-table :data="customData" style="width: 100%" :cell-style="tableStyle.body"
        :header-cell-style="tableStyle.header">
            <el-table-column prop="id" label="序号"></el-table-column>
            <el-table-column prop="content" label="常用语"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click="editWordsVisible(scope.$index)" type="text" size="small" style="font-size: 14px;">
                  编辑
                </el-button>
                <el-dialog
                  title="编辑常用语"
                  :visible.sync="dialogEdit"
                  :append-to-body="true"
                  style="width: 680px; margin-left: 35%"
                >
                  <el-form :model="editForm" :rules="rules">
                    <el-form-item label="常用语:" :label-width="formLabelWidth" prop="words">
                      <el-input
                        v-model="editForm.words"
                        autocomplete="off"
                        placeholder="请输入角色名称"
                        style="width: 100%"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="描述:" :label-width="formLabelWidth" prop="description">
                      <el-input
                        v-model="editForm.description"
                        autocomplete="off"
                        placeholder="请输入"
                        style="width: 100%"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer" style="text-align: center">
                    <el-button @click="dialogEdit = false">取 消</el-button>
                    <el-button type="primary" @click="editWords">保 存</el-button>
                  </div>
                </el-dialog>
                <el-button
                  type="text"
                  size="small"
                  style="color: #f7931e;font-size: 14px;"
                  @click="delWordsVisible(scope.$index)"
                >
                  删除
                </el-button>
                <el-dialog
                  :append-to-body="true"
                  title="删除角色"
                  :visible.sync="dialogDel"
                  width="20%"
                >
                  <span>删除后无法恢复，您还继续吗？</span>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogDel = false">取 消</el-button>
                    <el-button type="primary" @click="delWords">确 定</el-button>
                  </span>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="index-pag">
          <el-pagination
            :page-size="pagesize"
            layout="prev, pager, next, jumper"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :pager-count="5"
            :total="total"
          ></el-pagination>
          <div class="pag-bottom" v-if="total>0">共{{total}}条记录 第{{currentPage}}/{{Math.ceil(total/10)}}页</div>
          <div class="pag-bottom" v-else>共{{total}}条记录 第{{currentPage}}/1页</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自动回复" name="second">
        <div class="index-answer">
          <div class="index-rule-container" v-for="(item, index) in answer" :key="index">
            <span class="ruleCon-one">{{item.id}}</span>
            <div class="ruleCon-two">{{item.title}}</div>
            <el-switch
              class="ruleCon-three"
              :value="item.status"
              active-color="#4381E6"
              inactive-color="#e6e6e6"
              :active-value= "1"
              :inactive-value= "2"
              @change="changeAnswer(index)"
            ></el-switch>
            <div class="ruleCon-four">
              <div class="four-top" v-if="item.id == 1"></div>
              <div class="four-top" v-if="item.id == 2">
                客服超过
                <el-input class="min" v-model="item.time"></el-input>
                秒无响应时自动发送
              </div>
              <div class="four-top" v-if="item.id == 3">
                客户超过
                <el-input class="min" v-model="item.time"></el-input>
                秒无响应时自动转接
              </div>
              <div class="four-top" v-if="item.id == 4">
                客服手动关闭
              </div>
              <div class="four-top" v-if="item.id == 5">
                客服自动关闭
              </div>
              <div class="four-bottom" v-if="item.id == 1">每段对话开启时，系统将自动向客户发送一段欢迎语</div>
              <div class="four-bottom" v-if="item.id == 2">客服未回复客户消息时，系统将自动向他发送一条消息</div>
              <div class="four-bottom" v-if="item.id == 3">客户未回复客服消息时，系统将自动向他发送一条消息</div>
              <div class="four-bottom" v-if="item.id == 4">会话结束后，系统将手动向客户发送一段结束语</div>
              <div class="four-bottom" v-if="item.id == 5">会话结束后，系统将自动向客户发送一段结束语</div>
            </div>
            <el-input v-model="item.content" type="textarea" placeholder="请输入消息内容" class="resizeNone" :rows="2" resize="none"></el-input>
            <el-button type="warning" style="margin-left: 5%;"  @click="baocun(index)">保存</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="会话规则" name="third">
        <div class="index-rule">
          <div class="index-rule-container" v-for="(item, index) in rule" :key="index">
            <span class="ruleCon-one">{{ item.id }}</span>
            <div class="ruleCon-two">{{ item.title }}</div>
            <el-switch
              class="ruleCon-three"
              :value="item.status"
              active-color="#4381E6"
              inactive-color="#e6e6e6"
              :active-value= "1"
              :inactive-value= "2"
              @change="change(index)"
            ></el-switch>
            <div class="ruleCon-four">
              <div class="four-top" v-if="item.id == 1">
                超过
                <el-input class="min" v-model="item.time" @change="changes(index)"  v-if="item.time <= 60"></el-input> 
                <el-input class="min"  v-model="item.time" @change="changes(index)" v-if="item.time > 60"></el-input> 
                <!-- <span class="min"  v-if="item.time > 60">{{parseInt((item.time)/60)}}</span> -->
                秒内无响应时自动发送结束语
              </div>
              <div class="four-top" v-if="item.id == 2">
                访客离线
                <el-input class="min" v-model="item.time" @change="changes(index)"></el-input>
                秒内自动结束会话
              </div>
              <div class="four-top" v-if="item.id == 3">
                访客发送消息后
                <el-input class="min" v-model="item.time" @change="changes(index)"></el-input>
                秒内, 客服离线则自动转接
              </div>
              <div class="four-top" v-if="item.id == 4">
                关闭时，客户必须向客服发送消息后，客服才可接入会话。
                <!-- <span class="min">20</span> -->
              </div>
              <div class="four-bottom" v-if="item.id == 1">每段对话开启时，系统将自动向客户发送一段欢迎语</div>
              <div class="four-bottom" v-if="item.id == 2">客服回复客户消息时，系统将自动向他发送一条消息</div>
              <div class="four-bottom" v-if="item.id == 3">客服未回复客户消息时，系统将自动向他发送一条消息</div>
              <div class="four-bottom" v-if="item.id == 4">开启后，客户将进入聊天窗口，客服会立即接入会话，客服可主动与客户沟通</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  getCustSetting,
  addCustSetting,
  editCustSetting,
  delCustSetting,
  getAnswer,
  editAnswer,
  getSessionRules,
  editSessionRules,
} from "@/api/customer/customer";
import table from "@/mixins/table";
import { isvalidatemobile, validEmail } from "@/utils/validate";

export default {
  data() {
    var words = (rule, value, callback) => {
      if(this.form.words === '' && this.editForm.words === ''){
        callback(new Error('常用语不能为空'))
      }
    };
    var description = (rule, value, callback) => {
      if(this.form.description === '' && this.editForm.description === ''){
        callback(new Error('描述不能为空'))
      }
    }
    return {
      activeName: "first",
      words: "",
      form: {
        words: "",
        description: "",
      },
      editForm: {
        id: "",
        words: "",
        description: "",
      },
      delForm: {
        id: "",
      },
      customData: [], //装常用语的数组
      formLabelWidth: "80px",
      dialogFormVisible: false,
      dialogAdd: false,
      dialogEdit: false,
      dialogDel: false,
      total: 0,
      pagesize: 10, //每页多少数据
      currentPage: 1, //默认当前页为第一页(初始页)
      value: false,

      // 自动回复
      answer: [],
      input: '',
      // 会话规则页面
      rule: [],
      status: [],
      values: true,
      rules: {
        words: [{ validator: words, trigger: "blur" }],
        description: [{ validator: description, trigger: "blur" }]
      }
    };
  },
    mixins: [table],
  created() {
    this.getCustSetting();
    this.getAnswer();
    this.getSessionRules();
  },
  methods: {
    getCustSetting() {
      getCustSetting(this.words)
        .then((res) => {
          this.customData = res.mes.common_words;
          this.total = res.mes.total;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addContent() {
      addCustSetting(this.form.description, this.form.words)
        .then((res) => {
          this.getCustSetting();
          this.dialogAdd = false;
          this.form.words = "";
          this.form.description = "";
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editWordsVisible(index) {
      this.dialogEdit = true;
      let words = this.customData[index];
      console.log("11111111=====>" + words);
      this.editForm = {
        words: words.content,
        description: words.description,
        id: words.id,
      };
    },
    editWords() {
      editCustSetting(this.editForm.description, this.editForm.words, this.editForm.id)
        .then((res) => {
          console.log(res);
          this.getCustSetting();
          this.dialogEdit = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delWordsVisible(index) {
      this.dialogDel = true;
      let delWords = this.customData[index];
      this.delForm = {
        id: delWords.id,
      };
    },
    delWords() {
      delCustSetting(this.delForm.id)
        .then((res) => {
          this.getCustSetting();
          this.dialogDel = false;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 查询
    select() {
      const words = this.words;
      this.getCustSetting();
    },
    // 重置
    reset() {
      this.words = "";
      this.getCustSetting();
    },
    handleSizeChange(size) {
      this.pagesize = size;
      console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      //改变当前页
      this.currentPage = currentPage;
      console.log(this.currentPage);
    },

    // 自动回复
    getAnswer() {
      getAnswer().then(res => {
        this.answer = res.res;
        console.log(this.answer)
        console.log('我是自动回复' + res);
      }).catch(err => {
        console.log(err);
      })
    },
    changeAnswer(index) {
      console.log(index);
      if(this.answer[index].status == 1){
        this.answer[index].status = 2
      }else{
        this.answer[index].status = 1
      }
      console.log(this.answer[index].status)
    },
    baocun(index) {
      console.log(index)
      editAnswer(this.answer[index].time, this.answer[index].status, this.answer[index].content, this.answer[index].id).then(res => {
        this.answer[index].content = '';
        
        console.log(res);
        this.getAnswer();
      }).catch(err => {
        console.log(err);
      }) 
    },

    // 会话规则
    getSessionRules() {
      getSessionRules()
        .then((res) => {
          this.rule = res.res;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    change(index) {
      // console.log(index);
      console.log(this.rule[index])
      if(this.rule[index].status == 1){
        this.rule[index].status = 2
        // this.$set(this.rule[index],status,2)
      }else{
        this.rule[index].status = 1
        // this.$set(this.rule[index],status,1)
      }
      console.log(this.rule[index].status)
      editSessionRules(this.rule[index].status, this.rule[index].time, this.rule[index].id).then(res => {
        this.getSessionRules();
        console.log(res);
        this.$message({ type: "success", message: res.mes });
      }).catch(err => {
        console.log(err);
        this.$message({ type: "error", message: err.mes });
      })
    },
    changes(index) {
      editSessionRules(this.rule[index].status, this.rule[index].time, this.rule[index].id).then(res => {
        this.getSessionRules();
        console.log(res);
        this.$message({ type: "success", message: res.mes });
      }).catch(err => {
        console.log(err);
        this.$message({ type: "error", message: err.mes });
      })
    }
  },
};
</script>


<style scoped>

.tab-style {
  color: #999999;
}
.index-top {
  width: 100%;
  height: 50px;
  position: relative;
}
.index-top-word {
  line-height: 50px;
  /* font-size: 20px; */
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #666666;
  margin-right: 10px;
}
.index-top-inp {
  display: inline-block;
}
.index-top-add {
  position: absolute;
  right: 0;
  top: 17%;
}
.index-table {
  margin-top: 40px;
}
.index-pag {
  margin-top: 60px;
  margin-left: 40%;
}
.pag-bottom {
  /* height: 17px; */
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #999999;
  line-height: 34px;
  margin-left: 8%;
  margin-top: 5px;
}

/* 第二块 */
.index-answer {
  width: 100%;
  height: 100%;
  border-top: 1px dashed #bcbcbc;
}
.resizeNone{
  display: inline-block;
  width: 20%;
  position: relative;
  top: 10px;
  resize: none;
}

/* 第三块 */
.index-rule {
  border-top: 1px dashed #bcbcbc;
}
.index-rule-container {
  height: 75px;
  widows: 100%;
  border-bottom: 1px dashed #bcbcbc;
  font-size: 10px;
  font-weight: 400;
  color: #666;
}
.ruleCon-one {
  line-height: 17px;
  display: inline-block;
  margin-top: 15px;
  margin-left: 3%;
}
.ruleCon-two {
  width: 15%;
  /* border: 1px solid darkblue; */
  line-height: 43px;
  display: inline-block;
  margin-left: 26px;
}
.ruleCon-three {
  margin-left: 7%;
}
.ruleCon-four {
  width: 30%;
  display: inline-block;
  margin-left: 7%;
  font-size: 10px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #666666;
  position: relative;
}
.four-top {
  /* line-height: 43px; */
  position: absolute;
  top: 17px;
}
.min {
  display: inline-block;
  width: 55px;
  height: 20px;
  color: #4381E6;
  /* border: 1px solid #bcbcbc;
  border-radius: 2px;
  text-align: center;
  line-height: 20px;
  padding-bottom: 20px;
  box-sizing: border-box; */
}
.four-bottom{
  width: 150%;
}
</style>
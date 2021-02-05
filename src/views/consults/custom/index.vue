<template>
  <div class="app-container">
    <div class="index-top">
      <span class="index-top-word">账号:</span>
      <el-input
        v-model="search"
        size="medium"
        clearable
        placeholder="请输入"
        style="width: 260px"
        class="index-top-inp"
      />
      <el-row style="display: inline-block">
        <el-button type="primary" style="margin-left: 25px" @click="select">查询</el-button>
        <el-button style="color: #4381e6" @click="reset">重置</el-button>
      </el-row>
      <el-button
        type="warning"
        class="index-top-add"
        @click="dialogAdd = true"
        v-permission="'add_customer_service'"
      >
        + 新增客服
      </el-button>
    </div>

    <div class="index-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        :cell-style="tableStyle.body"
        :header-cell-style="tableStyle.header"
      >
        <el-table-column fixed prop="id" label="序号"></el-table-column>
        <el-table-column fixed prop="phone" label="账号"></el-table-column>
        <el-table-column prop="username" label="真实姓名"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="number" label="服务人数"></el-table-column>
        <el-table-column align="center" label="客服状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#4381E6"
              inactive-color="#e9e9e9"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="editCustomerVisible(scope.$index)"
              type="text"
              size="small"
              style="font-size: 14px"
              v-permission="'edit_customer_service'"
            >
              编辑
            </el-button>

            <el-button
              type="text"
              size="small"
              style="color: #f65952; padding-left: 20px; font-size: 14px"
              @click="delCustomerVisible(scope.$index)"
              v-permission="'del_customer_service'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页器 -->
    <div class="index-pag">
      <el-pagination
        layout="prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :total="total"
      ></el-pagination>
      <div class="pag-bottom" v-if="total > 0">
        共{{ total }}条记录 第{{ currentPage }}/{{ Math.ceil(total / 10) }}页
      </div>
      <div class="pag-bottom" v-else>共{{ total }}条记录 第{{ currentPage }}/1页</div>
    </div>

    <el-dialog :append-to-body="true" title="删除角色" :visible.sync="dialogDel" width="20%">
      <span>删除后无法恢复，您还继续吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="delCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增客服弹窗 -->
    <el-dialog
      title="新增客服"
      :visible.sync="dialogAdd"
      :append-to-body="true"
      style="width: 680px; margin-left: 35%"
    >
      <el-form :model="form" ref="addFormRef" :rules="rules">
        <el-form-item label="昵称:" :label-width="formLabelWidth" prop="customerName">
          <el-input
            v-model="form.nickname"
            autocomplete="off"
            placeholder="请输入客服名称"
            style="width: 100%"
            minlength="2"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号:" :label-width="formLabelWidth" prop="customerPhone">
          <el-select v-model="form.phone">
            <el-option
              v-for="item in phones"
              :key="item.id"
              :label="item.phone"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务人数:" :label-width="formLabelWidth" prop="customerNumber">
          <el-input
            v-model="form.number"
            autocomplete="off"
            placeholder="请输入"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="客服状态:" :label-width="formLabelWidth">
          <el-switch
            active-color="#4381E6"
            inactive-color="#e9e9e9"
            v-model="form.state"
            disabled
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCustomer">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 编辑客服 -->
    <el-dialog
      title="客服编辑"
      :visible.sync="dialogEdit"
      :append-to-body="true"
      style="width: 680px; margin-left: 35%"
    >
      <el-form :model="editForm" :rules="rules">
        <el-form-item label="昵称:" :label-width="formLabelWidth" prop="customerName">
          <el-input
            v-model="editForm.nickname"
            autocomplete="off"
            placeholder="请输入角色名称"
            style="width: 100%"
            minlength="2"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号:" :label-width="formLabelWidth" prop="customerPhone">
          <el-select v-model="editForm.phone" @change="selectTrigger(phones.id, phones.phone)">
            <el-option
              v-for="item in phones"
              :key="item.id"
              :label="item.phone"
              :value="item.phone"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务人数:" :label-width="formLabelWidth" prop="customerNumber">
          <el-input
            v-model="editForm.number"
            autocomplete="off"
            placeholder="请输入推荐"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="客服状态:" :label-width="formLabelWidth">
          <el-switch
            active-color="#4381E6"
            inactive-color="#e9e9e9"
            v-model="editForm.state"
            disabled
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="editCustomer">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Tag } from "element-ui";
import table from "@/mixins/table";
import { getCustomer, addCustomer, delCustomer, editCustomer } from "@/api/customer/customer";
import { isvalidatemobile, validEmail } from "@/utils/validate";
export default {
  name: "App",
  data() {
    var customerName = (rule, value, callback) => {
      if (this.form.nickname === "" && this.editForm.nickname === "") {
        return callback(new Error("客服名称不能为空"));
      }
      const zhReg = /^[\u4e00-\u9fa5]*$/;
      const enReg = /^[a-zA-Z]*$/;
      if (!zhReg.test(this.form.nickname) && !enReg.test(this.form.nickname)) {
        callback(new Error("只支持中英文输入且不能混合输入"));
      } else if (!zhReg.test(this.editForm.nickname) && !enReg.test(this.editForm.nickname)) {
        callback(new Error("只支持中英文输入且不能混合输入"));
      } else {
        callback();
      }

      if (this.form.nickname.length < 2 && this.editForm.nickname.length < 2) {
        callback(new Error("最短输入两个长度的内容"));
      }
    };
    var customerPhone = (rule, value, callback) => {
      if (this.form.phone === "" && this.editForm.phone === "") {
        callback(new Error("账号不能为空"));
      }
    };
    var customerNumber = (rule, value, callback) => {
      if (this.form.number === "" && this.editForm.number === "") {
        callback(new Error("服务人数不能为空"));
      }
      const teshu = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
      );
      const regs = /^[+]{0,1}(\d+)$/;
      if (teshu.test(this.form.number) && teshu.test(this.editForm.number)) {
        callback(new Error("不能输入特殊字符"));
        this.editForm.number = "";
      } else if (!regs.test(this.form.number) && !regs.test(this.editForm.number)) {
        callback(new Error("只能输入正整数"));
        this.editForm.number = "";
      } else {
        callback();
      }
    };
    return {
      search: "",
      tableData: [], //搜索钱展示的数组
      phones: [], //存放手机号的数组
      editForm: {
        id: "",
        nickname: "",
        phone: "",
        number: "",
        state: true,
      },
      delForm: {
        id: "",
      },
      dialogFormVisible: false,
      dialogAdd: false,
      dialogEdit: false,
      dialogDel: false,
      form: {
        id: "",
        nickname: "",
        phone: "",
        number: "",
        state: false,
      },
      formLabelWidth: "80px",
      total: 0,
      pagesize: 10, //每页多少数据
      currentPage: 1, //默认当前页为第一页
      rules: {
        customerName: [{ validator: customerName, trigger: "blur" }],
        customerPhone: [{ validator: customerPhone, trigger: "blur" }],
        customerNumber: [{ validator: customerNumber, trigger: "blur" }],
      },
    };
  },
  mixins: [table],
  created() {
    this.getCustomer();
  },
  methods: {
    getCustomer() {
      getCustomer(this.search, this.currentPage - 1, this.pagesize)
        .then((res) => {
          this.tableData = res.mes.customer_service;
          this.phones = res.mes.phone;
          this.form.id = this.phones.id;
          this.total = res.mes.total;
          console.log(this.tableData);
          // console.log(res);
          for (var i = 0; i < this.tableData.length; i++) {
            console.log(this.tableData.length, this.tableData[i].status);
            if (this.tableData[i].status === "0") {
              this.tableData[i].status = false;
            } else {
              this.tableData[i].status = true;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectTrigger(val, id) {
      console.log("aa" + val, id);
    },
    // 点击新增按钮确定添加客服
    addCustomer() {
      let that = this;
      addCustomer(that.form.nickname, that.form.number, that.form.phone)
        .then((res) => {
          this.getCustomer();
          this.dialogAdd = false;
          // this.form.title = "";
          // this.form.sort = "";
          // this.form.description = "";
          console.log("添加成功" + res);
        })
        .catch((err) => {});
    },
    editCustomerVisible(index) {
      this.dialogEdit = true;
      let cust = this.tableData[index];
      // console.log(' 这是role的数据' + cust.id)
      this.editForm = {
        nickname: cust.nickname,
        phone: cust.phone,
        number: cust.number,
        id: cust.id,
        state: cust.status,
      };
    },
    editCustomer() {
      let that = this;
      editCustomer(that.editForm.nickname, that.editForm.number, that.editForm.id)
        .then((res) => {
          this.getCustomer();
          if (this.editForm.number === "") {
            return;
          }
          this.dialogEdit = false;
          console.log("我是編輯成功的：" + res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delCustomerVisible(index) {
      this.dialogDel = true;
      let delCust = this.tableData[index];
      console.log(delCust);
      this.delForm = {
        id: delCust.id,
      };
    },
    delCustomer() {
      var that = this;
      delCustomer(that.delForm.id)
        .then((res) => {
          this.getCustomer();
          this.dialogDel = false;
          console.log("刪除成功" + res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查詢
    select() {
      const search = this.search;

      this.getCustomer();
    },
    // 重置
    reset() {
      this.search = "";
      this.getCustomer();
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.getCustomer();
      console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      //改变当前页
      this.currentPage = currentPage;
      this.getCustomer();
      console.log(this.currentPage);
    },
    // 角色名称限制
    titleInput(val) {
      const zhReg = /^[\u4e00-\u9fa5]*$/;
      const enReg = /^[a-zA-Z]*$/;
      if (!zhReg.test(val) && !enReg.test(val)) {
        // this.$message({ type: "error", message: "请输入中文或英文字符(2-10)，且不能混合输入" });
        this.form.nickname = "";
      } else {
        // this.$message({type: 'success',message: "输入正确！"});
        console.log("success");
      }
    },
    // 服务人数只能匹配数字
    numberInput(val) {
      var reg = /^\d+$|^\d+[.]?\d+$/;
      if (!reg.test(val)) {
        this.$message({ type: "error", message: "只能输入非负数的数字" });
        this.form.number = "";
      } else {
        console.log("success");
      }
    },
  },
};
</script>

<style scoped>
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
  width: 100%;
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #999999;
  line-height: 34px;
  margin-left: 8%;
  margin-top: 5px;
}
</style>

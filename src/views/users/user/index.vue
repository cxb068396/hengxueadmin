<template>
  <div class="app-container">
    <el-form
      :model="advSearch"
      label-position="right"
      label-suffix=":"
      label-width="80px"
      class="adv-search"
      ref="advSearch"
    >
      <div class="grid-c">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="advSearch.username"
            placeholder="请输入"
            class="adv-search__input"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="advSearch.phone"
            placeholder="请输入"
            class="adv-search__input"
            clearable
          ></el-input>
        </el-form-item>

        <!-- type="date" -->
        <el-form-item label="入职时间" prop="time">
          <el-date-picker
            v-model="advSearch.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            format="yyyy-MM-dd"
            clearable
            class="date-picker-input"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label=" 角色类型" prop="type">
          <!-- <el-input v-model="advSearch.type" placeholder="请输入" ></el-input> -->
          <el-select v-model="advSearch.type" placeholder="请选择" clearable>
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.title"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="员工编号" prop="employee_number">
          <el-input
            v-model="advSearch.employee_number"
            placeholder="请输入"
            class="adv-search__input"
            clearable
          ></el-input>
        </el-form-item>

        <!-- style="margin-left: 120px" -->
        <div style="margin-left: 10px;">
          <el-button type="primary" @click="getUserList" v-permission="'add_user'">查询</el-button>
          <el-button @click="resetAdvSearch">重置</el-button>
        </div>
        <el-button class="btn-end " type="warning" icon="el-icon-plus" @click="addUser">
          新增用户
        </el-button>
      </div>
    </el-form>

    <el-table
      :cell-style="tableStyle.body"
      :header-cell-style="tableStyle.header"
      class="table"
      :data="userList"
      style="width: 100%; "
    >
      <el-table-column prop="picture" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.url" class="table_inner_img" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>

      <el-table-column prop="region" label="地区"></el-table-column>

      <el-table-column prop="employee_number" label="员工编号"></el-table-column>
      <el-table-column prop="mailbox" label="邮箱"></el-table-column>
      <el-table-column prop="title" label="角色类型"></el-table-column>
      <el-table-column prop="entry_time" label="入职时间"></el-table-column>
      <el-table-column prop="quit_time" label="离职时间"></el-table-column>
      <el-table-column label="操作" style="width: 200px;">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="onEdit(scope.$index)"
            v-if="scope.row.id != 1"
            v-permission="'edit_user'"
          >
            编辑
          </el-link>
          <el-link
            type="warning"
            :underline="false"
            style="margin: 0 10px"
            @click="resetPass(scope.$index)"
            v-permission="'reset_password'"
          >
            重置密码
          </el-link>
          <el-link
            type="danger"
            :underline="false"
            @click="onDel(scope.$index)"
            v-if="scope.row.id != 1"
            v-permission="'del_user'"
          >
            删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex-center row" style="height: 60px">
      <pagination :page.sync="page" @pagination="onPagination"></pagination>
    </div>

    <!--显示新增/修改用户-->
    <el-dialog :visible.sync="showDialog" width="806px">
      <div class="dialog-body">
        <el-form
          :model="form"
          :rules="rules"
          class="form"
          ref="userform"
          label-width="100px"
          label-position="right"
        >
          <el-form-item label="角色类型" prop="group_id">
            <el-select v-model="form.group_id" class="userform-input" clearable>
              <el-option
                v-for="role in roleList"
                :key="role.id"
                :label="role.title"
                :value="role.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <div class="line"></div>

          <h2>基本信息</h2>
          <el-form-item label="姓名" prop="username">
            <el-input
              class="userform-input"
              v-model="form.username"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input
              type="number"
              class="userform-input"
              v-model="form.age"
              :maxlength="2"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio v-model="form.gender" :label="1">男</el-radio>
            <el-radio v-model="form.gender" :label="2">女</el-radio>
          </el-form-item>
          <!--  -->
          <el-form-item
            label="地区"
            prop="region"
            :rules="{ required: true, message: '地区是必选项' }"
          >
            <el-select v-model="region.selProv" class="region" clearable>
              <el-option
                v-for="prov in region.province"
                :key="prov.id"
                :label="prov.name"
                :value="prov.id"
              ></el-option>
            </el-select>
            <el-select v-model="region.selCity" class="region" clearable>
              <el-option
                v-for="city in region.city"
                :key="city.name"
                :label="city.name"
                :value="city.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input
              placeholder="请输入"
              class="userform-input"
              v-model="form.phone"
              :maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" class="userform-input" prop="mailbox">
            <el-input placeholder="请输入" class="userform-input" v-model="form.mailbox"></el-input>
          </el-form-item>

          <div class="line"></div>

          <h2>部门信息</h2>
          <!-- <el-form-item label="部门">
            <el-select placeholder="请选择" class="userform-input" v-model="form.department">
              <el-option value="101" label="开发部"></el-option>
              <el-option value="102" label="工程部"></el-option>
              <el-option value="103" label="销售部"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="部门" prop="department">
            <el-input
              placeholder="请输入"
              :value="form.department"
              class="userform-input"
              v-model="form.department"
            ></el-input>
          </el-form-item>
          <el-form-item label="员工编号" v-if="formMode === 'EDIT'">
            <el-input
              placeholder="请输入"
              disabled
              :value="form.employee_number"
              class="userform-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="入职时间" prop="entry_time">
            <!-- 入职时间选择限制 :picker-options="startTimeOptions" -->
            <el-date-picker
              placeholder="请选择"
              value-format="timestamp"
              class="userform-input"
              v-model="form.entry_time"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="离职时间" prop="quit_time">
            <!-- 入职时间选择限制 :picker-options="startTimeOptions" -->
            <el-date-picker
              placeholder="请选择"
              value-format="timestamp"
              class="userform-input"
              v-model="form.quit_time"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="离职时间">
            <el-date-picker
              class="userform-input"
              placeholder="请选择"
              value-format="timestamp"
              :picker-options="startTimeOptions"
            ></el-date-picker>
          </el-form-item> -->

          <template v-if="form.group_id === 3 || form.group_id === 50">
            <div class="line"></div>
            <h2>学历信息</h2>
            <el-form-item
              label="学历"
              class="userform-input"
              prop="education"
              :rules="eduRules.education"
            >
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="form.education"
              ></el-input>
            </el-form-item>
            <el-form-item label="专业" class="userform-input" prop="major" :rules="eduRules.major">
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="form.major"
                type="text"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="爱好" prop="hobby" :rules="eduRules.hobby">
              <el-input
                v-model="form.hobby"
                placeholder="请输入"
                style="width: 100%"
                maxlength="50"
                show-word-limit
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="特长" prop="specialty" :rules="eduRules.specialty">
              <el-input
                v-model="form.specialty"
                placeholder="请输入"
                style="width: 100%"
                :maxlength="50"
                show-word-limit
                type="textarea"
              ></el-input>
            </el-form-item>
          </template>

          <div class="line"></div>

          <h2>账号信息</h2>
          <!-- v-if="formMode === 'ADD'" -->
          <template>
            <el-form-item
              label="登录密码"
              prop="password"
              :rules="passwordRules"
              v-if="formMode === 'ADD'"
            >
              <el-input
                placeholder="请输入"
                class="userform-input"
                type="password"
                v-model="form.password"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="确认密码"
              prop="checkPass"
              :rules="checkPassRules"
              v-if="formMode === 'ADD'"
            >
              <el-input
                placeholder="请输入"
                class="userform-input"
                type="password"
                v-model="form.checkPass"
              ></el-input>
            </el-form-item>
          </template>

          <el-form-item
            label="头像"
            prop="picture"
            :rules="{ required: true, message: '请上传图片' }"
          >
            <div class="flex-start">
              <img :src="url" alt="" class="avatar" />
              <div class="flex-center column" style="align-items: flex-start; height: 120px">
                <el-upload action="" :before-upload="beforeUpload">
                  <el-button class="uploader">上传图片</el-button>
                </el-upload>
                <span class="tips">温馨提示：</span>
                <span class="tips">
                  图片支持1:1尺寸大小（推荐240px*240px，jpg或png格式，最大支持1M）
                </span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div slot="title">{{ formMode === "ADD" ? "新增用户" : "编辑用户" }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
import table from "@/mixins/table";
import { delUser, addUser, editUser, resetPass, queryUser, queryCitys } from "@/api/users/user";
import { uploadPicture } from "@/api/users/member";
import { getRoles } from "@/api/sys/role";
import store from "@/store";
import avatarImg from "@/assets/images/avatar.png";
import dayjs from "dayjs";

import { rules, eduRules, passwordRules, initForm } from "./userForm";

export default {
  components: { VDistpicker },
  data() {
    var that = this;
    return {
      userList: [], // 用户列表
      roleList: [], // 角色列表
      map: null,
      // 表单上方高级查询
      advSearch: {
        time: [],
        username: "",
        phone: "",
        employee_number: "",
        entry_time: "",
        type: "",
        entry_time_begin: "", // 开始日期
        entry_time_end: "" // 结束日期
      },
      formMode: "ADD", // 弹框的模式，新增（ADD）或编辑（EDIT）
      showDialog: false,

      region: {
        province: "",
        city: "",
        selProv: "",
        selCity: ""
      },

      // 新增/编辑用户表单对象
      form: initForm(),
      rules, // 用户表单验证规则
      eduRules, // 用户表单学历验证规则
      passwordRules: { required: this.formMode === "EDIT" ? false : true, ...passwordRules }, // 用户表单密码验证规则
      checkPassRules: {
        required: this.formMode === "EDIT" ? false : true,
        trigger: "blur",
        validator(rules, value, callback) {
          if (value.trim() === "") {
            callback(new Error("请再次输入密码"));
          } else if (value !== that.form.password) {
            callback(new Error("两次输入密码不一致!"));
          } else {
            callback();
          }
        }
      }, // 用户表单查看密码验证规则

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      url: avatarImg // 预览头像地址
    };
  },
  mixins: [table],
  watch: {
    showDialog: function(mark) {
      if (!mark) {
        this.form = initForm();
        // this.$refs.userform.resetFields();
        this.url = avatarImg;
        this.region.selProv = "";
        this.region.selCity = "";
        this.$refs.userform.clearValidate();
        this.$refs.userform.resetFields();
      } else {
        // if (this.formMode === "edit") {
        //   this.$refs.userform.clearValidate(["password", "checkPass"]);
        // }else{
        //   this.$refs.userform.resetFields();
        // }
      }
    },
    "advSearch.time": function(time) {
      if (time.length === 0) {
        this.advSearch.entry_time_begin = "";
        this.advSearch.entry_time_end = "";
      } else {
        this.advSearch.entry_time_begin = dayjs(time[0]).format("YYYY-MM-DD");
        this.advSearch.entry_time_end = dayjs(time[1]).format("YYYY-MM-DD");
      }
    },
    "region.selProv": function(id) {
      if (!!id) {
        for (let prov of this.region.province) {
          if (prov.id === id) {
            this.region.city = prov.city;
            this.region.selCity = "";
            break;
          }
        }
      } else {
        this.region.selCity = "";
      }
    },
    "region.selCity": function(city) {
      let province = "";
      for (let prov of this.region.province) {
        if (prov.id === this.region.selProv) {
          province = prov.name;
          break;
        }
      }
      this.form.region = province + city;
    },
    "form.age": function(age) {
      if (Number.parseInt(age) < 1) {
        this.form.age = "1";
      }
      if (Number.parseInt(age) > 99) {
        this.form.age = "99";
      }
    },
    "form.username": function(age) {
      this.form.username = age.trim();
    },
    "form.group_id": function(newVal,oldVal){
      if(newVal !== oldVal && !!oldVal){
        this.$refs.userform.clearValidate();
        this.$refs.userform.resetFields();
      }
    },
  },
  created() {
    this.getUserList();
    this.getRoles();
    this.getCitys();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      try {
        const { number, size } = this.page;
        const { mes } = await queryUser({ ...this.advSearch, page: number - 1, strip: size });
        this.userList = mes.user;
        this.userList.forEach(user => {
          user.url = user.picture ? process.env.VUE_APP_BASE_PICTURE_URL + user.picture : "";
        });
        this.page.total = mes.total;
      } catch (err) {}
    },

    onPagination(page) {
      this.page = page;
      this.getUserList();
    },

    // 获取省份和城市数据
    getCitys() {
      queryCitys().then(res => {
        this.region.province = res;
        const map = new Map();
        res.forEach(ele => {
          map.set(ele.name, ele);
        });
        this.map = map;
      });
    },

    // 获取角色列表
    async getRoles() {
      try {
        const { mes } = await getRoles();
        this.roleList = mes.list;
      } catch (err) {
        console.log(err);
      }
    },

    //编辑
    onEdit(index) {
      let regs = /(?<province>[^省]+省|.+自治区|.+市)(?<city>[^自治州]+自治州|[^市]+市|[^盟]+盟|[^地区]+地区|.+区划)(?<area>[^市]+市|[^县]+县|[^旗]+旗|.+区)?(?<town>[^区]+区|.+镇|.+乡|.+街道|.+服务中心)?(?<village>.*)/;
      let zxCity = /(?<province>.*)\1市/;
      let user = this.userList[index];
      let form = this.form;
      let region = this.region;

      if (user.region) {
        let addr = !!user.region ? user.region : "";
        const matched = user.region.match(regs);
        region.selProv = !!matched.groups.province ? this.map.get(matched.groups.province).id : "";
        this.$nextTick(vm => {
          region.selCity = !!matched.groups.city ? matched.groups.city : "";
        });
      }

      form.username = user.username;
      form.age = user.age ? user.age : "";
      form.department = user.department ? user.department : "";
      form.id = user.id;
      form.phone = user.phone;
      form.mailbox = user.mailbox;
      form.employee_number = user.employee_number ? user.employee_number : "";
      form.education = user.education ? user.education : "";
      form.major = user.major ? user.major : "";
      form.hobby = user.hobby ? user.hobby : "";
      form.specialty = user.specialty ? user.specialty : "";

      form.picture = user.picture;
      // Object.keys(form).forEach(key => {
      //   this.form[key] = user[key]
      // })
      form.group_id = Number.parseInt(user.title_id);
      form.entry_time = user.entry_time ? new Date(user.entry_time).getTime() : "";
      form.quit_time = user.quit_time ? new Date(user.quit_time).getTime() : "";

      this.formMode = "EDIT";
      this.showDialog = true;

      this.url = user.url;
    },

    //新增
    addUser() {
      this.showDialog = true;
      this.formMode = "ADD";
    },

    // 弹框确认按钮点击事件处理函数
    async onConfirm() {
      // this.onSubmit();
      this.$refs.userform.validate(valid => {
        if (!valid) {
          // 表单验证为通过,终止执行
          console.log("验证未通过" + valid);
          return;
        }
        this.onSubmit();
      });
    },

    // 弹框 提交(确认)
    async onSubmit() {
      let res = null;
      let data = {};
      Object.keys(this.form).forEach(key => {
        if (this.form[key]) {
          data[key] = this.form[key];
        }
      });
      if (data.entry_time) data.entry_time = dayjs(data.quit_time).format("YYYY-MM-DD");
      if (data.quit_time) data.quit_time = dayjs(data.quit_time).format("YYYY-MM-DD");

      // this.form.entry_time = !!this.form.entry_time?dayjs(this.form.entry_time).format("YYYY-MM-DD"):'';
      // this.form.quit_time = !!this.form.quit_time?dayjs(this.form.quit_time).format("YYYY-MM-DD"):'';

      try {
        if (this.formMode === "ADD") {
          // 新增
          res = await addUser(data);
        } else if (this.formMode === "EDIT") {
          // 编辑

          res = await editUser(data);
        }
        this.getUserList();
        this.showDialog = false;
      } catch (err) {
        if (err.code && err.mes) {
          this.$message({ type: "error", message: err.mes });
        }
        // console.log(err);
      }
    },

    // 重置用户表单
    resetUserForm() {
      this.form = {
        group_id: "", // 角色
        username: "", // 用户名
        phone: "", // 手机号
        mailbox: "", // 邮箱地址
        gender: 1, // 性别
        age: "", // 年龄

        region: "", // 地区
        department: "", // 部门
        employee_number: "", // 员工编号
        entry_time: "", // 入职时间
        quit_time: "", //离职时间

        education: "", //学历
        major: "", //专业
        hobby: "", //爱好
        specialty: "", //特长

        picture: "", // 头像
        password: "", // 密码
        checkPass: "" // 二次输入密码
      };
    },

    // 重置高级查询
    resetAdvSearch() {
      this.advSearch = {
        time: [],
        username: "",
        phone: "",
        employee_number: "",
        entry_time: "",
        type: "",
        entry_time_begin: "", // 开始日期
        entry_time_end: "" // 结束日期
      };
      // this.$refs.advSearch.resetFields();
      this.getUserList();
      // this.userList();
    },

    // 重置密码
    resetPass(index) {
      let id = this.userList[index].id;
      this.$prompt("请输入重置后的密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "password",
        inputPattern: /^[\w!@#$%^&*()-+]{6,12}$/,
        inputErrorMessage: "请输入6到12位字母、数字和特殊符号组合"
      })
        .then(({ value }) => {
          return resetPass(id, value);
        })
        .then(res => {
          // console.log(res)
          if (res.code === "200") {
            this.$message({ type: "success", message: res.mes });
          }
        })
        .catch(err => {
          if (err.code && err.mes) {
            this.$message({
              type: "error",
              message: err.mes
            });
          } else {
            this.$message({
              type: "info",
              message: "已取消重置密码"
            });
          }
        });
    },

    // 删除用户
    onDel(index) {
      let id = this.userList[index].id;
      this.$confirm("删除后将无法恢复，你还要继续吗？", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return delUser(id);
        })
        .then(res => {
          if (res.code === "200") {
            this.$message({ type: "success", message: res.mes });
            this.getUserList();
          }
        })
        .catch(err => {
          if (err.code && err.mes) {
            this.$message({
              type: "error",
              message: err.mes
            });
          } else {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          }
        });
    },
    // 上传图片
    beforeUpload(file) {
      let formData = new FormData();
      formData.append("file", file);
      uploadPicture(formData).then(res => {
        this.form.picture = res.path;
        this.url = process.env.VUE_APP_BASE_PICTURE_URL + res.path;
      });
      return false;
    },

    // 新增学历里面的学历只能为中文
    eduInput(val) {
      const zhReg = /^[\u4e00-\u9fa5]*$/;
      if (!zhReg.test(val)) {
        this.$message({ type: "error", message: "请输入中文" });
        this.form.education = "";
      } else {
        // this.$message({type: 'success',message: "输入正确！"});
        console.log("success");
      }
    },
    proInput(val) {
      const reg = /^[\u4e00-\u9fa5a-zA-Z]*$/;
      if (!reg.test(val)) {
        this.$message({ type: "error", message: "请输入不能含数字的内容" });
        this.form.major = "";
      } else {
        // this.$message({type: 'success',message: "输入正确！"});
        console.log("success");
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";

.table_inner_img {
  width: 70px;
  height: 70px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.grid-c {
  height: 120px;
  display: grid;
  grid-template-columns: repeat(3, 335px);
  grid-template-rows: repeat(2, 50%);
  grid-column-gap: 20px;
  grid-template-areas:
    "a b c "
    "d e f ";

  position: relative;

  .btn-end {
    position: absolute;
    bottom: 28px;
    right: 0;
  }
}

.dialog-body {
  width: 100%;
  padding: 0 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .line {
    height: 0;
    border: 1px dashed #e9e9e9;
    margin: 10px 0;
  }

  h2 {
    height: 34px;
    font-size: 24px;
    font-weight: 400;
    color: #333333;
    line-height: 34px;
  }

  h2::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 4px solid #4381e6;
    border-radius: 50%;
    margin-right: 16px;
    line-height: 34px;
    vertical-align: -4px;
  }

  .region {
    margin-right: 20px;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border: 1px solid #d6d6d6;
    border-radius: 4px;
    // background-color: red;
    margin-right: 24px;
  }
  .uploader {
    width: 120px;
    height: 40px;
    line-height: 40px;
    border: 1px dashed #4381e6;
    color: #508ae8;
    font-size: 20px;
    margin-bottom: 10px;
    padding: 0 20px;
  }

  .tips {
    // height: 18px;
    font-size: 14px;
    line-height: 24px;
    color: #999999;
  }
}

.userform-input {
  width: 260px;
}

.adv-search {
  // 完整显示“至”字
  ::v-deep .el-date-editor .el-range-separator {
    width: 8%;
  }

  // 定义 日期范围选择器长度
  .date-picker-input {
    width: 320px !important;
  }
}
</style>

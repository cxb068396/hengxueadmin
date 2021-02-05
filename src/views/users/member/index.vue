// 客户列表管理 使用网格布局
<template>
  <div class="app-container">
    <el-form
      :model="advSearch"
      class="adv-search"
      label-width="80px"
      label-position="right"
      ref="advSearch"
    >
      <div class="grid-c">
        <el-form-item label="用户名" prop="name">
          <el-input placeholder="请输入" v-model="advSearch.name"></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input placeholder="请输入" v-model="advSearch.phone"></el-input>
        </el-form-item>

        <el-form-item prop="register_time" label="注册时间">
          <el-date-picker
            v-model="advSearch.register_time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <span data-tooltip="网格布局占位"></span>

        <el-form-item label="角色类型" prop="type">
          <el-select v-model="advSearch.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="就读学校" prop="school">
          <el-input placeholder="请输入" v-model="advSearch.school"></el-input>
        </el-form-item>

        <el-form-item label="" label-width="auto">
          <el-button type="primary" @click="getCustomerList">查询</el-button>
          <el-button type="primary" class="reset" @click="reactAll">
            重置
          </el-button>
        </el-form-item>

        <div style="width: 100%; text-align: right">
          <el-button
            type="warning"
            icon="el-icon-plus"
            @click="addUser"
            v-permission="'add_member'"
          >
            新增客户
          </el-button>
        </div>
      </div>
    </el-form>

    <el-table
      :data="customerList"
      :cell-style="tableStyle.body"
      :header-cell-style="tableStyle.header"
      class="table"
    >
      <el-table-column prop="image" label="头像">
        <template slot-scope="scope">
          <img
            :src="scope.row.image == '暂无' ? avatar : api + scope.row.image"
            style="height: 50px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="class" label="角色类型"></el-table-column>
      <el-table-column prop="stage" label="就读阶段"></el-table-column>
      <el-table-column prop="school" label="就读学校"></el-table-column>
      <el-table-column prop="abroad_country" label="留学意向国"></el-table-column>
      <el-table-column prop="english" label="英语语言成绩"></el-table-column>
      <el-table-column prop="" label="英语测试结果"></el-table-column>
      <el-table-column prop="is_contract" label="是否签订合同">
        <template slot-scope="scope">
          <span v-if="scope.row.is_contract === 2">未签</span>
          <span v-else>已签</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_at" label="注册时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="onEdit(scope.row)">编辑</el-link>
          <!-- <el-link type="warning" :underline="false">查看</el-link> -->
          <el-link
            v-if="scope.row.is_follow == 2"
            type="success"
            :underline="false"
            @click="followMember(scope.row)"
          >
            跟踪
          </el-link>
          <el-link v-if="scope.row.is_follow == 1" type="info" :underline="false">已跟踪</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex-center row" style="height: 60px">
      <pagination
        :total="total"
        :page.sync="advSearch.page"
        :limit.sync="advSearch.strip"
        @pagination="getCustomerList"
      />
    </div>

    <el-dialog :visible.sync="showDialog" width="806px" @close="handleclose">
      <div class="dialog-body">
        <el-form
          :rules="rules"
          :model="memberForm"
          class="form"
          ref="memberForm"
          label-width="100px"
          label-position="right"
        >
          <el-form-item label="角色类型">
            <el-select class="userform-input" v-model="memberForm.type" @change="currStationChange">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <div class="line"></div>

          <h2>基本信息</h2>
          <el-form-item label="姓名" prop="name">
            <el-input
              class="userform-input"
              placeholder="请输入"
              v-model="memberForm.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input
              type="number"
              class="userform-input"
              oninput="value=value.replace('-', '')"
              :min="0"
              v-model="memberForm.age"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="性别"
            prop="gender"
            :rules="{ required: true, message: '性别不能为空' }"
          >
            <el-radio :label="1" v-model="memberForm.gender">男</el-radio>
            <el-radio :label="2" v-model="memberForm.gender">女</el-radio>
          </el-form-item>

          <!-- 地区 -->
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
              v-model="memberForm.phone"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" class="userform-input" prop="email">
            <el-input
              placeholder="请输入"
              class="userform-input"
              v-model="memberForm.email"
            ></el-input>
          </el-form-item>

          <div class="line"></div>

          <h2>学历信息</h2>
          <template v-if="memberForm.type === 2 || memberForm.type === 3 || memberForm.type === 4">
            <el-form-item label="就读学校" prop="school">
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="memberForm.school"
              ></el-input>
            </el-form-item>
            <el-form-item label="就读阶段" prop="stage">
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="memberForm.stage"
              ></el-input>
            </el-form-item>
          </template>

          <template v-if="memberForm.type === 4">
            <el-form-item label="专业课程" prop="lesson">
              <el-input
                placeholder="请输入"
                class="userform-input"
                :rows="3"
                v-model="memberForm.lesson"
              ></el-input>
            </el-form-item>
            <el-form-item label="专业成绩" prop="record">
              <el-input
                placeholder="请输入"
                class="userform-input"
                :rows="3"
                v-model="memberForm.record"
              ></el-input>
            </el-form-item>
          </template>
          <template v-if="memberForm.type === 2 || memberForm.type === 3">
            <el-form-item
              label="学习课程"
              prop="lesson"
              :rules="{ required: true, message: '学习课程不能为空' }"
            >
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="memberForm.lesson"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="学习成绩"
              prop="record"
              :rules="{ required: true, message: '学习成绩不能为空' }"
            >
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="memberForm.record"
              ></el-input>
            </el-form-item>
          </template>
          <template v-if="memberForm.type === 1">
            <el-form-item label="学历" class="userform-input" prop="education">
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="memberForm.education"
              ></el-input>
            </el-form-item>
            <el-form-item label="专业" class="userform-input" prop="major">
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="memberForm.major"
              ></el-input>
            </el-form-item>
          </template>
          <el-form-item label="英语语言成绩" class="userform-input" prop="english">
            <el-input
              placeholder="请输入"
              class="userform-input"
              v-model="memberForm.english"
            ></el-input>
          </el-form-item>
          <el-form-item label="爱好" class="userform-input" prop="hobby">
            <el-input
              placeholder="请输入"
              class="userform-textarea"
              type="textarea"
              v-model="memberForm.hobby"
              :rows="3"
            ></el-input>
          </el-form-item>
          <el-form-item label="特长" class="userform-input" prop="specialty">
            <el-input
              placeholder="请输入"
              class="userform-textarea"
              type="textarea"
              :rows="3"
              v-model="memberForm.specialty"
            ></el-input>
          </el-form-item>

          <template v-if="memberForm.type !== 1">
            <h2>其他选项</h2>
            <el-form-item label="课外辅导" prop="is_coach" :rules="{ required: true, message: '课外辅导不能为空' }">
              <el-radio :label="1" v-model="memberForm.is_coach">有</el-radio>
              <el-radio :label="2" v-model="memberForm.is_coach">无</el-radio>
            </el-form-item>
            <el-form-item label="参加活动" prop="activity">
              <el-input
                placeholder="请输入"
                class="userform-textarea"
                type="textarea"
                :rows="3"
                v-model="memberForm.activity"
              ></el-input>
            </el-form-item>
            <el-form-item label="获得奖项" prop="prize">
              <el-input
                placeholder="请输入"
                class="userform-textarea"
                type="textarea"
                :rows="3"
                v-model="memberForm.prize"
              ></el-input>
            </el-form-item>
            <el-form-item label="参加夏令营" prop="is_summer_camp">
              <el-radio label="0" v-model="memberForm.is_summer_camp">没有参加</el-radio>
              <el-radio label="1" v-model="memberForm.is_summer_camp">国内</el-radio>
              <el-radio label="2" v-model="memberForm.is_summer_camp">国外</el-radio>
            </el-form-item>
            <el-form-item label="夏令营内容" prop="summer_camp">
              <el-input
                placeholder="请输入"
                class="userform-textarea"
                type="textarea"
                :rows="3"
                v-model="memberForm.summer_camp"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否想要出国" prop="is_abroad" label-width="110px" :rules="{ required: true, message: '是否不能为空' }">
              <el-radio :label="1" v-model="memberForm.is_abroad">是</el-radio>
              <el-radio :label="2" v-model="memberForm.is_abroad">否</el-radio>
            </el-form-item>
            <el-form-item label="选择留学国家" prop="abroad_country" label-width="110px">
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="memberForm.abroad_country"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="是否跟踪"
              prop="is_follow"
              :rules="{ required: true, message: '是否跟踪为必选项' }"
            >
              <el-radio label="1" v-model="memberForm.is_follow">是</el-radio>
              <el-radio label="2" v-model="memberForm.is_follow">否</el-radio>
            </el-form-item>
          </template>
          <template v-if="memberForm.type === 1">
            <h2>家庭信息</h2>
            <el-form-item label="职业" class="userform-input" prop="occupation" label-width="110px">
              <el-input
                placeholder="请输入"
                class="userform-textarea"
                type="textarea"
                :rows="3"
                v-model="memberForm.occupation"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="家庭年收入"
              class="userform-input"
              prop="family_income"
              label-width="110px"
            >
              <el-input
                placeholder="请输入"
                class="userform-input"
                type="number"
                v-model="memberForm.family_income"
                oninput="value=value.replace('-', '')"
                :min="0"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否想要出国" prop="is_abroad" label-width="110px" :rules="{ required: true, message: '是否不能为空' }">
              <el-radio :label="1" v-model="memberForm.is_abroad">是</el-radio>
              <el-radio :label="2" v-model="memberForm.is_abroad">否</el-radio>
            </el-form-item>
            <el-form-item label="选择留学国家" prop="abroad_country" label-width="110px">
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="memberForm.abroad_country"
              ></el-input>
            </el-form-item>
            <el-form-item label="孩子就读学校" prop="school" label-width="110px">
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="memberForm.school"
              ></el-input>
            </el-form-item>
            <el-form-item label="孩子就读阶段" prop="stage" label-width="110px">
              <el-input
                placeholder="请输入"
                class="userform-input"
                v-model="memberForm.stage"
              ></el-input>
            </el-form-item>
          </template>

          <!-- <el-form-item label="注册时间" prop="create_at">
            <el-date-picker
              v-model="memberForm.create_at"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <div class="line"></div>  -->

          <div class="line"></div>

          <h2>账号信息</h2>
          <el-form-item
            label="QQ号码"
            prop="qq"
            :rules="{ required: true, message: 'QQ号码不能为空' }"
          >
            <el-input
              placeholder="请输入"
              class="userform-input"
              v-model="memberForm.qq"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              placeholder="请输入"
              class="userform-input"
              type="password"
              v-model="memberForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="头像"
            prop="image"
          >
            <div class="flex-start">
              <img v-if="memberForm.image" :src="api + memberForm.image" alt="" class="avatar" />
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

      <div slot="title">{{ formMode === "ADD" ? "新增客户" : "编辑客户" }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="handleLogin">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import table from "@/mixins/table";
import { queryCitys } from "@/api/users/user";
import {
  getMemberList,
  uploadPicture,
  addMember,
  editMember,
  getMemberInfo,
  followMember,
} from "@/api/users/member";
import Pagination from "@/components/Pagination";
import avatar from "@/assets/images/avatar.png";

import { isvalidatemobile, validEmail } from "@/utils/validate";
export default {
  components: { Pagination },
  data() {
    const that = this;
    const validatePhone = (rule, value, callback) => {
      const teshu = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
      );
      const val = value.trim();
      if (teshu.test(val)) {
        callback(new Error("不能输入特殊字符"));
      }
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    const valiIcon = (rule, value, callback) => {
      // 图片验证
      if (!this.hasFmt) {
        callback(new Error("请上传图片"));
      } else {
        callback();
      }
    };

    return {
      api: process.env.VUE_APP_BASE_PICTURE_URL,
      avatar: avatar,
      formMode: "ADD", // 弹框的模式，新增（ADD）或编辑（EDIT）
      total: 0,
      advSearch: {
        // 高级查询表单
        page: 1,
        strip: 10,
        name: "",
        type: "",
        phone: "",
        register_time: "",
        school: "",
      },
      types: [
        {
          value: 1,
          label: "家长",
        },
        {
          value: 2,
          label: "中学生",
        },
        {
          value: 3,
          label: "高中生",
        },
        {
          value: 4,
          label: "大学生",
        },
      ],
      customerList: [], // 客户列表
      showDialog: false,
      region: {
        province: "",
        city: "",
        selProv: "",
        selCity: "",
      },
      //新增用户表单数据
      memberForm: {
        type: "",
        name: "",
        age: "",
        gender: 2,
        phone: "",
        email: "",
        education: "",
        major: "",
        english: "",
        hobby: "",
        specialty: "",
        occupation: "",
        family_income: "",
        is_abroad: 1,
        abroad_country: "",
        school: "", //就读学校
        stage: "", //就读阶段
        //is_contract: "",   //是否签订合同
        create_at: "",
        lesson: "",
        record: "",
        is_coach: 1,
        activity: "",
        prize: "",
        summer_camp: "",
        is_summer_camp: "0",
        is_follow: "2",
        password: "",
        image: "",
        qq: "",
        region: "", // 地区
      },
      id: "", //用于编辑

      // 表单验证规则
      rules: {
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        email: [{ required: true, trigger: "blur", validator: validateEmail }],
        education: [
          { required: true, trigger: "blur", message: "学历不能为空" },
          {
            validator(rule, value, callback) {
              const teshu = new RegExp(
                "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
              );
              const val = value.trim();
              console.log(val)
              if (teshu.test(val)) {
                callback(new Error("不能输入特殊字符"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        major: [
          { required: true, trigger: "blur", message: "专业不能为空" },
          {
            validator(rule, value, callback) {
              const teshu = new RegExp(
                "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
              );
              const val = value.trim();
              if (teshu.test(val)) {
                callback(new Error("不能输入特殊字符"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        name: [
          { required: true, trigger: "blur", message: "姓名不能为空" },
          { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
          {
            validator(rule, value, callback) {
              const zhReg = /^[\u4e00-\u9fa5]*$/;
              const enReg = /^[a-zA-Z]*$/;
              const val = value.trim();
              console.log(val);
              console.log('value=' + value)
              if (!zhReg.test(val) && !enReg.test(val)) {
                callback(new Error("请输入中文或英文字符，且不能混合输入"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        age: [
          { required: true, trigger: "blur", message: "年龄范围在1-99岁之间" },
          { type: "number", message: "年龄必须为数字值" },
          {
            validator(rule, value, callback) {
              const reg = /^\d+$|^\d+[.]?\d+$/;
              if (reg.test(value) < 1) {
                callback(new Error("年龄必须大于1岁"));
              } else if (reg.test(value) > 99) {
                callback(new Error("年龄必须小于99岁"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        english: [
          { trigger: 'blur', message: "英语成绩不能为空" },
          {
            validator(rule, value, callback) {
              const teshu = new RegExp(
                "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
              );
              if (teshu.test(value)) {
                callback(new Error("不能输入特殊字符"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        occupation: [{ required: true, trigger: "blur", message: "职业不能为空" }],
        family_income: [{ required: true, trigger: "blur", message: "家庭收入不能为空" }],
        is_abroad: [{ required: true, trigger: "blur", message: "是否不能为空" }],
        school: [{ required: true, trigger: "blur", message: "就读学校不能为空" }],
        stage: [{ required: true, trigger: "blur", message: "就读阶段不能为空" }],
        create_at: [{ required: true, message: "请选择日期", trigger: "change" }],
        lesson: [{ required: true, trigger: "blur", message: "课程不能为空" }],
        record: [{ required: true, trigger: "blur", message: "成绩不能为空" }],
        is_coach: [{ required: true, trigger: "blur", message: "课外辅导不能为空" }],
        activity: [{ required: true, trigger: "blur", message: "参加活动不能为空" }],
        prize: [{ required: true, trigger: "blur", message: "是否获取奖项不能为空" }],
        is_summer_camp: [{ required: true, trigger: "blur", message: "是否参加夏令营不能为空" }],
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }],
      },
    };
  },
  mounted() {
    this.getCustomerList();
  },
  created() {
    this.getCitys();
  },
  mixins: [table],
  watch: {
    "region.selProv": function (id) {
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
    "region.selCity": function (city) {
      let province = "";
      for (let prov of this.region.province) {
        if (prov.id === this.region.selProv) {
          province = prov.name;
          break;
        }
      }
      this.memberForm.region = province + city;
    },
  },
  methods: {
    //新增按钮
    addUser() {
      this.showDialog = true;
      this.formMode = "ADD";
    },
    followMember(row) {
      const id = row.id;
      followMember(id).then((res) => {
        if (res.code == "200") {
          this.$message({ type: "success", message: res.mes });
        }
      });
    },
    // 重置
    reactAll() {
      this.$refs.advSearch.resetFields();
      this.getCustomerList(); 

    },
    // 获取省份和城市数据
    getCitys() {
      queryCitys().then((res) => {
        this.region.province = res;
        const map = new Map();
        res.forEach((ele) => {
          map.set(ele.name, ele);
        });
        this.map = map;
      });
    },
    //编辑按钮
    onEdit(row) {
      console.log(row)
      let regs = /(?<province>[^省]+省|.+自治区|.+市)(?<city>[^自治州]+自治州|[^市]+市|[^盟]+盟|[^地区]+地区|.+区划)(?<area>[^市]+市|[^县]+县|[^旗]+旗|.+区)?(?<town>[^区]+区|.+镇|.+乡|.+街道|.+服务中心)?(?<village>.*)/;
      let zxCity = /(?<province>.*)\1市/;
      let customer = this.customerList[row];

      let region = this.region;
      if (row.region) {
        let addr = !!row.region ? row.region : "";
        const matched = row.region.match(regs);
        region.selProv = !!matched.groups.province ? this.map.get(matched.groups.province).id : "";
        this.$nextTick((vm) => {
          region.selCity = !!matched.groups.city ? matched.groups.city : "";
        });
      }
      this.id = row.id;
      this.showDialog = true;
      this.formMode = "EDIT";
      getMemberInfo(this.id).then((res) => {
        if (res.code == "200") {
          const mes = res.mes;
          this.memberForm.type = mes.type;
          this.memberForm.name = mes.name;
          this.memberForm.age = mes.age;
          this.memberForm.gender = mes.gender;
          this.memberForm.phone = mes.phone;
          this.memberForm.email = mes.email;
          this.memberForm.education = mes.education;
          this.memberForm.major = mes.major;
          this.memberForm.english = mes.english;
          this.memberForm.hobby = mes.hobby;
          this.memberForm.specialty = mes.specialty;
          this.memberForm.occupation = mes.occupation;
          this.memberForm.family_income = mes.family_income;
          this.memberForm.is_abroad = mes.is_abroad;
          this.memberForm.abroad_country = mes.abroad_country;
          this.memberForm.school = mes.school;
          this.memberForm.stage = mes.stage;
          this.memberForm.create_at = mes.create_at;
          this.memberForm.lesson = mes.lesson;
          this.memberForm.record = mes.record;
          this.memberForm.is_coach = mes.type == 1 ? "2" : mes.is_coach;
          this.memberForm.activity = mes.activity;
          this.memberForm.prize = mes.prize;
          this.memberForm.summer_camp = mes.summer_camp;
          this.memberForm.is_summer_camp = mes.is_summer_camp + "";
          this.memberForm.is_follow = mes.is_follow + "";
          this.memberForm.password = mes.password;
          this.memberForm.qq = mes.qq;
          this.memberForm.image = mes.image == "暂无" ? "" : mes.image;
        }
      });
    },
    // 获取客户列表
    async getCustomerList() {
      const res = await getMemberList({ ...this.advSearch, page: this.advSearch.page - 1 });
      this.total = res.mes.total;

      let result = res.mes.member;
      result.map((item) => {
        if (item.type == 1) {
          item.class = "家长";
        } else if (item.type == 2) {
          item.class = "中学生";
        } else if (item.type == 3) {
          item.class = "高中生";
        } else {
          item.class = "大学生";
        }
      });
      this.customerList = result;
      // if(this.customerList.is_contract === 2) {
      //   this.customerList.is_contract = '未签'
      // }else{
      //   this.customerList.is_contract = '已签'
      // }
    },

    // 监听大学生、家长、中高学生状态有没有改变
    currStationChange(val) {
      console.log('currentDtation' ,val);
      this.$refs.memberForm.clearValidate();
      this.$refs.memberForm.resetFields();
    },

    // 编辑保存按钮
    handleLogin() {
      if (this.formMode == "ADD") {
        if (!this.memberForm.image) {
          this.$message({ type: "danger", message: "请上传头像" });
          return;
        }
        this.$refs.memberForm.validate(async (valid) => {
          if (valid) {
            const res = await addMember(this.memberForm);
            if (res.code == "200") {
              this.$message({ type: "success", message: res.mes });
              this.showDialog = false;
              this.getCustomerList();
              this.memberForm.type = '';
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$refs.memberForm.validate(async (valid) => {
          this.memberForm.id = this.id;
          if (valid) {
            const res = await editMember(this.memberForm);
            if (res.code == "200") {
              this.$message({ type: "success", message: res.mes });
              this.showDialog = false;
              this.getCustomerList();
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    // 上传图片
    beforeUpload(file) {
      let formData = new FormData();
      formData.append("file", file);
      // console.log(file)
      uploadPicture(formData).then((res) => {
        this.memberForm.image = res.path;
      });
      return false;
    },
    handleclose() {
      this.$nextTick(() => {
        this.$refs["memberForm"].resetFields();
        this.showDialog = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";

.orange {
  background-color: #f7931e;
  border-color: #f7931e;
  color: #ffffff;
}

.grid-c {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 340px) 1fr;
  grid-template-rows: repeat(2, 50%);
  grid-column-gap: 20px;
  grid-template-areas: "a b c " "d e f ";
  // width: calc(100% - 60px);
}

@media screen and (max-width: 1440px) {
  .grid-c {
    grid-template-columns: repeat(3,310px) 1fr;
  }
}

.table {
  // 表头字体
  ::v-deep th {
    font-size: 16px !important;
  }
}

@media screen and (max-width: 1440px) {
}

@media screen and (max-width: 1366px) {
  .adv-search {
    ::v-deep .el-input {
      width: 220px;
    }
  }
}
.dialog-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0 100px;

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
.userform-textarea {
  width: 500px;
}
</style>

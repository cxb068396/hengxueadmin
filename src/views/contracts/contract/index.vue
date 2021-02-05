<template>
  <div class="app-container">
    <!-- 高级查询 -->
    <div class="adv-search">
      <el-form
        :model="advSearch"
        label-position="right"
        label-suffix=":"
        label-width="100px"
        ref="advSearch"
      >
        <div class="grid-c">
          <el-form-item label="合同名称" prop="name">
            <el-input
              v-model="advSearch.name"
              class="adv-search-input"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="创建时间" prop="time">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="advSearch.time"
              type="date"
              clearable
              placeholder="请选择"
            ></el-date-picker>
          </el-form-item>

          <span data-tips="网格布局展位符"></span>
          <span data-tips="网格布局展位符"></span>

          <el-form-item label="合同编号" prop="number">
            <el-input
              v-model="advSearch.number"
              class="adv-search-input"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="创建人" prop="username">
            <el-input
              v-model="advSearch.username"
              class="adv-search-input"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label-width="auto">
            <el-button
              type="primary"
              style="margin-left: 30px;margin-right: 12px;"
              @click="getList"
            >
              查询
            </el-button>
            <el-button class="reset" @click="resetAdvSearch">重置</el-button>
          </el-form-item>
        </div>
      </el-form>

      <el-row>
        <div class="">
          <!-- <el-upload
            action=""
            style="display: inline-block; "
            :before-upload="imContract"
            :multiple="false"
            :show-file-list="false"
            accept="application/pdf"
            v-permission="'upload_contract'"
          >
            <el-button class="mr-24 orange">
              <i class="el-icon-upload2"></i>
              导入合同
            </el-button>
          </el-upload> -->

          <el-button
            type="primary"
            class="orange opt-button"
            @click="onAddContract"
            v-permission="'down_contract'"
          >
            <svg-icon icon-class="contract-add"></svg-icon>
            新增合同
          </el-button>

          <el-button
            type="primary"
            class="orange opt-button"
            @click="exContract"
            v-permission="'down_contract'"
          >
            <svg-icon icon-class="contract-export"></svg-icon>
            导出
          </el-button>

          <!-- <el-button
            type="primary"
            class="orange opt-button"
            @click="rmContract"
            v-permission="'down_contract'"
          >
            <svg-icon icon-class="contract-del"></svg-icon>
            删除
          </el-button> -->

          <el-button
            type="primary"
            class="orange opt-button"
            @click="voidContract"
            v-permission="'down_contract'"
          >
            作废
          </el-button>
        </div>
      </el-row>
    </div>

    <!-- 数据表格 -->
    <el-table
      :data="list"
      :cell-style="tableStyle.body"
      :header-cell-style="tableStyle.header"
      style="margin-top: 25px;"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" prop="id"></el-table-column>
      <el-table-column prop="name" label="合同名称">
        <template slot-scope="scope">
          <el-link type="primary" style="font-size: 16px;" @click="toDetail(scope.row.id)">
            {{ scope.row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="合同编号"></el-table-column>
      <el-table-column prop="member_name" label="客户"></el-table-column>
      <el-table-column prop="username" label="创建人"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-link v-if="scope.row.status === 1" style="font-size: 16px;">起草中</el-link>
          <el-link v-if="scope.row.status === 2" style="font-size: 16px;">待签约</el-link>
          <el-link v-if="scope.row.status === 3" style="font-size: 16px;">已签约</el-link>
          <el-link v-if="scope.row.status === 4" style="font-size: 16px;">已作废</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="create_at" label="创建时间"></el-table-column>
      <el-table-column prop="update_at" label="更新时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-link type="primary" @click="preview(scope.$index)">预览</el-link> -->
          <el-link type="primary" @click="edit(scope.$index)" style="margin-right: 20px;">
            编辑
          </el-link>
          <!-- 发起签约 跟个人工作平台相关联 -->
          <el-link type="primary" @click="qianyue()">发起签约</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex-center row" style="height: 60px">
      <pagination :page.sync="page" @pagination="onPagination"></pagination>
    </div>

    <el-dialog
      :visible.sync="showDialog"
      width="1060px"
      :title="mode === 'ADD' ? '新增合同' : '编辑合同'"
      custom-class="dialog-dialog"
      @close="onContractClose"
    >
      <!-- 步骤条 -->
      <el-steps :active="active" align-center>
        <el-step
          title="合同基本信息"
          description=""
          @click.native="switchStep(1)"
          :style="step >= active ? 'cursor: pointer' : ''"
        ></el-step>
        <el-step
          title="合同内容与附件"
          description=""
          @click.native="switchStep(2)"
          :style="step >= active ? 'cursor: pointer' : ''"
        ></el-step>
        <el-step
          title="合同费用明细"
          description=""
          @click.native="switchStep(3)"
          :style="step >= active ? 'cursor: pointer' : ''"
        ></el-step>
      </el-steps>
      <div style="height: 46px;"></div>

      <!-- step 1 合同基本信息 -->
      <div class="dialog-form" v-show="active === 1">
        <h1 class="form-title">合同基本信息</h1>
        <div class="line" style="margin-bottom: 56px;"></div>
        <el-form
          label-width="120px"
          label-suffix=":"
          label-position="right"
          :model="contractForm"
          :rules="contractFormRule"
          ref="contractForm"
          :disabled="contractForm.status == 3 ? true : false"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name" label="合同类别">
                <el-input
                  class="dialog-input"
                  placeholder="请输入"
                  :value="mode === 'ADD' ? '新增' : '变更'"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="" label="合同编号">
                <el-input
                  :value="contractForm.number || ''"
                  class="dialog-input"
                  placeholder="系统自动生成"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name" label="合同名称">
                <el-input
                  v-model="contractForm.name"
                  class="dialog-input"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="status" label="合同状态">
                <el-select class="dialog-input" :value="contractForm.status" disabled>
                  <el-option
                    v-for="(item, index) in ['起草中', '待签约', '已签约', '已作废']"
                    :key="item"
                    :value="index + 1"
                    :label="item"
                  ></el-option>
                </el-select>
                <!-- <el-input class="dialog-input" :value="contractForm.status" disabled></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name" label="客户姓名">
                <el-input
                  v-model="contractForm.member.name"
                  class="dialog-input"
                  placeholder="请输入"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="member.phone"
                label="客户联系方式"
                :rules="{ required: true, message: '请输入客户手机号', trigger: 'blur' }"
              >
                <el-input
                  :disabled="mode === 'EDIT' ? true : false"
                  v-model="contractForm.member.phone"
                  class="dialog-input"
                  placeholder="请输入"
                  @input.native="contractPhone"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="begin_time" label="合同开始时间">
                <el-date-picker
                  v-model="contractForm.begin_time"
                  class="dialog-input"
                  placeholder="请选择"
                  value-format="yyyy-MM-dd"
                  :picker-options="contractBeginDateOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="end_time" label="合同结束时间">
                <el-date-picker
                  v-model="contractForm.end_time"
                  class="dialog-input"
                  placeholder="请选择"
                  value-format="yyyy-MM-dd"
                  :picker-options="contractEndDateOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="reminder" label="合同到期提醒">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="contractForm.reminder"
                  class="dialog-input"
                  placeholder="请选择"
                  :picker-options="contractReminderOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="money" label="合同金额">
                <el-input
                  v-model="contractForm.money"
                  class="dialog-input"
                  placeholder="请输入"
                ></el-input>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="合同金额的单位为元"
                  placement="top-end"
                >
                  <el-button class="btn-tooltip">
                    <i class="el-icon-question" style="font-size: 18px;"></i>
                  </el-button>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            style="text-align: right;padding-right: 40px;margin-top: 32px;margin-bottom: 35px;"
          >
            <el-button
              :type="firStepPass ? 'primary' : 'info'"
              :disabled="!firStepPass ? true : false"
              @click="onConfirmContract"
            >
              确认
            </el-button>
          </el-row>
        </el-form>
      </div>

      <!-- step 2 文件上传部分 -->
      <div class="dialog-uploader" v-show="active === 2">
        <h1 class="form-title">合同基本信息</h1>
        <div class="line"></div>
        <!-- 上传合同 -->
        <div class="flex-center">
          <el-upload
            action=""
            multiple
            :limit="1"
            :show-file-list="false"
            :drag="true"
            :before-upload="beforeContractUpload"
            :disabled="contractForm.status == 3 ? true : false"
          >
            <div class="upload-wrap flex-center column">
              <svg-icon icon-class="contract-folder" class="icon-folder"></svg-icon>
              <span class="tip1">点击将文件拖拽到这里上传</span>
              <span class="tip2">支持扩展名：.pdf</span>
            </div>
          </el-upload>

          <div class="progress-wrap scroll-bar">
            <upload-list-item
              v-for="item in contractFileList"
              :key="item.uid"
              :filename="item.name"
              @rmUploadListItem="removeFile(index, 'contract')"
            ></upload-list-item>
          </div>
        </div>

        <h1 class="form-title">合同附件</h1>
        <div class="line"></div>

        <!-- 上传合同附件 -->
        <div class="flex-center">
          <el-upload
            action=""
            multiple
            :show-file-list="false"
            :drag="true"
            :before-upload="beforeExtraUpload"
            :disabled="contractForm.status == 3 ? true : false"
          >
            <div class="upload-wrap flex-center column">
              <svg-icon icon-class="contract-folder" class="icon-folder"></svg-icon>
              <span class="tip1">点击将文件拖拽到这里上传</span>
              <span class="tip2">支持扩展名：.pdf...</span>
            </div>
          </el-upload>
          <div class="progress-wrap  scroll-bar">
            <upload-list-item
              v-for="(item, index) in extraFileList"
              :key="item.uid"
              :filename="item.name"
              @rmUploadListItem="removeFile(index, 'extra')"
            ></upload-list-item>
          </div>
        </div>

        <el-row style="text-align: right;padding-right: 40px;margin-top: 32px;margin-bottom: 35px;">
          <el-button
            :type="secStepPass ? 'primary' : 'info'"
            :disabled="!secStepPass ? true : false"
            @click="onUploadConfirm"
          >
            确认
          </el-button>
        </el-row>
      </div>

      <!-- step 3 合同中项目费用明细 -->
      <div class="dialog-fee" v-show="active === 3">
        <h1 class="form-title">合同基本信息</h1>
        <el-button
          :disabled="contractForm.status == 3 ? true : false"
          type="primary"
          class="btn-add-scheme orange"
          @click="(showForm = true) && (schemeMode = 'ADD')"
        >
          新增收费项目
        </el-button>
        <div class="line"></div>
        <div style="height: 396px; overflow: scroll;">
          <scheme-item
            v-for="(item, index) in contractForm.product"
            :key="item.id"
            :scheme="item"
            @rmScheme="removeScheme(index)"
            @edScheme="editScheme(index)"
          ></scheme-item>
        </div>
        <el-row
          style="text-align: right;padding-right: 40px;margin-top: 32px;margin-bottom: 35px;"
          v-if="contractForm.status != 3"
        >
          <el-button
            :type="contractForm.product.length > 0 ? 'primary' : 'info'"
            :disabled="!contractForm.product.length > 0 ? true : false"
            @click="onSaveContract"
          >
            确认
          </el-button>
        </el-row>
      </div>
    </el-dialog>

    <!-- 新增收费项目 表单 -->
    <el-dialog
      :visible.sync="showForm"
      width="500px"
      :title="schemeMode === 'ADD' ? '新增收费项目' : '编辑收费项目'"
      @close="onSchemeDialogClose"
    >
      <el-form
        label-width="100px"
        class="scheme-form"
        ref="schemeForm"
        label-suffix=":"
        label-position="right"
        :model="schemeForm"
        :rules="schemeFormRule"
      >
        <el-form-item
          prop="id"
          label="项目名称"
          :rules="{ required: true, message: '请选择项目名称', trigger: 'blue' }"
        >
          <el-select v-model="schemeForm.id" class="scheme-input" placeholder="请选择">
            <el-option
              v-for="item in schemeList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
              :disabled="schemeIdSet.has(item.id) ? true : false"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="product_cost" label="项目费用">
          <el-input
            v-model="schemeForm.product_cost"
            class="scheme-input"
            placeholder="请输入"
          ></el-input>
          元
        </el-form-item>
        <el-form-item prop="payable" label="应付金额">
          <el-input
            v-model="schemeForm.payable"
            class="scheme-input"
            placeholder="请输入"
          ></el-input>
          元
        </el-form-item>
        <el-form-item prop="begin_time" label="开始时间">
          <el-date-picker
            v-model="schemeForm.begin_time"
            class="scheme-input"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            :picker-options="schemeBeginDateOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="end_time" label="结束时间">
          <el-date-picker
            v-model="schemeForm.end_time"
            class="scheme-input"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            :picker-options="schemeEndDateOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input
            v-model="schemeForm.remark"
            type="textarea"
            class="scheme-input scheme-textarea"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-row style="text-align: right;padding-right: 40px;margin-top: 32px;margin-bottom: 35px;">
        <el-button type="primary" @click="onConfirm">
          确认
        </el-button>
      </el-row>
    </el-dialog>

    <el-dialog :visible.sync="showDetail" custom-class="detail-dialog">
      <contract-detail :id="detailId"></contract-detail>
    </el-dialog>
  </div>
</template>

<script>
// 类库引入
import dayjs from "dayjs";
// 子组件引入
import UploadListItem from "./UploadListItem";
import SchemeItem from "./SchemeItem";
import ContractDetail from "../contract_detail";
// 通用方法导入
import table from "@/mixins/table.js";
import {
  getContracts,
  uploadContracts,
  downloadContracts,
  getProduct,
  saveContract,
  signProduct,
  editContract,
  getContract,
  voidContract
} from "@/api/contract.js";
import { downloadFile, debounce } from "@/utils/index";

// 状态对应文本
const contractStatus = {
  "1": "起草中",
  "2": "待签约",
  "3": "已签约",
  "4": "已作废"
};

export default {
  data() {
    const that = this;
    return {
      advSearch: {},
      list: [],
      selectedId: [],
      listMap: null,
      uploadOpt: {
        accept: ["application/pdf", "application/word"].join("."),
        accessType: ["pdf"] // 允许上传文件类型
      },
      showDialog: false,
      showForm: false,
      contractFileList: [], // 合同文件列表
      extraFileList: [], // 附件列表
      active: 1, // 当前活跃步骤
      step: 1, // 最大可进行到第几步
      going: true, // 控制新增合同form表单弹框关闭时是否弹出提示
      schemeList: [], // 新增方案列表
      contractForm: {
        id: "",
        name: "", // 合同名称
        begin_time: null,
        end_time: null,
        reminder: null, // 到期提醒时间
        money: "", // 合同金额
        mid: "", // 客户 id
        address: "", // 合同存放地址
        enclosure: "", // 附件地址
        extraFile: [], // 附件数组
        product: [], // 产品数组
        status: 1,
        member: {
          name: "",
          phone: ""
        }
      },
      contractPhone: null, // 客户联系方式防抖处理函数
      mode: "ADD", // 模式，ADD 新增；EDIT 编辑；
      schemeMode: "ADD", // 收费项目编辑模式，ADD 新增；EDIT 编辑；
      schemeEditInd: Infinity, // 收费项目编辑时在列表中的索引
      showDetail: false,
      detailId: "",
      // 新增项目表单
      schemeForm: {
        id: "",
        image: "",
        description: "",
        begin_time: "",
        end_time: "",
        product_cost: "", // 项目费用
        payable: "", // 应付金额
        remark: ""
      },
      schemeIdSet: new Set(), // 新增收费项目 时不可选中产品id集合
      // 合同表单验证规则
      contractFormRule: {
        name: { required: true, message: "请输入合同名称", trigger: "blur" },
        begin_time: { required: true, message: "请选择合同开始时间", trigger: "blur" },
        end_time: { required: true, message: "请选择合同结束时间", trigger: "blur" },
        reminder: { required: true, message: "请选择合同到期提醒时间", trigger: "blur" },
        money: [
          { required: true, message: "请输入合同金额", trigger: "blur" },
          { pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正确的金额" }
        ],
        "member.phone": { required: true, message: "请输入客户联系方式", trigger: "blur" }
      },
      // 新增项目验证规则
      schemeFormRule: {
        name: { required: true, message: "请输入名称", trigger: "blur" },
        begin_time: { required: true, message: "请选择开始时间", trigger: "blur" },
        end_time: { required: true, message: "请选择结束时间", trigger: "blur" },
        product_cost: [
          { required: true, message: "请输入项目费用", trigger: "blur" },
          { pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正确的金额" }
        ],
        payable: [
          { required: true, message: "请输入应付金额", trigger: "blur" },
          { pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正确的金额" }
        ]
      },
      // 合同开始日期 配置
      contractBeginDateOptions: {
        disabledDate(date) {
          const yesterday = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
          const curr = date.getTime();
          if (that.contractForm.end_time) {
            const end = new Date(that.contractForm.end_time).getTime();
            return yesterday > curr || curr > end;
          } else {
            return yesterday > curr;
          }
        }
      },
      // 合同结束日期配置
      contractEndDateOptions: {
        disabledDate(date) {
          let today = null;
          const curr = date.getTime();
          // 开始日期已选
          if (that.contractForm.begin_time) {
            today = new Date(that.contractForm.begin_time).getTime();
            return today > curr;
          } else {
            today = new Date().getTime();
            return today > curr;
          }
        }
      },
      // 合同提醒时间配置
      contractReminderOptions: {
        disabledDate(date) {
          const curr = date.getTime();
          const { begin_time, end_time } = that.contractForm;
          if (begin_time && end_time) {
            const start = new Date(begin_time);
            const end = new Date(end_time) - 1000 * 60 * 60 * 24;
            return curr > end || curr < start;
          } else {
            return false;
          }
        }
      },
      // 新增收费项目 开始日期 配置
      schemeBeginDateOptions: {
        disabledDate(date) {
          const curr = date.getTime();
          const start = new Date(that.contractForm.begin_time).getTime();
          const end = that.schemeForm.end_time
            ? new Date(that.schemeForm.end_time).getTime()
            : new Date(that.contractForm.end_time).getTime();
          return start > curr || curr > end;
        }
      },
      // 新增收费项目 结束日期 配置
      schemeEndDateOptions: {
        disabledDate(date) {
          const curr = date.getTime();
          let start = that.schemeForm.begin_time
            ? new Date(that.schemeForm.begin_time).getTime()
            : new Date(that.contractForm.begin_time).getTime();
          let end = new Date(that.contractForm.end_time);
          return start > curr || curr > end;
        }
      }
    };
  },
  computed: {
    firStepPass() {
      const { name, begin_time, end_time, reminder, money, mid } = this.contractForm;
      return !!name && !!begin_time && !!end_time && !!reminder && !!money && !!mid;
    },
    secStepPass() {
      return this.contractFileList.length > 0;
    }
  },
  watch: {
    "contractForm.extra": function(list) {
      this.contractForm.enclosure = list.join(",");
    },
    "schemeForm.id": function(id) {
      for (let i in this.schemeList) {
        if (this.schemeList[i].id === id) {
          this.$set(this.schemeForm, "name", this.schemeList[i].name);
          break;
        }
      }
    }
  },
  components: { UploadListItem, SchemeItem, ContractDetail },
  mixins: [table],
  created() {
    this.initAdvSearch();
    this.list = [{}];
    this.getList();

    // 注册防抖函数
    this.contractPhone = debounce(this.onContractPhone, 300);
  },
  methods: {
    // 高级查询 初始化
    initAdvSearch() {
      this.advSearch = {
        name: "",
        username: "",
        number: "",
        time: ""
      };
    },

    // 高级查询 请求列表数据
    async getList() {
      let { username, number, time, name } = this.advSearch;
      time = time ? dayjs(time).format("YYYY-MM-DD ") : "";
      try {
        const res = await getContracts({
          username,
          number,
          time,
          name,
          page: this.page.number - 1,
          strip: this.page.size
        });
        this.list = res.mes.contracts;
        this.listMap = res.mes.contracts.reduce((prev, curr) => prev.set(curr.id, curr), new Map());
        this.page.total = res.mes.total;
      } catch (err) {
        this.$message({ type: "error", message: err.mes });
      }
    },

    // 高级查询 重置
    resetAdvSearch() {
      this.$refs.advSearch.resetFields();
      this.page.number = 1;
      this.getList();
    },

    // strip 每页条数
    // 分页处理
    onPagination(page) {
      this.page = page;
      this.getList();
    },

    // 按钮 预览合同
    preview(index) {
      const link = document.createElement("a");
      link.setAttribute("target", "_blank");
      link.href = process.env.VUE_APP_BASE_PICTURE_URL + "/" + this.list[index].address;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // 按钮 导入合同
    imContract(file) {
      let formData = new FormData();
      const extName = file.name.split(".").pop();
      if (!this.uploadOpt.accessType.includes(extName)) {
        this.$message({ type: "error", message: "请上传pdf文件" });
        return false;
      }
      formData.append("contract", file);
      uploadContracts(formData).then(res => {
        // console.log(res);
        this.getList();
      });
      return false;
    },

    // 按钮 导出合同
    exContract() {
      if (this.selectedId.length === 0) {
        this.$message("请在表格中选中一项再点击导出");
        return;
      }
      // 每次请求下载一个文件
      // 文件名和扩展名通过map对象取得
      this.selectedId.forEach(id => {
        downloadContracts(id).then(res => {
          const name = this.listMap.get(id).name;
          const ext = this.listMap
            .get(id)
            .address.split(".")
            .pop();
          downloadFile(res, name, ext);
        });
      });
    },

    // 按钮 删除合同
    rmContract() {},

    // 按钮 废弃合同
    voidContract() {
      if (this.selectedId.length === 0) {
        this.$message("请在表格中选中一项再点击作废");
        return;
      }
      voidContract(this.selectedId.join(","))
        .then(res => {
          this.$message({ type: "success", message: "作废合同成功" });
          this.getList();
        })
        .catch(err => console.log(err));
    },

    // 表格 选中状态变化
    selectionChange(selection) {
      this.selectedId = selection.map(ele => ele.id);
    },

    // 表格按钮 “编辑”点击事件处理
    edit(index) {
      // todo 获取对应合同编辑时用到的信息
      const id = this.list[index].id;
      const form = this.contractForm;
      getContract(id)
        .then(res => {
          console.log(res);
          if (res.code === "200") {
            const { product, list, contract } = res;
            // 设置contractForm 表单内容
            form.id = contract.id;
            form.name = contract.name;
            form.address = contract.address;
            form.enclosure = contract.enclosure;
            form.number = contract.number;
            form.begin_time = contract.begin_time;
            form.end_time = contract.end_time;
            form.reminder = contract.reminder;
            form.money = contract.money;
            form.member.name = contract.username;
            form.member.phone = contract.phone;
            form.mid = contract.mid;
            form.product = product;
            form.status = contract.status;
            this.contractFileList = [contract.hetong];
            this.extraFile = contract.fujian;

            // 设置一些状态
            this.showDialog = true;
            this.step = 3;
            this.mode = "EDIT";
            this.going = false;
          }
        })
        .catch(err => console.log(err));
    },

    // 表格按钮 “发起签约”点击事件处理
    qianyue() {
      // 发起签约 跟个人工作平台相关联
    },

    // 表格按钮 合同名称点击事件处理
    toDetail(id) {
      // this.$router.push({ path: `contract_detail`, query: { id } });
      this.showDetail = true;
      this.detailId = id;
    },

    // 新增合同 弹框关闭事件处理
    onContractClose() {
      this.showDialog = true;
      if (this.mode === "ADD") {
        if (this.going) {
          this.$confirm("新增合同还未保存，是否现在退出？", "提示", {
            cancalBtnText: "取消",
            confirmBtnText: "退出",
            duration: 0
          })
            .then(res => {
              this.showDialog = false;
              this.step = 1;
              this.active = 1;
              this.resetDialog();
            })
            .catch();
        } else {
          this.showDialog = false;
          this.step = 1;
          this.active = 1;
          this.resetDialog();
        }
      } else if (this.mode === "EDIT") {
        this.showDialog = false;
        this.step = 1;
        this.active = 1;
        this.resetDialog();
      }
    },

    // 按钮 新增合同
    onAddContract() {
      this.showDialog = true;
      this.step = 1;
      this.mode = "ADD";
    },

    // 新增合同 步骤条切换事件
    switchStep(index) {
      let step = this.step;
      if (step >= index) {
        this.active = index;
      }
    },

    // 新增合同 重置表单
    resetContractForm() {
      this.contractForm = {
        name: "", // 合同名称
        begin_time: null,
        end_time: null,
        reminder: null, // 到期提醒时间
        money: "", // 合同金额
        mid: "", // 客户 id
        address: "", // 合同存放地址
        enclosure: "", // 附件地址
        extra: [],
        product: [], // 产品数组
        member: {
          name: "",
          phone: ""
        }
      };
    },

    // 新增合同 “客户联系方式”输入处理
    onContractPhone() {
      getProduct(this.contractForm.member.phone)
        .then(({ code, product, user, list }) => {
          if (code === "200") {
            this.contractForm.product = product;
            this.contractForm.mid = user.id;
            this.contractForm.member.name = user.name;
            this.schemeList = list;
            product.forEach(({ id }) => this.schemeIdSet.add(id));
          } else {
            this.$message("输入的手机号没有对应的客户");
          }
        })
        .catch(err => {
          this.$message(err.mes);
        });
    },

    // 通用上传处理
    async beforeUpload(file) {
      let formData = new FormData();
      const extName = file.name.split(".").pop();
      if (!this.uploadOpt.accessType.includes(extName)) {
        this.$message({ type: "error", message: "请上传pdf文件" });
        return false;
      }
      formData.append("contract", file);
      return await uploadContracts(formData);
    },

    // 文件上传 合同
    async beforeContractUpload(file) {
      if (this.contractFileList.length === 0) {
        let res = null;
        try {
          res = await this.beforeUpload(file);
        } catch (err) {
          console.log(err);
        }
        if (res.code === "200") {
          this.contractForm.address = res.mes;
          this.contractFileList.push(file);
        }
        return false;
      } else {
        this.$message("只能上传一份合同，重新上传请点击叉号图标移除已上传的合同");
      }
    },
    // 文件上传 附件
    async beforeExtraUpload(file) {
      let res = null;
      try {
        res = await this.beforeUpload(file);
      } catch (err) {
        console.log(err);
      }
      if (res.code === "200") {
        console.log(res.mes);
        this.contractForm.extraFile.push(res.mes);
        this.extraFileList.push(file);
        console.log(this.extraFileList);
      }
      return false;
    },

    // 上传文件 移除已上传文件
    removeFile(index, mark) {
      if (this.mode === "EDIT") {
        return;
      }
      if (mark === "extra") {
        this.extraFileList.splice(index, 1);
      } else {
        this.contractFileList.splice(index, 1);
      }
    },

    // 收费项目 初始格式化表单（重置）
    initSchemeForm() {
      this.schemeForm = {
        name: "",
        image: "",
        description: "",
        begin_time: "",
        end_time: "",
        product_cost: "", // 项目费用
        payable: "", // 应付金额
        remark: ""
      };
    },

    // 收费项目 新增/编辑表单“确认”按钮点击事件处理
    onConfirm() {
      this.$refs.schemeForm.validate(flag => {
        if (flag) {
          if (this.schemeMode === "ADD") {
            this.contractForm.product.push(this.schemeForm);
          } else if (this.schemeMode === "EDIT") {
            this.$set(this.contractForm.product, this.schemeEditInd, this.schemeForm);
          }
          this.schemeIdSet.add(this.schemeForm.id);
          this.initSchemeForm();
          this.showForm = false;
        }
      });
    },

    // 收费项目 新增/编辑弹框关闭事件处理
    onSchemeDialogClose() {
      this.$refs.schemeForm.clearValidate();
      this.initSchemeForm();
    },

    // 收费项目 指定一项移除
    removeScheme(index) {
      if (this.contractForm.status == 3) {
        return;
      }
      const id = this.contractForm.product[index].id;
      this.contractForm.product.splice(index, 1);
      this.schemeIdSet.delete(id);
    },

    // 收费项目 指定一项编辑
    editScheme(index) {
      if (this.contractForm.status == 3) {
        return;
      }
      this.schemeMode = "EDIT";
      this.schemeEditInd = index;
      this.showForm = true;
      const scheme = this.contractForm.product[index];
      const schemeForm = this.schemeForm;
      schemeForm.id = scheme.id;
      schemeForm.name = scheme.name;
      schemeForm.begin_time = scheme.begin_time;
      schemeForm.end_time = scheme.end_time;
      schemeForm.product_cost = scheme.product_cost;
      schemeForm.payable = scheme.payable;
      schemeForm.remark = scheme.remark;
    },

    // 新增/编辑合同 保存合同
    onSaveContract() {
      if (this.mode === "ADD") {
        saveContract(this.contractForm)
          .then(res => {
            if (res.code === "200") {
              this.$message({ type: "success", message: "新增合同成功" });
              this.active = 1;
              this.step = 1;
              this.going = false;
              this.showDialog = false;
              this.resetDialog();
              this.getList();
            }
          })
          .catch(err => console.log(err));
      } else if (this.mode === "EDIT") {
        editContract(this.contractForm)
          .then(res => {
            if (res.code === "200") {
              this.$message({ type: "success", message: "编辑合同成功" });
              this.active = 1;
              this.step = 1;
              this.showDialog = false;
              this.resetDialog();
              this.getList();
            }
          })
          .catch(err => console.log(err));
      }
    },

    // 新增/编辑合同弹框 重置所有的状态
    resetDialog() {
      // 清除合同表单验证
      this.$refs.contractForm.clearValidate();
      // 重置合同表单
      this.resetContractForm();

      // 清空合同文件和附件列表
      this.contractFileList = [];
      this.extraFileList = [];

      // 初始化 schemeForm
      this.initSchemeForm();
      // 清空不可用产品id
      this.schemeIdSet.clear();
    },

    // 第一步 合同表单 确认
    onConfirmContract() {
      if (this.mode === "ADD") {
        this.$refs.contractForm.validate(flag => {
          if (flag) {
            this.active = 2;
            this.step = 2;
          }
        });
      } else {
        this.active = 2;
      }
    },
    // 第二步 合同表单
    onUploadConfirm() {
      if (this.mode === "ADD") {
        this.active = 3;
        this.step = 3;
      } else {
        this.active = 3;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";

.opt-button {
  margin-right: 20px;
}

.grid-c {
  width: calc(100% - 60px);
  // min-width: 1200px;
  // height: 120px;
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(2, 50%);
  grid-column-gap: 20px;
  grid-template-areas: "a b c " "d e f ";
}

@media screen and (max-width: 1366px) {
  .grid-c {
    grid-template-columns: repeat(2, 30%) repeat(1, 18%) repeat(1, 22%);
  }
}

.form-title {
  font-size: 20px;
  font-family: Source Han Sans SC;
  font-weight: 400;
  color: #252525;
  margin-left: 36px;
  margin-top: 20px;
}
.line {
  height: 1px;
  background: #e7e7e7;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 36px;
  margin-right: 36px;
}

.dialog-form {
  .dialog-input {
    width: 220px;
  }

  .btn-tooltip {
    width: 18px;
    padding: 0;
    border: 0;
    background: none;
    vertical-align: middle;
    &:hover {
      background: none;
      color: inherit;
    }
  }
}
.dialog-uploader {
  & ::v-deep .el-upload-dragger {
    width: auto;
    height: auto;
    border: none;
  }
  .upload-wrap {
    width: 240px;
    height: 140px;
    background: rgba(96, 156, 255, 0.1);
    border-radius: 4px;
    border: 1px dashed #4381e6;
    margin-right: 41px;
    .icon-folder {
      width: 48px;
      height: 42px;
      margin-bottom: 20px;
    }
    .tip1 {
      color: #3380fe;
      font-size: 14px;
      margin-bottom: 11px;
    }
    .tip2 {
      font-size: 12px;
      font-weight: 300;
      color: #609cff;
    }
  }

  .progress-wrap {
    width: 416px;
    height: 140px;
    overflow: scroll;
  }
}

.dialog-fee {
  position: relative;

  .btn-add-scheme {
    position: absolute;
    right: 36px;
    top: -5px;
  }
}
.scheme-form {
  color: #545454;
  .scheme-input {
    width: 240px;
    margin-right: 16px;
  }
  .scheme-textarea ::v-deep textarea {
    width: 270px;
    height: 100px;
  }
}
</style>
<style>
/* 新增\编辑弹框宽度 */
.dialog-dialog {
  min-height: 700px;
}

/* 详情弹框宽度 */
@media screen and (min-width: 1366px) and (max-width: 1440px) {
  .detail-dialog {
    min-width: 820px;
  }
}
@media screen and (min-width: 1441px) and (max-width: 1440px) {
  .detail-dialog {
    min-width: 920px;
  }
}
</style>

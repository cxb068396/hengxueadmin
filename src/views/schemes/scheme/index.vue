<template>
  <div class="app-container">
    <el-form
      :model="schemeSearch"
      class="adv-search"
      label-width="80px"
      label-position="right"
      ref="schemeSearchRef"
      style="margin-bottom: 20px"
      label-suffix=":"
    >
      <div class="grid-c">
        <el-form-item label="方案名称" prop="name">
          <el-input placeholder="请输入" v-model="schemeSearch.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="签约时间" prop="time">
          <el-date-picker
            v-model="schemeSearch.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <span data-tips="网格布局展位符"></span>
        <span data-tips="网格布局展位符"></span>

        <el-form-item label="合同编号">
          <el-input placeholder="请输入" v-model="schemeSearch.contract"></el-input>
        </el-form-item>
        <el-form-item label="签约客户" prop="kuhuname">
          <el-input placeholder="请输入" v-model="schemeSearch.kuhuname" clearable></el-input>
        </el-form-item>

        <div>
          <el-button type="primary" @click="getschemeList">查询</el-button>
          <el-button type="primary" class="reset" @click="resetAdvSearch">
            重置
          </el-button>
        </div>
        <!-- <el-form-item></el-form-item> -->
        <div style="text-align: right;">
          <el-button type="warning" @click="addscheme" style="" v-permission="'add_scheme'">
            <svg-icon class="icon" icon-class="hx-add" />
            新增方案
          </el-button>
          <el-button type="warning" @click="exportSchemes">
            <img class="icon" src="@/assets/icon/icon-export.png" alt="" />
            导出方案
          </el-button>
        </div>
      </div>
    </el-form>
    <el-table
      :data="schemeList"
      :cell-style="tableStyle.body"
      :header-cell-style="tableStyle.header"
      class="table"
      @select="onSelect"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="方案名称">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0" class="">{{ scope.row.name }}</span>
          <span v-else-if="scope.row.status == 1" class="started">{{ scope.row.name }}</span>
          <span v-else-if="scope.row.status == 2" class="finished">{{ scope.row.name }}</span>
          <span v-else-if="scope.row.status == 3" class="canceled">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="kuhuname" label="签约客户"></el-table-column>
      <el-table-column prop="contract" label="合同编号"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">未签约</span>
          <span v-if="scope.row.status == 1">已签约</span>
          <span v-if="scope.row.status == 2">已完成</span>
          <span v-if="scope.row.status == 3">已解约</span>
        </template>
      </el-table-column>
      <el-table-column prop="products_name" label="签约产品"></el-table-column>
      <el-table-column prop="schedule" label="完成进度"></el-table-column>
      <el-table-column prop="create_time" label="签约时间"></el-table-column>
      <el-table-column prop="finish_time" label="完成时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="editscheme(scope.row)"
            v-permission="'edit_scheme'"
          >
            编辑
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex-center row" style="height: 60px">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="schemeSearch.page"
        :limit.sync="schemeSearch.strip"
        @pagination="getschemeList"
      />
    </div>

    <el-dialog :visible="showDialog" @close="handleclose" class="dialog">
      <el-form
        label-position="right"
        label-width="100px"
        label-suffix=":"
        ref="addschemeForm"
        :model="schemeForm"
        :rules="addRules"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="方案名称" prop="name">
              <el-input
                placeholder="请输入方案名称"
                v-model="schemeForm.name"
                class="form-input"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="签约客户" prop="kuhuname">
              <el-input type="text" placeholder="请输入" v-model="schemeForm.kuhuname"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="签约状态" prop="status">
              <el-select
                v-model="schemeForm.status"
                placeholder="请选择"
                :disabled="formMode === 'ADD' ? true : false"
              >
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="合同编号" prop="contract">
              <el-input
                :disabled="formMode === 'ADD' ? true : false"
                type="text"
                placeholder="请输入"
                v-model="schemeForm.contract"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="签约产品" prop="product">
          <el-cascader
            :options="options"
            :props="props"
            clearable
            style="width: 300px"
            v-model="schemeForm.product"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="方案内容" prop="content">
          <tinymec-editor v-model="schemeForm.content" ref="editor" :url="pictureUrl" />
        </el-form-item>
      </el-form>

      <div slot="title">{{ formMode === "ADD" ? "新增方案" : "编辑方案" }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="preserve">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import table from "@/mixins/table";
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination";
import {
  getScheme,
  getSchemeDetail,
  addScheme,
  editScheme,
  addPicture,
  exportScheme
} from "@/api/schems/scheme";
import dayjs from "dayjs";
import TinymecEditor from "@/components/TEditor";
import { deleteChildren, iterTreeArray, listToTree, downloadFile } from "@/utils/index.js";
import axios from "axios";

export default {
  components: { Pagination, TinymecEditor },
  data() {
    return {
      pictureUrl: process.env.VUE_APP_BASE_API + "/admin/upload_img_scheme",
      showDialog: false,
      formMode: "ADD",
      total: 0,
      //查询条件
      schemeSearch: {
        page: 1,
        strip: 10,
        name: "",
        kuhuname: "",
        contract: "",
        date_start: "",
        date_end: "",
        time: ""
      },
      selectedId: [], // 批量选中的id
      schemeList: [],
      id: 0,
      schemeForm: {
        // 新增/编辑表单
        name: "",
        kuhuname: "",
        product_ids: "", // 产品id，多个使用英文状态下的“,”隔开
        content: "",
        product: "", // 签约状态，根据它生成 product_ids
        status: "", // 合同状态0未签约1已签约2已完成3已解约
        contract: "" // 合同编号
      },
      props: {
        multiple: true,
        label: "name",
        value: "id",
        children: "children",
        checkStrictly: true
      },
      options: [],
      types: [
        {
          value: 0,
          label: "未签约"
        },
        {
          value: 1,
          label: "已签约"
        },
        {
          value: 2,
          label: "完成签约"
        },
        {
          value: 3,
          label: "取消签约"
        }
      ],
      addRules: {
        name: [{ required: true, trigger: "blur", message: "方案名称不能为空" }],
        kuhuname: [{ required: true, trigger: "blur", message: "客户名称不能为空" }],
        product: [{ required: true, trigger: "blur", message: "产品选择不能为空" }],
        content: [{ required: true, trigger: "blur", message: "方案不能为空" }]
      }
    };
  },
  watch: {
    "schemeSearch.time": function(time) {
      if (!time) {
        this.schemeSearch.date_start = "";
        this.schemeSearch.date_end = "";
      } else {
        this.schemeSearch.date_start = dayjs(time[0]).format("YYYY-MM-DD HH:mm:ss");
        this.schemeSearch.date_end = dayjs(time[1]).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    "schemeForm.product": function(product) {}
  },
  mounted() {
    this.getschemeList();
  },
  mixins: [table],
  methods: {
    //获取方案列表
    async getschemeList() {
      try {
        const res = await getScheme({
          ...this.schemeSearch,
          page: this.schemeSearch.page - 1
        });
        if (res.code == "200") {
          this.total = res.mes.count;
          this.schemeList = res.mes.list;
        }
      } catch (err) {
        if (err.code === "400") {
          this.$message({ type: "error", message: err.mes });
        }
      }
    },
    resetAdvSearch() {
      this.$refs.schemeSearchRef.resetFields();
      this.schemeSearch.page = 1;
      this.getschemeList();
    },

    //新增方案
    addscheme() {
      this.showDialog = true;
      this.formMode = "ADD";
      getSchemeDetail()
        .then(res => {
          let options = deleteChildren(listToTree(res.mes.tree));
          this.options = options;
        })
        .catch(err => this.$message({ type: "error", message: err.mes }));
    },
    //编辑
    async editscheme(row) {
      let id = row.id;
      this.showDialog = true;
      this.formMode = "EDIT";
      const res = await getSchemeDetail(id);
      console.log(res);
      if (res.code == "200") {
        const { detail, tree } = res.mes;
        this.schemeForm.name = detail.name;
        this.schemeForm.kuhuname = detail.kuhuname;
        this.schemeForm.product_ids = detail.product_ids;
        this.schemeForm.content = detail.content;
        this.schemeForm.contract = detail.contract;
        this.schemeForm.status = detail.status;
        this.id = detail.id;
        let options = deleteChildren(listToTree(tree));
        this.options = options;
        if (this.schemeForm.product_ids != "") {
          var product_ids = this.schemeForm.product_ids.split(",");
          product_ids = product_ids.map(ele => Number.parseInt(ele));
          // 遍历 product_ids 元素，找到与之对应的节点，判断节点有没有父节点，直到找不到父节点
          var products = product_ids.map(ele => {
            let id = ele;
            var arr = [];
            while (id !== false) {
              for (let { node, parent } of iterTreeArray(options)) {
                if (node.id === id) {
                  arr.unshift(id);
                  id = parent ? parent.id : false;
                }
              }
            }
            return arr;
          });
          console.log(products);
          this.schemeForm.product = products;
        } else {
          this.schemeForm.product = [];
        }
      } else {
        this.$message({ type: "error", message: res.mes });
      }
    },

    //新增方案产品
    preserve() {
      if (Array.isArray(this.schemeForm.product)) {
        this.schemeForm.product_ids = this.schemeForm.product
          .map(ele => ele.slice(-1)[0])
          .join(",");
      }

      if (this.formMode === "ADD") {
        //addschemeForm
        this.$refs.addschemeForm.validate(valid => {
          if (valid) {
            addScheme(this.schemeForm)
              .then(res => {
                if (res.code == "200") {
                  this.showDialog = false;
                  this.getschemeList();
                }
              })
              .catch(err => this.$message({ type: "error", message: err.mes }));
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if (this.formMode === "EDIT") {
        //编辑
        this.$refs.addschemeForm.validate(valid => {
          if (valid) {
            editScheme({ ...this.schemeForm, id: this.id })
              .then(res => {
                if (res.code == "200") {
                  this.showDialog = false;
                  this.getschemeList();
                }
              })
              .catch(err => this.$message({ type: "error", message: err.mes }));
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    //刷新重置表单
    handleclose() {
      this.$nextTick(() => {
        this.$refs["addschemeForm"].resetFields();
        this.$refs["addschemeForm"].clearValidate();
        this.showDialog = false;
      });
    },

    // 导出方案
    exportSchemes() {
      const selectedId = this.selectedId;
      if (selectedId.length === 0) {
        this.$message({ type: "error", message: "请至少选择一项方案再点击导出" });
        return;
      } else {
        for (let n of selectedId) {
          exportScheme(n[0]).then(res => {
            downloadFile(res, n[1], "doc");
          });
        }
      }
    },

    onSelect(selection) {
      this.selectedId = selection.map(ele => [ele.id, ele.name]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/table-page.scss";
* {
  box-sizing: border-box;
}
.dialog {
  min-width: 1440px;
  box-sizing: border-box;
}
.orange {
  background-color: #f7931e;
  border-color: #f7931e;
  color: #ffffff;
}

.started {
  color: #4381e6;
}
.canceled {
  color: #acacac;
}
.finished {
  color: #f7931e;
}

.grid-c {
  width: calc(100% - 60px);
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 340px) auto 240px;
  grid-template-rows: repeat(2, 50%);
  grid-column-gap: 20px;
  grid-template-areas: "a b c " "d e f ";
}

@media screen and (max-width: 1440px) {
  .grid-c {
    grid-template-columns: repeat(2, 310px) auto 240px;
  }
}

.table {
  // 表头字体
  ::v-deep th {
    font-size: 16px !important;
  }
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
</style>

<template>
  <div class="app-container">
    <el-form
      :model="productSearch"
      class="adv-search"
      label-width="80px"
      label-position="right"
      ref="productSearchRef"
      label-suffix=":"
    >
      <div class="grid-c">
        <el-form-item label="产品ID" prop="id">
          <el-input placeholder="请输入" v-model="productSearch.id"></el-input>
        </el-form-item>

        <el-form-item label="产品名称" prop="name">
          <el-input placeholder="请输入" v-model="productSearch.name"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="getProductList">查询</el-button>
          <el-button type="primary" class="reset" @click="resetAdvSearch">
            重置
          </el-button>
        </el-form-item>

        <div :span="6" style="text-align: right;">
          <el-button
            type="warning"
            icon="el-icon-plus"
            @click="addProduct"
            v-permission="'add_product'"
          >
            新增产品
          </el-button>
        </div>
      </div>
    </el-form>

    <el-table
      :data="productList"
      :cell-style="tableStyle.body"
      :header-cell-style="tableStyle.header"
      class="table"
    >
      <el-table-column prop="id" label="产品ID"></el-table-column>
      <el-table-column prop="name" label="产品名称">
        <template slot-scope="scope">
          <el-link type="primary" @click="queryChild(scope.row.id)">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="产品图片">
        <template slot-scope="scope">
          <img :src="api + scope.row.image" style="height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="产品描述"></el-table-column>
      <el-table-column prop="create_time" label="创建时间"></el-table-column>
      <el-table-column prop="update_time" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="editProduct(scope.row)"
            v-permission="'edit_product'"
          >
            编辑
          </el-link>
          <el-link v-if="prodLevel === 2" type="primary" @click="returnBack">
            返回上级
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex-center row" style="height: 60px">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="productSearch.page"
        :limit.sync="productSearch.strip"
        @pagination="getProductList"
      />
    </div>

    <el-dialog :visible="showDialog" @close="handleclose" width="606px">
      <el-form
        label-position="right"
        label-width="100px"
        ref="addProductForm"
        :model="ProductForm"
        :rules="addRules"
      >
        <el-form-item label="产品名称:" prop="name">
          <el-input
            placeholder="请输入产品名称"
            class="form-input"
            style="width: 260px"
            v-model="ProductForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级产品:" prop="pid">
          <el-select v-model="ProductForm.pid" placeholder="顶级产品">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片:" prop="image">
          <div class="flex-start">
            <img v-if="ProductForm.image" :src="ProductForm.image" alt="" class="avatar" />
            <div class="flex-center column" style="align-items: flex-start; height: 120px">
              <el-upload action="" :before-upload="beforeUpload" :on-change="imgSaveToUrl">
                <el-button class="uploader">上传图片</el-button>
              </el-upload>
              <span class="tips">温馨提示：</span>
              <span class="tips">
                图片支持1:1尺寸大小（推荐240px*240px，jpg或png格式，最大支持1M）
              </span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="产品描述:" prop="description">
          <el-input
            type="textarea"
            placeholder="请输入"
            v-model="ProductForm.description"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="title">{{ formMode === "ADD" ? "新增产品" : "编辑产品" }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="preserve">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import table from "@/mixins/table";
import Pagination from "@/components/Pagination";
import { getProducrList, addProducrt, detailProducrt, editProducrt } from "@/api/schems/product";
export default {
  components: { Pagination },
  data() {
    return {
      api: process.env.VUE_APP_BASE_PICTURE_URL,
      value: "",
      imageUrl: "",
      showDialog: false,
      formMode: "ADD",
      total: 0,
      headers: { "Content-Type": "multipart/form-data" },
      id: "",
      //查询条件
      productSearch: {
        page: 1,
        strip: 10,
        id: "",
        pid: 0,
        name: ""
      },
      productList: [],
      forms: {},
      ProductForm: {
        name: "",
        pid: "",
        description: "",
        image: ""
      },
      options: [],
      addRules: {
        name: [{ required: true, trigger: "blur", message: "产品名称不能为空" }],
        description: [{ required: true, trigger: "blur", message: "产品描述不能为空" }],
        image: [{ required: true, trigger: "blur", message: "图片不能为空" }]
      },
      prodLevel: 1,
    };
  },

  mounted() {
    this.getProductList();
  },
  mixins: [table],
  methods: {
    //获取产品数量
    getProductList() {
      getProducrList({ ...this.productSearch, page: this.productSearch.page - 1 })
        .then(res => {
          this.total = res.mes.count;
          this.productList = res.mes.list;
        })
        .catch(err => {
          if (err.code === "400" && "暂时没有相关数据") {
            this.$message({ type: "info", message: "该产品没有子产品" });
            this.prodLevel = 1
            this.productSearch.pid = ''
          } else {
            this.$message({ type: "info", message: err.mes });
          }
        });
    },

    // 查询子级产品
    queryChild(id) {
      // this.$refs.productSearchRef.resetFields();
      this.productSearch.page = 1;
      this.productSearch.pid = id;
      this.getProductList();
      this.prodLevel = 2
    },
    // 返回上级 点击事件处理函数
    returnBack() {
      this.productSearch.page = 1;
      this.productSearch.pid = 0;
      this.getProductList();

      this.prodLevel = 1
    },
    resetAdvSearch() {
      this.$refs.productSearchRef.resetFields();
      this.productSearch.page = 1;
      this.getProductList();
    },

    //新增产品
    addProduct() {
      this.showDialog = true;
      this.formMode = "ADD";
      this.getdetail();
    },
    //编辑
    async editProduct(row) {
      this.id = row.id;
      this.showDialog = true;
      this.formMode = "EDIT";
      const res = await detailProducrt(this.id);
      if (res.code == "200") {
        this.options = [{ id: 0, name: "顶级产品" }, ...res.mes.list];
        const productForm = res.mes.detail;
        this.ProductForm.description = productForm.description;
        this.ProductForm.name = productForm.name;
        this.ProductForm.image = process.env.VUE_APP_BASE_PICTURE_URL + productForm.image;
        this.ProductForm.pid = productForm.pid;
      }
    },
    //获取详情
    async getdetail() {
      const res = await detailProducrt(this.id);
      console.log(res);
      this.options = [{ id: 0, name: "顶级产品" }, ...res.mes.list];
    },
    //新增保存产品
    preserve() {
      if (this.formMode == "ADD") {
        this.$refs.addProductForm.validate(valid => {
          if (valid) {
            if (!this.ProductForm.pid) {
              this.ProductForm.pid = 0;
            }
            let formData = new FormData();
            formData.append("image", this.forms);
            formData.append("name", this.ProductForm.name);
            formData.append("pid", this.ProductForm.pid);
            formData.append("description", this.ProductForm.description);
            addProducrt(formData).then(res => {
              if (res.code == "200") {
                this.$message({ type: "success", message: "添加成功" });
                this.showDialog = false;
                this.getProductList();
                // this.forms = {}
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$refs.addProductForm.validate(valid => {
          if (valid) {
            if (!this.ProductForm.pid) {
              this.ProductForm.pid = 0;
            }
            this.ProductForm.id = this.id;
            let formData = new FormData();
            const len = Object.keys(this.forms).length;
            if (len > 0) {
              formData.append("image", this.forms);
            }
            formData.append("name", this.ProductForm.name);
            formData.append("id", this.ProductForm.id);
            formData.append("pid", this.ProductForm.pid);
            formData.append("description", this.ProductForm.description);
            console.log(formData);
            editProducrt(formData).then(res => {
              if (res.code == "200") {
                this.$message({ type: "success", message: "编辑成功" });
                this.showDialog = false;
                this.getProductList();
                // this.forms = {}
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    //上传图片
    beforeUpload(file) {
      console.log(file);
      this.forms = file;
      return false;
    },
    imgSaveToUrl(event) {
      // 获取上传图片的本地URL，用于上传前的本地预览
      var URL = null;
      if (window.createObjectURL != undefined) {
        // basic
        URL = window.createObjectURL(event.raw);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        URL = window.URL.createObjectURL(event.raw);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        URL = window.webkitURL.createObjectURL(event.raw);
      }
      // 转换后的地址为 blob:http://xxx/7bf54338-74bb-47b9-9a7f-7a7093c716b5
      console.log(URL);
      this.ProductForm.image = URL;
    },
    // 自定义上传方法
    handleclose() {
      this.$nextTick(() => {
        this.$refs["addProductForm"].resetFields();
        this.showDialog = false;
      });
    }
  }
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
  // width: calc(100% - 60px);
  display: grid;
  grid-template-columns: repeat(2, 340px) 1fr 1fr;
  grid-template-rows: repeat(1, 50%);
  grid-column-gap: 20px;
  grid-template-areas: "a b c ";
}

@media screen and (max-width: 1440px) {
  .grid-c {
    grid-template-columns: repeat(2, 310px) repeat(2, 1fr);
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

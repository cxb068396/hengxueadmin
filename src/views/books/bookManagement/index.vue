<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-form
          :model="booksSearch"
          class="adv-search"
          label-width="80px"
          label-position="right"
          ref="booksSearchRef"
        >
          <div class="grid-c">
            <el-form-item label="标题">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="推送类型">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary">查询</el-button>
              <el-button type="primary" class="reset" @click="$refs.booksSearchRef.resetFields()">
                重置
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-button type="warning" icon="el-icon-plus" @click="addBook">新增书籍</el-button>
        <el-button type="warning" icon="el-icon-plus">导入书籍</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="bookList"
      :cell-style="tableStyle.body"
      :header-cell-style="tableStyle.header"
      class="table"
    >
      <el-table-column prop="" label="书籍名称">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="bookInfo">
            {{ scope.row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label="封面图片"></el-table-column>
      <el-table-column prop="" label="阶段"></el-table-column>
      <el-table-column prop="" label="专业"></el-table-column>
      <el-table-column prop="" label="客户ID"></el-table-column>
      <el-table-column prop="" label="书籍链接"></el-table-column>
      <el-table-column prop="" label="创建时间"></el-table-column>
      <el-table-column prop="" label="修改时间"></el-table-column>

      <el-table-column label="操作">
        <template>
          <el-link type="primary" :underline="false" @click="editBook">编辑</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex-center row" style="height: 60px">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="booksSearch.page"
        :limit.sync="booksSearch.strip"
        @pagination="getbookList"
      />
    </div>
    <!--用于显示添加和编辑书籍-->
    <el-dialog :visible="showDialog" @close="handleclose" width="606px">
      <el-form
        label-position="right"
        label-width="100px"
        ref="addBookForm"
        :model="BookForm"
        :rules="addRules"
      >
        <el-form-item label="书籍名称" prop="">
          <el-input class="userform-input" placeholder="请输入书籍名称"></el-input>
        </el-form-item>

        <el-form-item label="阶段" prop="">
          <el-select class="userform-input" v-model="value">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传多张图片" prop="">
          <el-upload
            ref="upload"
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="
              (file, fileList) => {
                uploadSuccess(file, fileList);
              }
            "
            :file-list="imageList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body class="checkPic">
            <img width="100%" :src="dialogImageUrl" alt="" />
            //图片预览的弹框
          </el-dialog>
          <div>温馨提示： 图片支持1:1尺寸大小（推荐240px*240px，jpg或png格式，最大支持1M）</div>
        </el-form-item>

        <el-form-item label="专业" prop="">
          <el-select class="userform-input" v-model="value">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户ID" prop="">
          <el-input class="userform-input" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="书籍链接" prop="">
          <el-input class="userform-input" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="书籍描述" prop="">
          <el-input class="userform-input" type="textarea" :row="5" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="title">{{ formMode === "ADD" ? "新增书籍" : "编辑书籍" }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="preserve">保存</el-button>
      </div>
    </el-dialog>

    <!--用于显示书籍信息-->

    <el-dialog
      :visible="showInfoDialog"
      :before-close="
        () => {
          showInfoDialog = false;
        }
      "
      width="504px"
    >
      <div class="book_info">
        <div class="book_image"></div>
        <div class="info">
          <div>
            书籍名称：
            <span>大语文</span>
          </div>
          <div>
            阶段：
            <span>八年级</span>
          </div>
          <div>
            类型：
            <span>义务教育必修课本</span>
          </div>
          <div>
            购买途径：
            <span class="info_text">京东</span>
          </div>
        </div>
      </div>
      <div class="recommended">
        <div class="reading">推荐阅读</div>
        <div class="recommended_list">
          <div class="list_left">
            <img src="" alt="" />
            <span>U0001</span>
          </div>
          <div class="list_middle">阅读已完成：20%</div>
          <div class="list_right">已购买</div>
        </div>
      </div>
      <div slot="title">书籍信息</div>
    </el-dialog>
  </div>
</template>

<script>
import table from "@/mixins/table";
import Pagination from "@/components/Pagination";

export default {
  components: { Pagination },
  data() {
    return {
      dialogImageUrl: "", //用于预览
      imageList: [], //用于回显
      dialogVisible: false, //用于显示图片
      showDialog: false, //用于显示添加编辑书籍
      showInfoDialog: false, //用于显示书籍信息
      value: "",
      formMode: "ADD",
      image: "",
      total: 0,
      //查询条件
      booksSearch: {
        page: 1,
        strip: 10,
      },
      bookList: [{ name: "语文" }],
      BookForm: {
        fileList: [],
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
      ],
      addRules: {},
    };
  },

  mounted() {
    this.getbookList();
  },
  mixins: [table],
  methods: {
    //获取书籍数量
    getbookList() {},
    //新增书籍
    addBook() {
      this.showDialog = true;
      this.formMode = "ADD";
    },
    //编辑
    editBook() {
      this.showDialog = true;
      this.formMode = "EDIT";
    },
    //新增保存书籍
    preserve() {
      var formData = new FormData();
      this.imageList.forEach((file) => {
        formData.append("fileList", file.raw);
      });
      console.log(formData);
      //2.回显操作时注意：已经上传了的图片已经不可以再次提交到后台再次上传，这个时候就需要你将已上传的图片过滤掉再上传，
      //可以在上传的时候判断图片的url中包不包含“blob”,如果包含则可以上传，若不包含说明已经上传过了需要过滤掉，此外还需要保持上传的顺序
      for (var item of JSON.parse(JSON.stringify(this.imageList)).reverse()) {
        if (!item.url && item.url.indexOf("blob") === -1) {
          this.BookForm.fileList.unshift(item.url);
        }
      }
    },
    //tabs切换时的事件
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //重置表单
    handleclose() {
      this.$nextTick(() => {
        this.$refs["addBookForm"].resetFields();
        this.showDialog = false;
      });
    },
    //删除已上传图片
    handleRemove(file, fileList) {
      //file是当前删除的图片，fileList是已上传图片列表
      this.imageList = fileList;
      //   this.fileList = fileList;
    },
    //图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传成功时的钩子
    uploadSuccess(file, fileList) {
      console.log(fileList);
      let that = this;
      var fileType = file.raw.type;
      var isJpg = false;
      if (fileType == "image/jpeg" || fileType == "image/png" || fileType == "image/jpg") {
        isJpg = true;
      }
      if (!isJpg) {
        this.$message({
          message: "上传的图标只能是jpg、png格式!",
          type: "error",
        });
        return false;
      }
      // this.fileList = fileList;
      this.imageList = fileList;
    },

    //显示书籍信息
    bookInfo() {
      this.showInfoDialog = true;
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
  width: 80%;
  min-width: 1200px;
  height: 120px;
  display: grid;
  grid-template-columns: repeat(3, 25%);
  grid-template-rows: repeat(2, 50%);
  grid-column-gap: 20px;
  grid-template-areas: "a b c " "d e f ";
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
.book_info {
  display: flex;
  margin: 50px 0 0 45px;
  .book_image {
    width: 144px;
    height: 180px;
    background-color: #ccc;
  }
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 38px;
    div {
      font-size: 10px;
      color: #666;
      margin-bottom: 17px;
      span {
        margin-left: 10px;
      }
      .info_text {
        font-size: 12px;
        color: #f65952;
      }
    }
  }
}
.recommended {
  margin: 30px 0 0 45px;
  .reading {
    color: #333;
    font-size: 12px;
  }
  .recommended_list {
    width: 410px;
    height: 58px;
    display: flex;
    font-size: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 12px 10px;
    margin: 20px 0;
    border: 1px dotted #999;
    .list_left {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        margin-right: 20px;
      }
      span {
        color: #999;
      }
    }
    .list_middle {
      color: #f65952;
    }
    .list_right {
      width: 44px;
      height: 18px;
      background: #4381e6;
      border-radius: 9px;
      text-align: center;
      line-height: 18px;
      color: #fff;
    }
    .list_right_default {
      width: 44px;
      height: 18px;
      background: #d6d6d6;
      border-radius: 9px;
      text-align: center;
      line-height: 18px;
      color: #fff;
    }
  }
}
</style>


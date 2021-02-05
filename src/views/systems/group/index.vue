<template>
  <div class="app-container">
    <div class="index-top">
      <span class="index-top-word">角色名称:</span>
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
        v-permission="'add_group'"
      >
        + 新增角色
      </el-button>
    </div>

    <div class="index-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        :cell-style="tableStyle.body"
        :header-cell-style="tableStyle.header"
      >
        <el-table-column fixed prop="title" label="角色名称"></el-table-column>
        <el-table-column prop="sort" label="角色排序"></el-table-column>
        <el-table-column prop="description" label="角色描述"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="editRoleVisible(scope.$index)"
              type="text"
              style="font-size: 14px"
              v-permission="'edit_group'"
            >
              编辑
            </el-button>

            <el-button
              type="text"
              size="small"
              style="color: #f7931e; font-size: 14px"
              @click="delRoleVisible(scope.$index)"
              v-permission="'del_group'"
            >
              删除
            </el-button>
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
        :total="count"
        style="display: inline-block"
      ></el-pagination>
      <!-- <el-button type="primary" @click="handleSizeChange">确定</el-button><br> -->
    </div>
    <div class="pag-bottom" v-if="count > 0">
      共{{ count }}条记录 第{{ currentPage }}/{{ Math.ceil(count / 10) }}页
    </div>
    <div class="pag-bottom" v-else>共{{ count }}条记录 第{{ currentPage }}/1页</div>

    <el-dialog
      title="新增角色"
      :visible.sync="dialogAdd"
      :append-to-body="true"
      style="width: 680px; margin-left: 35%"
    >
      <el-form :model="form" ref="addFormRef" :rules="rules">
        <el-form-item label="角色名称:" :label-width="formLabelWidth" prop="roleName">
          <el-input
            v-model="form.title"
            autocomplete="off"
            placeholder="请输入角色名称"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序:" :label-width="formLabelWidth" prop="roleSort">
          <el-input
            v-model="form.sort"
            autocomplete="off"
            placeholder="请输入排序"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" :label-width="formLabelWidth" prop="roleDes">
          <el-input
            v-model="form.description"
            autocomplete="off"
            placeholder="请输入"
            style="width: 100%"
            maxlength="255"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="角色编辑"
      :visible.sync="dialogEdit"
      :append-to-body="true"
      style="width: 680px; margin-left: 35%"
    >
      <el-form :model="editForm" :rules="rules">
        <el-form-item label="角色名称:" :label-width="formLabelWidth" prop="roleEName">
          <el-input
            v-model="editForm.title"
            autocomplete="off"
            placeholder="请输入角色名称"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序:" :label-width="formLabelWidth" prop="roleSort">
          <el-input
            v-model="editForm.sort"
            autocomplete="off"
            placeholder="请输入排序"
            style="width: 100%"
            :min="0"
            :max="99"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" :label-width="formLabelWidth" prop="roleDes">
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
        <el-button type="primary" @click="editRole">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog :append-to-body="true" title="删除角色" :visible.sync="dialogDel" width="20%">
      <span>删除后无法恢复，您还继续吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="delRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Tag } from "element-ui";
import table from "@/mixins/table";
import { getRoles, addRoles, editRoles, delRoles } from "@/api/sys/role";
import { isvalidatemobile, validEmail } from "@/utils/validate";
export default {
  name: "App",
  data() {
    var roleName = (rule, value, callback) => {
      console.log(this.form.title.length);
      if (this.form.title === "") {
        return callback(new Error("角色名称不能为空"));
      }

      const zhReg = /^[\u4e00-\u9fa5]*$/;
      const enReg = /^[a-zA-Z]*$/;
      if (!zhReg.test(this.form.title) && !enReg.test(this.form.title)) {
        callback(new Error("只支持中英文输入且不能混合输入"));
      } else {
        callback();
      }

      if (this.form.title.length < 2) {
        callback(new Error("最短输入两个长度的内容"));
      }
    };
    var roleSort = (rule, value, callback) => {
      if (this.form.sort === "" && this.editForm.sort === "") {
        callback(new Error("排序不能为空"));
      }
    };
    var roleDes = (rule, value, callback) => {
      if (this.form.description === "" && this.editForm.description === "") {
        callback(new Error("角色描述不能为空"));
      }
    };
    var roleEName = (rule, value, callback) => {
      if (this.editForm.title === "") {
        return callback(new Error("角色名称不能为空"));
      }
      const zhReg = /^[\u4e00-\u9fa5]*$/;
      const enReg = /^[a-zA-Z]*$/;
      if (!zhReg.test(this.editForm.title) && !enReg.test(this.editForm.title)) {
        callback(new Error("只支持中英文输入且不能混合输入"));
      } else {
        callback();
      }

      if (this.editForm.title.length < 2) {
        callback(new Error("最短输入两个长度的内容"));
      }
    };
    return {
      search: "",
      tableData: [],
      editForm: {
        id: "",
        title: "",
        sort: "",
        description: "",
      },
      delForm: {
        id: "",
      },
      dialogFormVisible: false,
      dialogAdd: false,
      dialogEdit: false,
      dialogDel: false,
      form: {
        title: "",
        sort: "",
        description: "",
      },
      formLabelWidth: "80px",
      pagesize: 10, //每页多少数据
      currentPage: 1, //默认当前页为第一页(初始页)
      goodsData: [],
      allPage: "", //角色名称总个数
      count: 0,

      rules: {
        roleName: [{ validator: roleName, trigger: "blur" }],
        roleSort: [{ validator: roleSort, trigger: "blur" }],
        roleDes: [{ trigger: "blur", validator: roleDes }],
        roleEName: [{ trigger: "blur", validator: roleEName }],
      },
    };
  },
  watch: {
    "editForm.sort": function (sort) {
      const val = Number.parseInt(sort);
      if (val < 0) {
        this.editForm.sort = 0;
      } else if (val > 99) {
        this.editForm.sort = 99;
      }
    },
    "form.sort": function (sort) {
      const val = Number.parseInt(sort);
      if (val < 0) {
        this.form.sort = 0;
      } else if (val > 99) {
        this.form.sort = 99;
      }
    },
  },
  mixins: [table],
  created() {
    this.getRole();
  },
  methods: {
    getRole() {
      getRoles(this.currentPage - 1, this.search, this.pagesize)
        .then((res) => {
          this.tableData = res.mes.list;
          this.count = res.mes.count;
          this.allPage = res.mes.count;
          console.log(this.tableData.keyword);
          console.log(this.tableData);
          console.log("全部数据：" + res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点击新增按钮确定添加用户
    addUser() {
      let that = this;
      addRoles(that.form.title, that.form.sort, that.form.description)
        .then((res) => {
          this.getRole();
          this.dialogAdd = false;
          this.form.title = "";
          this.form.sort = "";
          this.form.description = "";
          console.log("添加成功" + res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editRoleVisible(index) {
      this.dialogEdit = true;
      let role = this.tableData[index];
      this.editForm = {
        id: role.id,
        title: role.title,
        sort: role.sort,
        description: role.description,
      };
    },
    editRole() {
      let that = this;
      editRoles(
        that.editForm.id,
        that.editForm.title,
        that.editForm.sort,
        that.editForm.description
      )
        .then((res) => {
          this.getRole();
          this.dialogEdit = false;
          console.log("我是編輯成功的：" + res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delRoleVisible(index) {
      this.dialogDel = true;
      let delRole = this.tableData[index];
      this.delForm = {
        id: delRole.id,
      };
    },
    delRole() {
      var that = this;
      delRoles(that.delForm.id)
        .then((res) => {
          this.getRole();
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
      this.getRole();
    },
    // 重置
    reset() {
      this.search = "";
      this.currentPage = 1;
      this.getRole();
    },
    handleSizeChange(size) {
      this.pagesize = size;
      // this.getRole();
      console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      //改变当前页
      this.currentPage = currentPage;
      this.getRole();
      console.log(this.currentPage);
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
  font-size: 8px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  text-align: center;
  margin-top: 5px;
}
</style>
